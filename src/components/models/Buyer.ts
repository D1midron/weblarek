export type TPayment = 'card' | 'cash' | string;

export interface IBuyer {
        payment: TPayment;
        email: string;
        phone: string;
        address: string;
    }
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
            saveField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
                this.data[field] = value;
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
            private isNonEmpty(value: string): boolean {
                return typeof value === 'string' && value.trim().length > 0;
                }
                validateField(field: keyof IBuyer): { valid: boolean; error?: string } {
                const value = this.data[field];
                if (this.isNonEmpty(value)) {
                return { valid: true };
                }
                return {
                valid: false,
                error: `Поле "${field}" должно быть заполнено и не быть пустым.`,
                };
                }

                // Валидация всех полей
                validateAll(): { valid: boolean; errors: Partial<Record<keyof IBuyer, string>> } {
                const errors: Partial<Record<keyof IBuyer, string>> = {};
                 let allValid = true;

                (Object.keys(this.data) as (keyof IBuyer)[]).forEach((field) => {
                    const result = this.validateField(field);
                    if (!result.valid) {
                    allValid = false;
                 // записываем сообщение об ошибке для поля
                    errors[field] = result.error;
                }
                });

                return {
                valid: allValid,
                errors,
                };
        }

     }