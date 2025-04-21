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

## Базовые классы 

### `Api` (`api.ts`)

**Назначение**: Управление HTTP-запросами к API сервера. Обеспечивает выполнение GET/POST-запросов и обработку ответов.

- **Свойства**:
  - `baseUrl: string` - базовый URL API-сервера (только для чтения)
  - `options: RequestInit` - конфигурация запросов (заголовки и другие настройки)

- **Методы**:
  - `constructor(baseUrl: string, options?: RequestInit)` - инициализирует базовый URL и параметры запроса:
  - `get(uri: string)` - выполняет GET-запрос:
  - `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - выполняет POST/PUT/DELETE-запрос с телом:
  - `protected handleResponse(response: Response)` - внутренний обработчик ответов:
    - Возвращает `Promise<object>` при успешном статусе (200-299)
    - Генерирует ошибку с текстом из `data.error` или `statusText` при ошибках
###

### `BaseView<T>` (`baseView.ts`)

**Назначение**: Базовый абстрактный класс для создания UI-компонентов. Предоставляет общие методы для работы с DOM-элементами.

- **Параметры конструктора**:
  - `container: HTMLElement` - корневой элемент компонента (protected, readonly)

- **Методы**:
  - `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает CSS-класс элемента:
  - `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое элемента:
  - `setDisabled(element: HTMLElement, state: boolean)` - управляет состоянием disabled:
  - `setHidden(element: HTMLElement)` - скрывает элемент (display: none)
  - `setVisible(element: HTMLElement)` - показывает элемент (display: default)
  - `setImage(element: HTMLImageElement, src: string, alt?: string)` - обновляет изображение:
  - `render(data?: Partial<T>): HTMLElement` - базовый метод рендеринга (требует реализации):

### `EventEmitter` (`events.ts`)

**Назначение**: Реализация паттерна "Наблюдатель" для управления событиями. Поддерживает подписку на события по имени, регулярным выражениям или всем событиям.

**Типы**:
- `EventName = string | RegExp` - имя события (строка/регулярное выражение)
- `Subscriber = Function` - функция-обработчик события
- `EmitterEvent` - объект события:

**Методы**:
 - `on()` - подписка на событие/шаблон
 - `off()` - отмена подписки
 - `emit()` - генерация события
 - `onAll()` - подписка на все события ('*')
 - `offAll()` - полный сброс подписок
 - `trigger()` - создание функции-триггера события

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

### 5.`LarekApi` (`larekApi.ts`)

**Назначение**: Фасад для работы с API магазина. Инкапсулирует логику взаимодействия с базовым API-клиентом.

- **Зависимости**:
  - `Api` - базовый HTTP-клиент
  - `settings` - конфигурация API-эндпоинтов

### 6. `ContactModel` (`contactModel.ts`)

**Назначение**: Форма ввода контактных данных.

- **Методы**:
  - `iValid()` — возвращает true|false в зависимости от валидности полей.
  - `getValidationErrors()` — ошибки валидации.
  - `getEmail()` - возвращает значение email.
  - `getPhone()` - возвращает значение phone.
  - `checkEmail()` - проверяет email.
  - `checkPhone()` - проверяет phone.
  - `setContact()` - записывает  phone и email.
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
  - `updateBasketButtonState(products: IProduct[])` — делает кнопку не активной если товаров нет в корзине.

### 3. `ContactView` (`contactView.ts`)

**Назначение**: Форма ввода контактных данных.

- **Методы**:
  - `activationButton()` — активация кнопки оплаты.
  - `emailValue()` - возвращает значение email.
  - `phoneValue()` - возвращает значение phone.
  - `reset()` - сбрасывает данные поля ввода.

### 4. `PaymentView` (`payment.ts`)

**Назначение**: Форма выбора способа оплаты и адреса.

- **Методы**:
  - `checkForm()` — проверяет заполнение полей.
  - `getTextForm()` — возвращает введенный адрес.
  - `isActiveButton` — проверяет, активирован ли хотя бы один из элементов управления (кнопок) с классом button_alt.
  - `reset()` — сброс данных полей.



### 5. ``BasketItemView` (`basketItemView.ts`)`
  **Назначение**: Отображение элемента корзины. Реализует UI для одного товара в корзине и обработку его удаления.

  - **Методы**:
    - `remove()` — Удаляет элемент из DOM-дерева


### 6. `Modal` (`modal.ts`)

**Назначение**: Управление модальными окнами.

- **Методы**:
  - `open(container: HTMLElement)` — открывает модальное окно.
  - `close()` — закрывает модальное окно.

---

## Презентер (`index.ts`)

**Роль**: Координация взаимодействия между моделями и представлениями через события.

## Основные интерфейсы

### `IProduct`
Интерфейс данных о товаре.

| Поле         | Тип                | Описание                                  |
|--------------|--------------------|-------------------------------------------|
| `id`         | `string`           | Уникальный идентификатор товара           |
| `description`| `string`           | Подробное описание товара                 |
| `image`      | `string`           | URL изображения товара                    |
| `title`      | `string`           | Название товара                           |
| `category`   | `string`           | Категория товара (например, "софт-скил")  |
| `price`      | `number \| null`   | Цена товара (может быть `null` — «Бесценно») |

---

### `Order`
Интерфейс данных заказа.

| Поле       | Тип          | Описание                                  |
|------------|--------------|-------------------------------------------|
| `payment`  | `string`     | Способ оплаты (например, "онлайн")        |
| `email`    | `string`     | Email покупателя                          |
| `phone`    | `string`     | Телефон покупателя                        |
| `address`  | `string`     | Адрес доставки                            |
| `total`    | `number`     | Итоговая сумма заказа                     |
| `items`    | `string[]`   | Массив ID товаров в заказе                |