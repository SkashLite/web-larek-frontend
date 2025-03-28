import { ensureElement, ensureAllElements } from "../../utils/utils";
import { BaseView } from "../base/baseView";
import { EventEmitter } from "../base/events";

export class PaymentView extends BaseView<undefined> {
  protected form: HTMLInputElement;
  protected button: HTMLButtonElement;
  protected buttonAlt: HTMLButtonElement[];
  protected orderButtons: HTMLButtonElement;
  protected events: EventEmitter;
  constructor(container: HTMLElement, event: EventEmitter) {
    super(container);
    this.form = ensureElement('.form__input', container) as HTMLInputElement;
    this.button =  ensureElement('.order__button', container) as HTMLButtonElement;
    this.orderButtons =  ensureElement('.order__buttons', this.container) as HTMLButtonElement;
    this.buttonAlt = ensureAllElements('.button_alt', this.container);
    this.events = event;

    this.form.addEventListener('input', () => {
      this.events.emit('payment:form');
    });

    this.button.addEventListener('click', () => {
      this.events.emit('payment:button');
    })

    this.orderButtons.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('button')) {
        this.buttonAlt.forEach(button => button.classList.remove('button_alt-active'));
        target.classList.add('button_alt-active');
        this.events.emit('payment:form');
      }
    });
  }

  textForm() {
    return this.form.value;
  }

  activationButton() {
    this.setDisabled(this.button, false);
  }

  disabledButton() {
    this.setDisabled(this.button, true);
  }
  isActiveButton() {
    return this.buttonAlt.some(button => button.classList.contains('button_alt-active'));
  }
}