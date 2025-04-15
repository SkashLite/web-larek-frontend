import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';
import { category } from '../../utils/constants';
export class ProductView extends BaseView<HTMLElement> {
	protected _descriptionElement: HTMLElement | null;
	protected _imageElement: HTMLImageElement | null;
	protected _titleElement: HTMLElement | null;
	protected _categoryElement: HTMLElement | null;
	protected _priceElement: HTMLElement | null;
	protected events: EventEmitter;

	constructor(container: HTMLElement, event: EventEmitter) {
		super(container);
		this._descriptionElement = container.querySelector('.card__text');
		this._imageElement = ensureElement(
			'.card__image',
			container
		) as HTMLImageElement;
		this._titleElement = ensureElement('.card__title', container);
		this._categoryElement = ensureElement('.card__category', container);
		this._priceElement = ensureElement('.card__price', container);
		this.events = event;

		container.addEventListener('click', () => {
			const productId = container.dataset.id;
			if (productId) {
				this.events.emit('product:open-modal', { id: productId });
			}
		});
	}

	set title(value: string) {
		if (this._titleElement) {
			this.setText(this._titleElement, value);
		}
	}

	set category(value: string) {
		if (this._categoryElement) {
			this._categoryElement.className = 'card__category';
			this.setText(this._categoryElement, value);
			const categoryKey = Object.keys(category).find(
				(key) => category[key as keyof typeof category] === value
			);
			if (categoryKey) {
				this.toggleClass(this._categoryElement, `card__category_${categoryKey}`, true);
			}
		}
	}

	set price(value: string) {
		let price = String(value) + ' синапсов';
		if (value === null) {
			price = 'Бесценно';
		}
		this.setText(this._priceElement, price);
	}

	set image(value: string) {
		if (this._imageElement) {
			this.setImage(this._imageElement, CDN_URL + value);
			this._imageElement.src = CDN_URL + value;
		}
	}

	set description(value: string) {
		if (this._descriptionElement) {
			this.setText(this._descriptionElement, value);
		}
	}
}
