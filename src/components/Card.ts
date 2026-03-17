import { Component } from './base/Component';
import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';
import {ICardBasket } from '../types';
// Интерфейс для действий с карточкой
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// 1. БАЗОВЫЙ КЛАСС (только общее)
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
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (!value && this._button) {
            this.setDisabled(this._button, true);
        }
    }
}

// 2. КАРТОЧКА КАТАЛОГА (добавляем картинку и категорию)
export class CardCatalog<T = object> extends Card<T> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        // Мы используем 'card' как базовое имя блока для поиска элементов
        super('card', container, actions);
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
    }

    set category(value: keyof typeof categoryMap) {
        this.setText(this._category, value);
        this._category.className = `card__category ${categoryMap[value]}`;
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }
}
// 3. КАРТОЧКА ПРЕВЬЮ (наследуем от каталога, добавляем описание и текст кнопки)
interface ICardPreview {
    text: string;
    buttonText: string;
}

export class CardPreview extends CardCatalog<ICardPreview> {
    protected _text: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this._text = container.querySelector('.card__text') as HTMLElement;
    }

    set text(value: string) {
        this.setText(this._text, value);
    }

    set buttonText(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }
    set price(value: number | null) {
    // Устанавливаем текст цены
    this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    
    if (this._button) {
        if (!value) {
            // Если цены нет — блокируем и пишем "Недоступно
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Недоступно');
        } else {
            this.setDisabled(this._button, false);
        }
    }
}
}

// 4. КАРТОЧКА КОРЗИНЫ (наследуем от базовой Card, добавляем индекс)
export class CardBasket extends Card<ICardBasket> {
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._index = container.querySelector('.basket__item-index') as HTMLElement;
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}
