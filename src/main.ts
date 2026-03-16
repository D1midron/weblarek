import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/Events';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ProductBasket } from './components/models/ProductBasket';
import { Buyer } from './components/models/Buyer';

import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/models/Page';
import { Modal } from './components/models/Modal';
import { Basket } from './components/Basket';
import { CardCatalog, CardPreview, CardBasket } from './components/Card';
import { IBuyer, IProduct } from './types';
import { cloneTemplate } from './utils/utils'; 
import { OrderForm, ContactsForm } from './components/Order';
import { Success } from './components/Success';
// --- 1. Инициализация инфраструктуры ---
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

// --- 3. Модели данных (передаем брокер событий) ---
const catalogModel = new ProductCatalog(events);
const basketModel = new ProductBasket(events);
const buyerModel = new Buyer(events);

// --- 4. Компоненты представления (View) ---
const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

// Глобальные контейнеры
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

/**
 * --- 5. Логика приложения (Презентер) ---
 */

// Изменение каталога (Шаг 4: реакция на событие модели)
events.on('items:changed', () => {
    const cards = catalogModel.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
    page.catalog = cards;
});

// Получение данных с сервера
api.getProductList()
    .then((products) => {
        catalogModel.setItems(products);
    })
    .catch(err => console.error(err));

// Открытие превью товара
events.on('card:select', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('card:toBasket', item)
    });
    modal.render({
        content: card.render(item)
    });
});

// Реакция на изменение корзины (обновление счетчика и вида корзины)
events.on('basket:changed', () => {
    page.counter = basketModel.getCount();
    
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
 * --- Оформление заказа ---
 */

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

// Валидация форм при изменении модели Buyer
events.on('buyer:changed', () => {
    const validation = buyerModel.validateAll();
    
    order.valid = !validation.errors.payment && !validation.errors.address;
    order.errors = Object.values(validation.errors).filter(i => !!i).join('; ');

    contacts.valid = !validation.errors.email && !validation.errors.phone;
    contacts.errors = Object.values(validation.errors).filter(i => !!i).join('; ');
});

// Обработка ввода (универсальный слушатель изменений полей)
events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyerModel.save({ [data.field]: data.value });
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
    const orderData = {
        ...buyerModel.getAll(),
        items: basketModel.getItems().map(item => item.id),
        total: basketModel.getTotal()
    };

    api.orderProducts(orderData)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });

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