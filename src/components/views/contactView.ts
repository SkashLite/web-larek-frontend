import { ensureElement } from "../../utils/utils";
import { BaseView } from "../base/baseView";
import { EventEmitter } from "../base/events";

export class ContactView extends BaseView<undefined> {
  protected email: HTMLInputElement
  protected phone: HTMLInputElement
  protected buttonPayment: HTMLButtonElement
  constructor(container: HTMLElement, event: EventEmitter) {
    super(container);
    this.email = ensureElement('.order [name="email"]', container) as HTMLInputElement;
    this.phone = ensureElement('.order [name="phone"]', container) as HTMLInputElement;
    this.buttonPayment = ensureElement('.button.payment__button', container) as HTMLButtonElement;

    this.email.addEventListener('input', () => {
      this.activationButton();
    });
    
    this.phone.addEventListener('input', () => {      
      this.activationButton();
    });

    this.buttonPayment.addEventListener('click', () => {
      event.emit('pay:end');
    })

  }
  checkEmail(){
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(this.email.value)
  }
  
  checkPhone(){
    const phonePattern = /^\+7\s?\(?\d{3}\)?\s?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}$/;
    return phonePattern.test(this.phone.value)
  }


  activationButton() {
    const isValid = this.checkEmail() && this.checkPhone();
    this.setDisabled(this.buttonPayment, !isValid);
  }
}

