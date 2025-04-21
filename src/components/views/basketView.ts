import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

export class BasketView extends BaseView<IProduct> {
	protected basketList: HTMLElement;
	protected events: EventEmitter;
	protected basketButton: HTMLButtonElement;
	protected sumBasket: HTMLElement;

	constructor(container: HTMLElement, event: EventEmitter) {
		super(container);
		this.basketList = ensureElement('.basket__list', this.container);
		this.basketButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
		this.sumBasket = ensureElement('.basket__price', this.container);
		this.events = event;

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open-payment');
		});
	}

	
	renderBasket(items: HTMLElement[]) {
		this.basketList.innerHTML = '';
		items.forEach((item) => this.basketList.appendChild(item));
		this.updateBasketButtonState(items);
	}

	updateBasketSum(value: number) {
		this.setText(this.sumBasket, `${value} синапсов`);
	}

	updateBasketButtonState(items: HTMLElement[]) {
		this.basketButton.disabled = items.length === 0;
	}
}	
