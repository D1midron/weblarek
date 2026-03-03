export interface ProductLike {
  id:string;
}

export class ProductCatalog<T extends ProductLike> {
  private items: T[] = [];
  private selectedProduct?: T;

  constructor(items?: T[]) {
    if (items?.length) {
      this.items = [...items];
    }
  }

  // Устанавливает весь массив продуктов
  setItems(items: T[] = []): void {
    this.items = [...items];
  }

  // Возвращает копию массива продуктов
  getItems(): T[] {
    return [...this.items];
  }

  // Поиск продукта по id
  getProductById(id: string): T | undefined {
    return this.items.find((i) => i.id === id);
  }

  // Установка выбранного продукта
  setSelected(product: T | undefined): void {
    this.selectedProduct = product;
  }

  // Получение выбранного продукта
  getSelected(): T | undefined {
    return this.selectedProduct;
  }
}