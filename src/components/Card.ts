import { Component } from './base/Component';
import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';
import {ICardBasket } from '../types';
// Интерфейс для действий с карточкой (обработчики событий)
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// Базовый класс карточки
export class Card<T> extends Component<IProduct & T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = container.querySelector(`.${blockName}__title`) as HTMLElement;
        this._price = container.querySelector(`.${blockName}__price`) as HTMLElement;
        this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

        set title(value: string) {
            this._title.textContent = value;
        }

        set price(value: number | null) {
            this._price.textContent = value 
            ? `${value} синапсов` 
            : 'Бесценно';
        
            if (!value && this._button) {
            this._button.disabled = true;
            }
        }

}

// 1. Карточка в каталоге (главная страница)
export class CardCatalog extends Card<object> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
    }

    set category(value: keyof typeof categoryMap) {
        this._category.textContent = value;
        // Сбрасываем старые классы и добавляем нужный из констант
        this._category.className = `card__category ${categoryMap[value]}`;
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }
}

// 2. Карточка в модальном окне (превью)
export class CardPreview extends CardCatalog {
    protected _text: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this._text = container.querySelector('.card__text') as HTMLElement;
    }

    set text(value: string) {
        this._text.textContent = value;
    }
}

// 3. Карточка в корзине
export class CardBasket extends Card<ICardBasket> { // Передаем интерфейс сюда
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._index = container.querySelector('.basket__item-index') as HTMLElement;
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}
