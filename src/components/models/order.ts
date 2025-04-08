import { Order } from '../../types';
import { IProduct } from '../../types';

export class OrderModel {
	private order: Order = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: 0,
		items: [],
	};

	setContactInfo(email: string, phone: string) {
		this.order.email = email;
		this.order.phone = phone;
	}

	setAddress(address: string) {
		this.order.address = address;
	}

	setPaymentMethod(payment: string) {
		this.order.payment = payment;
	}

	setItemsFromBasket(products: IProduct[]) {
		this.order.items = products.map((product) => product.id);
		this.order.total = products.reduce(
			(sum, product) => sum + (product.price ?? 0),
			0
		);
	}

	getOrder(): Order {
		return this.order;
	}

	clear() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
			total: 0,
			items: [],
		};
	}
}
