import { Api } from './base/Api'; // Импортируем базу
import { IProduct, IOrder, IOrderResult } from '../types/index';


export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

export class AppApi extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options); 
        this.cdn = cdn;
    }

    
    getProductList(): Promise<IProduct[]> {
        return this.get<IProductListResponse>('/product').then((data) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post<IOrderResult>('/order', order);
    }
}