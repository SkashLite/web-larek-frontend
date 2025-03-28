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
    this.sumBasket = ensureElement('.basket__price', this.container) as HTMLElement;
    this.events = event;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open-payment');
    });
  }

  renderBasket(products: IProduct[]) {
    this.basketList.innerHTML = ''; 
    products.forEach((product, index) => {
      const basketItem = this.createBasketItem(product, index);
      this.basketList.appendChild(basketItem);
    });
    
  }

  createBasketItem(product: IProduct, index: number): HTMLElement {
    const basketItem = cloneTemplate('#card-basket');
    this.setText(basketItem.querySelector('.card__title') as HTMLElement, product.title);
    this.setText(basketItem.querySelector('.card__price') as HTMLElement, product.price != null ? `${product.price} синапсов` : 'Бесценно');
    this.setText(basketItem.querySelector('.basket__item-index') as HTMLElement, `${index + 1}`);

    const deleteItem = basketItem.querySelector('.basket__item-delete') as HTMLElement;
    deleteItem.addEventListener('click', () => this.removeProduct(product.id));

    return basketItem;
  }

  removeProduct(productId: string) {
    this.events.emit<{ id: string }>('basket:item-remove', { id: productId });
  }

  updateBasketSum(value: number) {
      this.setText(this.sumBasket, `${value} синапсов`);
    }
  }

