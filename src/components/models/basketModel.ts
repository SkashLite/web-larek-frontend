import { IProduct } from "../../types";

export class Basket {
  private products: IProduct[] = [];

  addProduct(product: IProduct) {
    this.products.push(product);
  }

  removeProduct(productId: string) {
    this.products = this.products.filter((product) => product.id !== productId);
  }

  productsBasket(): IProduct[] {
    return this.products;
  }

  getCounter(): number {
    return this.products.length;
  }

  hasProduct(productId: string): boolean {
    return this.products.some((product) => product.id === productId);
  }

  getTotalSum(): number {
    return this.products.reduce((acc, product) => acc + (product.price || 0), 0);
  }

  clear() {
    this.products = [];
  }
}