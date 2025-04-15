import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { BaseView } from '../base/baseView';

export class BasketItemView extends BaseView<IProduct> {
	protected events: EventEmitter;

	constructor(product: IProduct, index: number, events: EventEmitter) {
		super(cloneTemplate('#card-basket'));
		this.events = events;

		const title = ensureElement<HTMLElement>('.card__title', this.container);
		const price = ensureElement<HTMLElement>('.card__price', this.container);
		const itemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
		const deleteBtn = ensureElement<HTMLElement>('.basket__item-delete', this.container);

		this.setText(title, product.title);
		this.setText(price, product.price != null ? `${product.price} синапсов` : 'Бесценно');
		this.setText(itemIndex, `${index + 1}`);

		deleteBtn.addEventListener('click', () => {
			this.events.emit<{ id: string }>('basket:item-remove', { id: product.id });
      this.remove();
		});
	}

  remove() {
    this.container.remove();
  }
}
  