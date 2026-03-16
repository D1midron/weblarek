import { IProduct } from "../../types";
import { IEvents } from '../base/Events';
export class ProductBasket {
    protected items: IProduct[] = [];

    constructor(protected events: IEvents) {}
     
    getItems(): IProduct[] {
        return this.items;
    }
    addItem(product: IProduct) {
        if (!this.items.find(item => item.id === product.id)) {
            this.items.push(product);
            // Уведомляем об изменении корзины
            this.events.emit('basket:changed', this.items);
        }
    }

    removeItem(id: string) {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('basket:changed', this.items);
    }

    clear() {
        this.items = [];
        this.events.emit('basket:changed', this.items);
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(productId: string): boolean {
        return this.items.some((item) => item.id === productId);
    }
}