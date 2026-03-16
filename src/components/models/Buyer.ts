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
        // Приводим к строке на случай, если payment имеет тип-юнион
        if (value && String(value).trim().length > 0) {
            return { valid: true };
        }

        return {
            valid: false,
            error: `Поле "${field}" должно быть заполнено.`,
        };
    }

    // Валидация всех полей сразу
    validateAll(): { valid: boolean; errors: TOrderErrors } {
        const errors: TOrderErrors = {};
        let allValid = true;

        (Object.keys(this.data) as (keyof IBuyer)[]).forEach((field) => {
            const result = this.validateField(field);
            if (!result.valid) {
                allValid = false;
                errors[field] = result.error;
            }
        });

        return {
            valid: allValid,
            errors,
        };
    }
}
