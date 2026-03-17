
import { IProduct } from '../../types'; // Импортируем готовый интерфейс
import { IEvents } from '../base/Events';
export class ProductCatalog {
    protected items: IProduct[] = [];
    protected selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    // 1. Исправлено: setItems должен только сохранять товары и уведомлять об этом
    setItems(items: IProduct[]) {
        this.items = [...items];
        // Уведомляем презентер, что товары загружены, чтобы он их отрисовал
        this.events.emit('items:changed', { items: this.items });
    }

    getItems() {
        return this.items;
    }

    // 2. Исправлено: убираем emit('card:select'), чтобы не было бесконечного цикла
    setSelected(product: IProduct) {
        this.selectedProduct = product;
        // Событие 'card:select' уже генерируется в классе Card при клике, 
        // здесь дублировать его не нужно, иначе приложение зависнет.
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find((i) => i.id === id);
    }

    getSelected(): IProduct | null {
        return this.selectedProduct;
    }
}
