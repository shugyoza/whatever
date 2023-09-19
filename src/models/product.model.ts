import { Product } from "./db/products.interface";
import { writeDataToFile } from "./utils/utils";

export class ProductModel {
  public filePath: string;
  public products: Product[] = [];

  constructor(filePath: string, products: Product[] = []) {
    this.filePath = filePath;
    this.products = products;
  }

  public findAll(): Promise<Product[]> {
    return new Promise((resolve) => {
      resolve(this.products);
    });
  }

  public addOne(_product: Product): Promise<Product> {
    return new Promise((resolve) => {
      const product: Product = {
        ..._product,
        id: `${Date.now()}`,
      };
      this.products = [...this.products, product];
      writeDataToFile(this.filePath, this.products);
      resolve(product);
    });
  }

  public findOne(id: number | string): Promise<Product | undefined> {
    return new Promise((resolve) => {
      const product = this.products.find((doc: Product) => doc.id === id);
      resolve(product);
    });
  }

  public updateOne(id: number | string, update: Product): Promise<Product> {
    return new Promise((resolve) => {
      const index = this.products.findIndex((doc: Product) => doc.id === id);
      this.products[index] = { ...update };
      writeDataToFile(this.filePath, this.products);
      resolve(this.products[index]);
    });
  }

  public deleteOne(id: number | string) {
    return new Promise((resolve) => {
      const index = this.products.findIndex((doc) => doc.id === id);
      const deleted = this.products.splice(index, 1)[0];
      writeDataToFile(this.filePath, this.products);
      resolve(deleted);
    });
  }
}
