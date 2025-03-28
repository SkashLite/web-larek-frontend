import { ensureElement } from "../../utils/utils";
import { BaseView } from "../base/baseView";
import { EventEmitter } from "../base/events";

export class Modal extends BaseView<HTMLElement> {
  protected _modalElement: HTMLElement;
  protected _modalClose: HTMLElement;
  protected _modalContent: HTMLElement;
  protected _currentData: any = null;
  
  constructor(protected events: EventEmitter) {
    super(document.body);
    this._modalElement = ensureElement('.modal', document.body);
    this._modalClose = ensureElement('.modal__close', this._modalElement);
    this._modalContent = ensureElement('.modal__content', this._modalElement);

    this._modalClose.addEventListener('click', () => this.close());
    this._modalElement.addEventListener('click', (event) => {
      if (event.target === this._modalElement) {
        this.close();
      }
    });

  }

  open(container: HTMLElement, data?: any) {
    this._currentData = data || null;
    this._modalElement.classList.add('modal_active');
    this._modalContent.append(container);
    this.events.emit('modal:open');
  }

  close() { 
    this._modalElement.classList.remove('modal_active');
    this._modalContent.innerHTML = '';
    this._currentData = null;
    this.events.emit('modal:close');
  }

  public addDelegateListener(selector: string, callback: (event: Event) => void) {
    this._modalElement.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest(selector)) {
        callback(event);
      }
    });
  }

  get currentData() {
    return this._currentData;
  }
}