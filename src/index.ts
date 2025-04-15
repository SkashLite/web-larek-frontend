import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { IProduct } from './types';
import { API_URL, settings } from './utils/constants';
import { ProductModel } from './components/models/productModel';
import { ProductView } from './components/views/productView';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/views/page';
import { Modal } from './components/views/modal';
import { Basket } from './components/models/basketModel';
import { BasketView } from './components/views/basketView';
import { PaymentView } from './components/views/payment';
import { ContactView } from './components/views/contactView';
import { SuccessPay } from './components/views/successPay';
import { ModalModel } from './components/models/modalModel';
import { OrderModel } from './components/models/order';
import { paymentMethods } from './utils/constants';
import { ProductOpen } from './components/views/productOpen';
import { ContactModel } from './components/models/contactModel';
import { BasketItemView } from './components/views/basketItemView';
import { LarekApi } from './components/models/larekApi';

const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const events = new EventEmitter();
const productModel = new ProductModel(events);
const page = new Page(document.querySelector('.page') as HTMLElement, events);
const modal = new Modal(events);
const basketModel = new Basket();
const modalModel = new ModalModel();
const productViewPreview = new ProductView(
	cloneTemplate('#card-preview'),
	events
);
const basketView = new BasketView(cloneTemplate('#basket'), events);
const paymentView = new PaymentView(cloneTemplate('#order'), events);
const contactsView = new ContactView(cloneTemplate('#contacts'), events);
const endPay = new SuccessPay(cloneTemplate('#success'), events);
const order = new OrderModel();
const contactModel = new ContactModel();

larekApi.getProductList(
	(items) => {
			productModel.productCards = items;
	},
	(error) => {
			console.error(error);
	}
);


events.on('item:change', () => {
	const productElements = productModel.productCards.map(createProductCard);
	page.render({ cardList: productElements });
});

const createProductCard = (item: IProduct): HTMLElement => {
	const productElement = new ProductView(
		cloneTemplate('#card-catalog'),
		events
	).render(item);
	productElement.addEventListener('click', () => {
		modalModel.currentData = item;
		const modalView = new ProductView(cloneTemplate('#card-preview'), events);
		const modalContent = modalView.render(item);
		modal.open(modalContent);
		new ProductOpen(
			modalContent,
			events,
			basketModel.hasProduct(item.id),
			item
		);
	});
	return productElement;
};

events.on('product:open-modal', (product: IProduct) => {
	modalModel.currentData = product;
	modal.open(productViewPreview.render(product));
});

events.on('modal:add-to-basket', () => {
	const product = modalModel.currentData;
	if (!basketModel.hasProduct(product.id)) {
		basketModel.addProduct(product);
		page.basketCounterRender(basketModel.getCounter().toString());
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	const basketProducts = basketModel.getProductsBasket();
	const basketItems = basketProducts.map((product, index) =>
		new BasketItemView(product, index, events).render()
	);
	basketView.renderBasket(basketItems);
	basketView.updateBasketSum(basketModel.getTotalSum());
	modal.open(basketView.render());
});

events.on<{ id: string }>('basket:item-remove', ({ id }) => {
	basketModel.removeProduct(id);
	const basketProducts = basketModel.getProductsBasket();
	const basketItems = basketProducts.map((product, index) =>
		new BasketItemView(product, index, events).render()
	);
	basketView.renderBasket(basketItems);
	basketView.updateBasketSum(basketModel.getTotalSum());
	page.basketCounterRender(basketModel.getCounter().toString());
	if (modalModel.currentData?.id === id) {
		const currentButton = document.querySelector(
			'.modal .card__button'
		) as HTMLButtonElement;
		if (currentButton) currentButton.disabled = false;
	}
});

events.on<{ email: string; phone: string }>(
	'contact:change',
	({ email, phone }) => {
		contactModel.setContact(email, phone);
		const errors = contactModel.getValidationErrors();
		contactsView.showErrors(errors);
		contactsView.setDisabledButton(!contactModel.isValid());
	}
);

events.on('basket:open-payment', () => {
	if (basketModel.getCounter() !== 0) {
		order.setItemsFromBasket(basketModel.getProductsBasket());
		modal.close();
		modal.open(paymentView.render());
	} else alert('Корзина пуста');
});

events.on('payment:form', () => {
	paymentView.checkForm();
});

events.on<{ selectedText: string }>(
	'payment:method-changed',
	({ selectedText }) => {
		const normalizedKey = selectedText
			.toLowerCase()
			.trim() as keyof typeof paymentMethods;
		if (Object.prototype.hasOwnProperty.call(paymentMethods, normalizedKey)) {
			const methodCode = paymentMethods[normalizedKey];
			order.setPaymentMethod(methodCode);
		} else {
			console.error('Неизвестный метод оплаты:', normalizedKey);
		}
	}
);

events.on('payment:button', () => {
	order.setAddress(paymentView.getTextForm());
	modal.close();
	modal.open(contactsView.render());
});

events.on('pay:end', () => {
	order.setContactInfo(contactModel.getEmail(), contactModel.getPhone());
	modal.close();
	larekApi.postOrder(
    order.getOrder(),
    (response) => {
        console.log("Успешно отправлен заказ", response);
    },
    (error) => {
        console.error(error);
    }
);
	order.clear();
});

events.on('close', () => {
	basketModel.clear();
	page.basketCounterRender('0');
	basketView.updateBasketSum(0);
	modal.close();
});
