import { IProduct } from '../../types';
import { EventEmitter } from '../base/events';

export class ProductModel {
	protected _productCards: IProduct[];

	productModel: IProduct;

	constructor(protected events: EventEmitter) {
		this._productCards = [];
	}

	set productCards(data: IProduct[]) {
		this._productCards = data;
		this.events.emit('item:change');
	}

	get productCards() {
		return this._productCards;
	}
}
