
import { IProduct } from '../../types'; // Импортируем готовый интерфейс
import { IEvents } from '../base/Events';
export class ProductCatalog {
    protected items: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    // Добавляем события в конструктор
    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]) {
        this.items = [...items];
        // Генерируем событие изменения каталога
        this.events.emit('items:changed', { items: this.items });
    }

    getItems() {
        return this.items;
    }

    setSelected(product: IProduct) {
        this.selectedProduct = product;
        // Генерируем событие выбора товара
        this.events.emit('card:select', product);
    }

  // Устанавливает весь массив продуктов

  // Поиск продукта по id
  getProductById(id: string): IProduct | undefined {
    return this.items.find((i) => i.id === id);
  }

  // Установка выбранного продукта
 

  // Получение выбранного продукта
    getSelected(): IProduct | null {
        return this.selectedProduct;
    }
}