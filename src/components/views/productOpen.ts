import { EventEmitter } from '../base/events';

export class ProductOpen {
	protected button: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter,
		isInBasket: boolean
	) {
		this.button = container.querySelector(
			'.button.card__button'
		) as HTMLButtonElement;
		if (this.button) {
			this.button.disabled = isInBasket;
			this.button.addEventListener('click', () => {
				events.emit('modal:add-to-basket');
				this.button.disabled = true;
			});
		}
	}
}
