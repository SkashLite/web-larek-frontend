import { ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

export class Modal extends BaseView<HTMLElement> {
	protected _modalElement: HTMLElement;
	protected _modalClose: HTMLElement;
	protected _modalContent: HTMLElement;

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
		this._modalElement.classList.add('modal_active');
		this._modalContent.append(container);
		this.events.emit('modal:open');
	}

	close() {
		this._modalElement.classList.remove('modal_active');
		this._modalContent.innerHTML = '';
		this.events.emit('modal:close');
	}
}
