import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { IProduct } from './types';
import { API_URL, settings } from './utils/constants';
import { ProductModel } from './components/models/ProductModel';
import { ProductView } from './components/views/ProductView';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/base/page';
import { Modal } from './components/views/modal';
import { Basket } from './components/models/basketModel';
import { BasketView } from './components/views/basketView';
import { PaymentView } from './components/views/payment';
import { ContactView } from './components/views/contactView';
import { SuccessPay } from './components/views/successPay';

const api = new Api(API_URL);
const events = new EventEmitter();
const productModel = new ProductModel(events);
const page = new Page(document.querySelector('.page') as HTMLElement, events);
const modal = new Modal(events);
const basketModel = new Basket();
const productViewPreview = new ProductView(cloneTemplate('#card-preview'), events);
const basketView = new BasketView(cloneTemplate('#basket'), events);
const paymentView = new PaymentView(cloneTemplate('#order'), events);
const contactsView = new ContactView(cloneTemplate('#contacts'), events);
const endPay = new SuccessPay(cloneTemplate('#success'), events);


api
  .get(settings.product)
  .then(({ items }: ApiListResponse<IProduct>) => {
    productModel.productCards = items;
  })
  .catch(console.error);

events.on('item:change', () => {
  const productElements = productModel.productCards.map(createProductCard);
  page.render({ cardList: productElements });
});

const createProductCard = (item: IProduct): HTMLElement => {
  const productElement = new ProductView(cloneTemplate('#card-catalog'), events).render(item);
  productElement.addEventListener('click', () => {
    modal.open(productViewPreview.render(item), item);
  });
  return productElement;
};

events.on('product:open-modal', (productId) => {
  modal.open(productViewPreview.render(), productId);
});  

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

modal.addDelegateListener('.button.card__button', () => {
  const product = modal.currentData;
  if (!basketModel.hasProduct(product.id)) {
    basketModel.addProduct(product);
    page.basketCounterRender(basketModel.getCounter().toString());
  }
});

events.on('basket:open', () => {
  basketView.renderBasket(basketModel.productsBasket());
  basketView.updateBasketSum(basketModel.getTotalSum())
  modal.open(basketView.render());
});

events.on<{ id: string }>('basket:item-remove', ({ id }) => {
  basketModel.removeProduct(id);
  basketView.renderBasket(basketModel.productsBasket());
  page.basketCounterRender(basketModel.getCounter().toString());
});

events.on('basket:open-payment', () => {
  if(basketModel.getCounter() !== 0) {
    modal.close();
    modal.open(paymentView.render());
  } else alert('Корзина пуста')
});

events.on('payment:form', () => {
  const address = paymentView.textForm();
  if (address.length > 6 && paymentView.isActiveButton()) {
    console.log('Введен адрес:', address);
    paymentView.activationButton();
  }else paymentView.disabledButton()
})

events.on('payment:button', () => {
  modal.close();
  modal.open(contactsView.render());
})

events.on('pay:end',  () => {
  modal.close();
  endPay.updateBasketSum(basketModel.getTotalSum())
  modal.open(endPay.render());
})

events.on('close', () => {
  basketModel.clear();
  page.basketCounterRender('0');
  basketView.updateBasketSum(0);
  basketView.renderBasket([]);
  modal.close();
})