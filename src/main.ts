import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Buyer } from './components/models/Buyer'
import { ProductBasket } from './components/models/ProductBasket'
import { ProductCatalog } from './components/models/ProductCatalog';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';

// --- 1. Проверка ProductCatalog ---
console.log('--- Проверка ProductCatalog ---');

// Создаем экземпляр (указываем тип данных, так как класс универсальный/generic)
const catalog = new ProductCatalog();

// Сохраняем данные из apiProducts.items
catalog.setItems(apiProducts.items);

// Проверяем получение всех товаров
const allProducts = catalog.getItems();
console.log('Массив товаров из каталога:', allProducts);

// Проверяем поиск по ID (берем ID первого товара из списка)
if (allProducts.length > 0) {
    const firstId = allProducts[0].id;
    const foundProduct = catalog.getProductById(firstId);
    console.log(`Товар найден по ID (${firstId}):`, foundProduct);

    // Проверяем выбор товара для подробного просмотра
    catalog.setSelected(foundProduct);
    console.log('Выбранный товар:', catalog.getSelected());
}

// --- 2. Проверка ProductBasket ---
console.log('\n--- Проверка ProductBasket ---');

const basket = new ProductBasket();

// Добавляем пару товаров из каталога в корзину
if (allProducts.length >= 2) {
    basket.addItem(allProducts[0]);
    basket.addItem(allProducts[0]); // Добавим тот же товар еще раз (проверка quantity)
    basket.addItem(allProducts[1]);
}

console.log('Содержимое корзины:', basket.getItems());
console.log('Общая сумма:', basket.getTotal());
console.log('Количество позиций в корзине (total count):', basket.getCount());

// Проверка наличия
console.log('Есть ли в корзине первый товар?:', basket.hasItem(allProducts[0].id));

// Удаление товара
basket.removeItem(allProducts[0].id);
console.log('Корзина после удаления первого товара:', basket.getItems());

// --- 3. Проверка Buyer ---
console.log('\n--- Проверка Buyer ---');

const buyer = new Buyer();

// Сохраняем данные по частям (проверка Partial)
buyer.save({ 
    email: 'test@example.com',
    address: 'ул. Пушкина, д. 10'
});

// Сохраняем одно поле отдельно
buyer.save({ phone: '+7 999 000 11 22' });
buyer.save({ payment: 'card' });

console.log('Данные покупателя:', buyer.getAll());

// Проверка валидации
const validationBefore = buyer.validateAll();
console.log('Валидация заполненого покупателя:', validationBefore.valid ? 'Успешно' : 'Ошибки:', validationBefore.errors);

// Проверка очистки и невалидных данных
buyer.clear();
const validationAfter = buyer.validateAll();
console.log('Валидация после очистки (должна быть false):', validationAfter.valid);
console.log('Ошибки валидации:', validationAfter.errors);
console.log('--- Работа с сервером ---');
const api = new AppApi(CDN_URL, API_URL);
api.getProductList()
    .then((products) => {
        // Записываем полученные данные в модель каталога
        catalog.setItems(products);

        // Выводим результат работы метода getItems в консоль
        console.log('Данные успешно загружены с сервера и сохранены в модель.');
        console.log('Результат метода getItems():', catalog.getItems());

        // Здесь можно продолжить тесты, если нужно:
        // например, добавить первый пришедший с сервера товар в корзину
        if (products.length > 0) {
            basket.addItem(products[0]);
            console.log('Товар с сервера добавлен в корзину:', basket.getItems());
        }
    })
    .catch((err) => {
        // Обязательная обработка ошибок
        console.error('Ошибка при получении данных от сервера:', err);
    });