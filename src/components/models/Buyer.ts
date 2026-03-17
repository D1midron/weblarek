import { TOrderErrors, IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
    protected data: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };

    constructor(protected events: IEvents) {}

    // Сохранение данных и уведомление об изменениях
    save(data: Partial<IBuyer>) {
        this.data = { ...this.data, ...data };
        this.events.emit('buyer:changed', this.data);
    }

    // Получение текущего состояния данных
    getAll(): IBuyer {
        return { ...this.data };
    }

    // Очистка данных
    clear() {
        this.data = { payment: '', email: '', phone: '', address: '' };
        this.events.emit('buyer:changed', this.data);
    }

    // Валидация конкретного поля
  validateField(field: keyof IBuyer): { valid: boolean; error?: string } {
    const value = this.data[field];
    
    // Проверка на пустоту
    if (!value || String(value).trim().length === 0) {
        const fieldLabels: Record<keyof IBuyer, string> = {
            payment: 'способ оплаты',
            address: 'адрес доставки',
            email: 'электронную почту',
            phone: 'номер телефона'
        };

        return {
            valid: false,
            // Результат: "Необходимо указать адрес доставки"
            error: `Необходимо указать ${fieldLabels[field]}`
        };
    }

    return { valid: true };
}

    // Валидация всех полей сразу
  validateAll(): { valid: boolean; errors: TOrderErrors } {
    const errors: TOrderErrors = {};
    
    // Явно перечисляем поля, которые должны быть заполнены
    const fields: (keyof IBuyer)[] = ['payment', 'address', 'email', 'phone'];

    fields.forEach((field) => {
        const result = this.validateField(field);
        if (!result.valid) {
            errors[field] = result.error;
        }
    });

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}
}
