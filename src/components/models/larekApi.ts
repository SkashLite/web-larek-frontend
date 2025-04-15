import { IProduct } from "../../types";
import { settings } from "../../utils/constants";
import { Api, ApiListResponse } from "../base/api";

interface PostOrderResponse {
	success: boolean;
	orderId: string;
}
interface OrderResponse {
	orderId: string;
	total: number;
	status: string;
}

export class LarekApi {
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	getProductList(
		callback: (items: IProduct[]) => void,
		errorCallback: (error: Error) => void
	): void {
		this.api
			.get(settings.product)
			.then((response: ApiListResponse<IProduct>) => {
				callback(response.items);
			})
			.catch((error: Error) => {
				errorCallback(error);
			});
	}

	// Метод для отправки заказа
	postOrder(
		orderData: any,
		callback: (response: PostOrderResponse) => void,
		errorCallback: (error: Error) => void
	): void {
		this.api
			.post(settings.order, orderData)
			.then((response: PostOrderResponse) => {
				callback(response);
			})
			.catch((error: Error) => {
				errorCallback(error);
			});
	}

	getOrder(
		orderId: string,
		callback: (response: OrderResponse) => void,
		errorCallback: (error: Error) => void
	): void {
		this.api
			.get(`${settings.order}/${orderId}`)
			.then((response: OrderResponse) => {
				callback(response);
			})
			.catch((error: Error) => {
				errorCallback(error);
			});
	}
}
