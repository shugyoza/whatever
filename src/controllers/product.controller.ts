import http from "http";

import data from "../models/nodejs.db/products.json";
import { ProductModel } from "../models/nodejs.db/product.model";
import { extractPOSTData } from "./utils/utils";

const filePath = "src/models/db/products.json";

export class ProductController {
  constructor(private productModel = new ProductModel(filePath, data)) {}

  public notFound(res: http.ServerResponse<http.IncomingMessage>): void {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "Route Not Found",
      })
    );
  }

  public async getAll(
    res: http.ServerResponse<http.IncomingMessage>
  ): Promise<void> {
    try {
      const products = await this.productModel.findAll();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
    } catch (err) {
      console.error(err);
    }
  }

  public async getOne(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    id: number | string
  ): Promise<void> {
    try {
      const product = await this.productModel.findOne(id);

      if (!product) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Product not found." }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(product));
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async addOne(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ): Promise<void> {
    try {
      const body = await extractPOSTData(req);

      if (!body || typeof body !== "string") {
        return;
      }

      const { title, subtitle, description, price, currency, hashtags } =
        JSON.parse(body);

      const product = {
        id: "",
        title,
        subtitle,
        description,
        price,
        currency,
        hashtags,
        created: Date.now().toString(),
        lastUpdate: Date.now().toString(),
      };

      const newProduct = await this.productModel.addOne(product);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newProduct));
    } catch (err) {
      console.error(err);
    }
  }

  public async updateOne(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    id: number | string
  ): Promise<void> {
    try {
      const product = await this.productModel.findOne(id);
      if (!product) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Product not found." }));
      } else {
        const body = await extractPOSTData(req);

        if (!body || typeof body !== "string") {
          return;
        }

        const {
          title,
          subtitle,
          description,
          price,
          currency,
          hashtags,
          created,
        } = JSON.parse(body);

        const update = {
          id,
          title,
          subtitle,
          description,
          price,
          currency,
          hashtags,
          created,
          lastUpdate: Date.now().toString(),
        };

        const updatedProduct = await this.productModel.updateOne(id, update);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedProduct));
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async deleteOne(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    id: number | string
  ) {
    try {
      const product = await this.productModel.findOne(id);

      if (!product) {
        res.writeHead(404), { "Content-Type": "application/json" };
        res.end(JSON.stringify({ message: "Product not found." }));
      } else {
        const deletedProduct = await this.productModel.deleteOne(id);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(deletedProduct));
      }
    } catch (err) {
      console.error(err);
    }
  }
}
