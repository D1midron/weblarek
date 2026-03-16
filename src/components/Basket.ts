import { Component } from './base/Component';
import { IEvents } from './base/Events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }

        this.items = []; // Инициализируем пустым списком
    }

       set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this._list.replaceChildren(...items);
            this._button.disabled = false; // Разблокируем кнопку напрямую
        } else {
            this._list.replaceChildren('Корзина пуста');
            this._button.disabled = true; // Блокируем кнопку напрямую
        }
    }

        set total(total: number) {
        this._total.textContent = `${total} синапсов`;
        }


    protected setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }
}
