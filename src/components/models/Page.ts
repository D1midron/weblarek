import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import {IPage} from "../../types";


export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = container.querySelector('.header__basket-counter') as HTMLButtonElement;
        this._catalog = container.querySelector('.gallery') as HTMLButtonElement;
        this._wrapper = container.querySelector('.page__wrapper') as HTMLButtonElement;
        this._basket = container.querySelector('.header__basket') as HTMLButtonElement;

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
