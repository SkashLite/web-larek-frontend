import { ensureElement } from '../../utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '../base/events';

interface IPage {
	cardList?: HTMLElement[];
}

export class Page extends BaseView<IPage> {
	protected cardContainer: HTMLElement;
	protected wrapper: HTMLElement;
	protected basketCounter: HTMLElement;
	protected basketButton: HTMLButtonElement;
	constructor(container: HTMLElement, events?: EventEmitter) {
		super(container);
		this.cardContainer = ensureElement('.gallery', this.container);
		this.basketCounter = ensureElement(
			'.header__basket-counter',
			this.container
		);
		this.wrapper = ensureElement('.page__wrapper', this.container);
		this.basketButton = ensureElement(
			'.header__basket',
			this.container
		) as HTMLButtonElement;
		this.basketButton.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	basketCounterRender(data: string) {
		this.setText(this.basketCounter, data);
	}

	set cardList(data: HTMLElement[]) {
		this.cardContainer.replaceChildren(...data);
	}

	set locked(value: boolean) {
		if (value) {
			this.toggleClass(this.wrapper, 'page__wrapper_locked', true);
		} else {
			this,
				this.toggleClass(this.wrapper, 'page__wrapper_locked', false);
		}
	}
}
