
import { IProduct } from '../../types'; // Импортируем готовый интерфейс

export class ProductCatalog {
  private items: IProduct[] = [];
  private selectedProduct?: IProduct;

  constructor(items?: IProduct[]) {
    if (items?.length) {
      this.items = [...items];
    }
  }

  // Устанавливает весь массив продуктов
  setItems(items: IProduct[] = []): void {
    this.items = [...items];
  }

  // Возвращает копию массива продуктов
  getItems(): IProduct[] {
    return [...this.items];
  }

  // Поиск продукта по id
  getProductById(id: string): IProduct | undefined {
    return this.items.find((i) => i.id === id);
  }

  // Установка выбранного продукта
  setSelected(product: IProduct | undefined): void {
    this.selectedProduct = product;
  }

  // Получение выбранного продукта
  getSelected(): IProduct | undefined {
    return this.selectedProduct;
  }
}