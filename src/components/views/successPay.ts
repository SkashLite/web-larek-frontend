import { ensureElement } from "../../utils/utils";
import { BaseView } from "../base/baseView";
import { EventEmitter } from "../base/events";

export class SuccessPay extends BaseView<undefined> {
  protected orderSuccess: HTMLElement;
  protected closeButton: HTMLElement;
  protected events: EventEmitter;
  constructor(container: HTMLElement, event: EventEmitter) {
    super(container);
    this.orderSuccess = ensureElement('.order-success__description', container);
    this.closeButton = ensureElement('.order-success__close', container);
    this.events = event;
    this.closeButton.addEventListener('click', () => {
      this.events.emit('close');
      this.events.emit('item:change');
    });
  }

  updateBasketSum(value: number) {
    this.setText(this.orderSuccess, `${value} синапсов`);
  }
}