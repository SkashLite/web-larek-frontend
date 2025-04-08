# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Документация проекта (MVP Pattern)

## Общая архитектура
Проект реализован на паттерне **MVP (Model-View-Presenter)**:
- **Модели (Models)** — хранят данные и бизнес-логику.
- **Представления (Views)** — отвечают за отображение UI и обработку пользовательских событий.
- **Презентер (Presenter)** — связывает модели и представления (реализован в `index.ts`).
- **Сервисы** — работа с API (класс `Api`).

Взаимодействие компонентов осуществляется через `EventEmitter`.

---

## Модели (Models)

### 1. `ProductModel` (`productModel.ts`)
**Назначение**: Управление данными о товарах.
- **Методы**:
  - `set productCards(data: IProduct[])` — обновляет список товаров.
  - `get productCards()` — возвращает текущий список товаров.

### 2. `Basket` (`basketModel.ts`)
**Назначение**: Управление корзиной пользователя.
- **Методы**:
  - `addProduct(product: IProduct)` — добавляет товар в корзину.
  - `removeProduct(productId: string)` — удаляет товар по ID.
  - `getProductsBasket()` — возвращает список товаров в корзине.
  - `getTotalSum()` — вычисляет итоговую сумму.
  - `getCounter()` — вычисляет количество товара в корзине.
  - `hasProduct()`— проверяет, содержится ли продукт с указанным идентификатором (productId) в списке продуктов.
  - `clear()` — отчищает данные корзины.

### 3. `OrderModel` (`order.ts`)
**Назначение**: Формирование данных заказа.
- **Методы**:
  - `setPaymentMethod(payment: string)` — сохраняет способ оплаты.
  - `setAddress(address: string)` — сохраняет адрес.
  - `setContactInfo(email: string, phone: string)` — сохраняет контакты.
  - `setItemsFromBasket(products: IProduct[])` — переносит товары из корзины.
  - `getOrder()` — возвращает сформированный заказ.
  - `clear()` - отчищает данные заказа.

### 4. `ModalModel` (`modalModel.ts`)
**Назначение**: Хранение данных для модальных окон.
- **Свойства**:
  - `(set, get)currentData` — данные текущего модального окна.

---

## Представления (Views)

### 1. `ProductView` (`productView.ts`)
**Назначение**: Отображение карточек товаров.
- **Методы**:
  - `render(data: IProduct)` — рендерит карточку товара.
  - Сеттеры (`title`, `price`, `image`, `category`, `description`) — обновляют данные в UI.

### 2. `BasketView` (`basketView.ts`)
**Назначение**: Отображение корзины.
- **Методы**:
  - `renderBasket(products: IProduct[])` — рендерит список товаров в корзине.
  - `updateBasketSum(value: number)` — обновляет итоговую сумму.
  - `removeProduct(productId: string)` — создает событие удаления продукта.
  - `updateBasketButtonState(products: IProduct[])` — делает кнопку не активной если товаров нет в корзине.
  - `reateBasketItem(product: IProduct, index: number)` — Создает HTML-элемент товара в корзине на основе переданных данных.

### 3. `ContactView` (`contactView.ts`)
**Назначение**: Форма ввода контактных данных.
- **Методы**:
  - `checkEmail()`, `checkPhone()` — валидация данных.
  - `activationButton()` — активация кнопки оплаты.
  - `emailValue()` - возвращает значение email.
  - `phoneValue()` - возвращает значение phone.

### 4. `PaymentView` (`payment.ts`)
**Назначение**: Форма выбора способа оплаты и адреса.
- **Методы**:
  - `checkForm()` — проверяет заполнение полей.
  - `getTextForm()` — возвращает введенный адрес.
  - `isActiveButton` — проверяет, активирован ли хотя бы один из элементов управления (кнопок) с классом button_alt

### 5. `Modal` (`modal.ts`)
**Назначение**: Управление модальными окнами.
- **Методы**:
  - `open(container: HTMLElement)` — открывает модальное окно.
  - `close()` — закрывает модальное окно.

---

## Презентер (`index.ts`)
**Роль**: Координация взаимодействия между моделями и представлениями через события.


## Основные интерфейсы
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

interface Order {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}