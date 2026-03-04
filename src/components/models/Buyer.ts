import { TPayment, TOrderErrors, IBuyer } from "../../types";

export class Buyer {
            private data: IBuyer = {
            payment: '',
            email: '',
            phone: '',
            address: '',
            }

            save(data: Partial<IBuyer>): void {
                this.data = { ...this.data, ...data };
             }
            getAll(): IBuyer {
                return { ...this.data };
            }
            clear(): void {
                this.data = {
                payment: '',
                email: '',
                phone: '',
                address: '',
                };
            }
                validateField(field: keyof IBuyer): { valid: boolean; error?: string } {
                const value = this.data[field];
                if (value && value.trim().length > 0) {
                return { valid: true };
                }

                return {
                    valid: false,
                    error: `Поле "${field}" должно быть заполнено.`,
                };
                }

                // Валидация всех полей
                 validateAll(): { valid: boolean; errors: TOrderErrors } {
                     const errors: TOrderErrors = {}; // Теперь используем короткое имя типа
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