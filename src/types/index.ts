export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface Order {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
