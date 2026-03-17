import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/Events';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ProductBasket } from './components/models/ProductBasket';
import { Buyer } from './components/models/Buyer';

import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { CardCatalog, CardPreview, CardBasket } from './components/Card';
import { IBuyer, IProduct } from './types';
import { cloneTemplate } from './utils/utils'; 
import { OrderForm, ContactsForm } from './components/Order';
import { Success } from './components/Success';
import { Header } from './components/Header';
const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// --- 2. Шаблоны (Templates) ---
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// --- 3. Модели данных ---
const catalogModel = new ProductCatalog(events);
const basketModel = new ProductBasket(events);
const buyerModel = new Buyer(events);

// --- 4. Компоненты представления (View) ---
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Создаем превью карточки один раз
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
        const item = catalogModel.getSelected();
        if (item) {
            if (basketModel.hasItem(item.id)) {
                basketModel.removeItem(item.id);
                cardPreview.buttonText = 'В корзину';
            } else {
                events.emit('card:toBasket', item);
                cardPreview.buttonText = 'Удалить из корзины';
            }
        }
    }
});

const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        modal.close();
    }
});

/**
 * --- 5. Логика приложения (Презентер) ---
 */

// Изменение каталога (обновляем компонент Page)
events.on('items:changed', () => {
    page.catalog = catalogModel.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
});

api.getProductList()
    .then((products) => {
        catalogModel.setItems(products);
    })
    .catch(err => console.error(err));

// Открытие превью товара
events.on('card:select', (item: IProduct) => {
    catalogModel.setSelected(item);
    const isInBasket = basketModel.hasItem(item.id);
    
    // Определяем текст кнопки
    let buttonTitle = isInBasket ? 'Удалить из корзины' : 'В корзину';
    
    // Если цены нет — текст всегда "Недоступно"
    if (!item.price) {
        buttonTitle = 'Недоступно';
    }

    modal.render({
        content: cardPreview.render({
            ...item,
            buttonText: buttonTitle
        })
    });
});

// Реакция на изменение корзины
events.on('basket:changed', () => {
    header.counter = basketModel.getCount();
    
    const items = basketModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => basketModel.removeItem(item.id)
        });
        return card.render({
            ...item,
            index: index + 1
        });
    });

    basketView.render({
        items,
        total: basketModel.getTotal()
    });
});

events.on('card:toBasket', (item: IProduct) => {
    basketModel.addItem(item);
    modal.close();
});

events.on('basket:open', () => {
    modal.render({
        content: basketView.render()
    });
});

// Блокировка прокрутки
events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

/**
 * --- Оформление заказа (Связь View -> Model) ---
 */

// Слушаем изменения во всех полях ввода
events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    // Добавляем проверку безопасности
    if (data && data.field) {
        buyerModel.save({ [data.field]: data.value });
    }
});

// Реакция на изменение модели (Валидация)
events.on('buyer:changed', () => {
    const validation = buyerModel.validateAll();
    
    // Используем безопасный доступ через опциональную цепочку ?. и значения по умолчанию
    const errors = validation?.errors || {};
    const payment = errors.payment || '';
    const address = errors.address || '';
    const email = errors.email || '';
    const phone = errors.phone || '';

    order.valid = !payment && !address;
    order.errors = [payment, address].filter(Boolean).join(' и ');

    contacts.valid = !email && !phone;
    contacts.errors = [email, phone].filter(Boolean).join(' и ');
});

events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: '' 
        })
    });
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: ''
        })
    });
});

events.on('contacts:submit', () => {
    // Перед отправкой проверяем, нет ли ошибок (защита от "выброса")
    const validation = buyerModel.validateAll();
    if (!validation.valid) return;

    const orderData = {
        ...buyerModel.getAll(),
        items: basketModel.getItems().map(item => item.id),
        total: basketModel.getTotal()
    };

    api.orderProducts(orderData)
        .then((result) => {
            modal.render({
                content: success.render({
                    total: result.total
                })
            });
            basketModel.clear();
            buyerModel.clear();
        })
        .catch(err => console.error(err));
});