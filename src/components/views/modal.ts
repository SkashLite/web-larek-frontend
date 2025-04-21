import { ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

export class Modal extends BaseView<HTMLElement> {
	protected _modalElement: HTMLElement;
	protected _modalClose: HTMLElement;
	protected _modalContent: HTMLElement;
	protected _buyButton: HTMLButtonElement;

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

	open(container: HTMLElement) {
		this.toggleClass(this._modalElement, 'modal_active', true);
		this._modalContent.append(container);
		this._buyButton = this._modalContent.querySelector('.card__button') as HTMLButtonElement;
		this.events.emit('modal:open');
	}

	close() {
		this.toggleClass(this._modalElement, 'modal_active', false);
		this._modalContent.innerHTML = '';
		this.events.emit('modal:close');
	}
	
	enableBuyButton() {
		if (this._buyButton) {
			this._buyButton.disabled = false;
		}
	}
}
