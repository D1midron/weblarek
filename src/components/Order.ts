import { Form } from './models/Form';
import { IEvents } from './base/Events';

// Интерфейс для данных формы заказа
interface IOrderForm {
    address: string;
    payment: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        // Ищем все альтернативные кнопки (способы оплаты)
        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.onInputChange('payment', button.name);
            });
        });
    }

    set payment(name: string) {
        this._buttons.forEach(button => {
            // Переключаем класс 'button_alt-active' согласно ТЗ
            button.classList.toggle('button_alt-active', button.name === name);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

// Интерфейс для данных формы контактов
interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}
