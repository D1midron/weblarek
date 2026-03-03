export  interface BasketItem {
        product: IProduct;
        quantity: number;}
export interface IProduct {
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number | null;
    }
export class ProductBasket {
                private items: BasketItem[] = [];
                getItems(): BasketItem[] {
                    return this.items;
                }

                // Добавление товара, полученного в параметре, в массив корзины
                    addItem(product: IProduct): void {
                     const found = this.items.find((ci) => ci.product.id === product.id);
                        if (found) {
                            found.quantity += 1;
                        } 
                        else {
                            this.items.push({ product, quantity: 1 });
                        }
                    }
                removeItem(product: IProduct): void {
                    const index = this.items.findIndex((ci) => ci.product.id === product.id);
                        if (index !== -1) {
                            this.items.splice(index, 1);
                        }
                }
                clear(): void {
                    this.items = [];
                }
                getTotal(): number {
                    return this.items.reduce((sum, ci) => sum + ((ci.product?.price ?? 0) * (ci.quantity ?? 0)), 0);
                }
                getCount(): number {
                return this.items.reduce((sum, ci) => sum + ci.quantity, 0);
                }
                hasItem(productId: string): boolean {
                    return this.items.some((ci) => ci.product.id === productId);
                }             
            }