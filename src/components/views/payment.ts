import { ensureElement, ensureAllElements } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

export class PaymentView extends BaseView<HTMLElement> {
	protected form: HTMLInputElement;
	protected button: HTMLButtonElement;
	protected buttonAlt: HTMLButtonElement[];
	protected orderButtons: HTMLButtonElement;
	protected events: EventEmitter;
	protected selectedPaymentMethod: string | null = null;
	constructor(container: HTMLElement, event: EventEmitter) {
		super(container);
		this.form = ensureElement('.form__input', container) as HTMLInputElement;
		this.button = ensureElement(
			'.order__button',
			container
		) as HTMLButtonElement;
		this.orderButtons = ensureElement(
			'.order__buttons',
			this.container
		) as HTMLButtonElement;
		this.buttonAlt = ensureAllElements('.button_alt', this.container);
		this.events = event;

		this.form.addEventListener('input', () => {
			this.events.emit('payment:form');
		});

		this.button.addEventListener('click', () => {
			this.events.emit('payment:button');
		});

		this.orderButtons.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target && target.classList.contains('button')) {
				this.buttonAlt.forEach((button) =>
					this.toggleClass(button, 'button_alt-active', false)
				);
				this.toggleClass(target, 'button_alt-active', true);
				this.events.emit('payment:method-changed', {
					selectedText: target.textContent,
				});
				this.events.emit('payment:form');
			}
		});
	}

	getTextForm() {
		return this.form.value;
	}

	isActiveButton() {
		return this.buttonAlt.some((button) =>
			button.classList.contains('button_alt-active')
		);
	}

	checkForm() {
		if (this.form.value.length > 6 && this.isActiveButton()) {
			this.setDisabled(this.button, false);
		} else {
			this.setDisabled(this.button, true);
		}
	}

	reset() {
		this.form.value = '';
		this.buttonAlt.forEach((button) =>
			this.toggleClass(button, 'button_alt-active', false)
		);
		this.setDisabled(this.button, true);
	}
}
