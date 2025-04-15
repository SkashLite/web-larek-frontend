import { ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

export class ContactView extends BaseView<HTMLElement> {
	protected email: HTMLInputElement;
	protected phone: HTMLInputElement;
	protected buttonPayment: HTMLButtonElement;

	constructor(container: HTMLElement, event: EventEmitter) {
		super(container);
		this.email = ensureElement(
			'.order [name="email"]',
			container
		) as HTMLInputElement;
		this.phone = ensureElement(
			'.order [name="phone"]',
			container
		) as HTMLInputElement;
		this.buttonPayment = ensureElement(
			'.button.payment__button',
			container
		) as HTMLButtonElement;

		// Отправка события при изменении значений
		this.email.addEventListener('input', () => {
			event.emit('contact:change', {
				email: this.email.value,
				phone: this.phone.value,
			});
		});

		this.phone.addEventListener('input', () => {
			event.emit('contact:change', {
				email: this.email.value,
				phone: this.phone.value,
			});
		});

		// Обработчик клика по кнопке "Оплатить"
		this.buttonPayment.addEventListener('click', () => {
			this.email.reportValidity();
			this.phone.reportValidity();
			event.emit('pay:end');
		});
	}

	// Метод для отображения ошибок на полях
	showErrors(errors: { email?: string; phone?: string }) {
		this.email.setCustomValidity(errors.email ?? '');
		this.phone.setCustomValidity(errors.phone ?? '');
		if (errors.email) {
			this.email.reportValidity();  // Для email только, если ошибка
		} else {
			this.phone.reportValidity();  // Для phone
		}
	}

	// Метод для отключения/включения кнопки оплаты
	setDisabledButton(state: boolean) {
		this.setDisabled(this.buttonPayment, state);
	}
}