import { ensureElement } from "../../utils/utils";
import { BaseView } from "./baseView";
import { EventEmitter } from "./events";

interface IPage {
  cardList?: HTMLElement[];
}

export class Page extends BaseView<IPage> {
  protected cardContainer: HTMLElement; 
  protected wrapper: HTMLElement;
  protected basketCounter: HTMLElement;
  protected basketButton: HTMLButtonElement;
  constructor(container: HTMLElement, events?: EventEmitter) {
    super(container)
    this.cardContainer = ensureElement('.gallery', this.container);
    this.basketCounter = ensureElement('.header__basket-counter', this.container);
    this.wrapper = ensureElement('.page__wrapper', this.container);
    this.basketButton = ensureElement('.header__basket', this.container) as HTMLButtonElement;
    this.basketButton.addEventListener('click', () => {
      events.emit('basket:open')
    });
  }

  basketCounterRender(data: string) {
		this.basketCounter.textContent = data;
	}

  set cardList(data: HTMLElement[]) {
    this.cardContainer.replaceChildren(...data);
  }

  set locked(value: boolean) {
		if (value) {
			this.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.wrapper.classList.remove('page__wrapper_locked');
		}
	}
}