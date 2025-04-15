import { EventEmitter } from '../base/events';
import { IProduct } from '../../types';

export class ProductOpen {
	protected button: HTMLButtonElement;
	constructor(
		container: HTMLElement,
		events: EventEmitter,
		isInBasket: boolean,
		product: IProduct
	) {
		this.button = container.querySelector(
			'.button.card__button'
		) as HTMLButtonElement;

		if (this.button) {
			if (product.price === null) {
				this.button.disabled = true;
				this.button.textContent = 'Недоступен';
				return;
			}
			this.button.disabled = isInBasket;
			this.button.addEventListener('click', () => {
				events.emit('modal:add-to-basket');
				this.button.disabled = true;
			});
		}
	}
}