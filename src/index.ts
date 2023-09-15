import http from "http";

import { ProductController } from "./controllers/product.controller";

const hostname = "127.0.0.1";
const port = 3000;

const productController = new ProductController();

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === "/api/products") {
    switch (method) {
      case "GET":
        return productController.getAll(res);
      case "POST":
        return productController.addOne(req, res);
    }
  }

  if (url?.match(/\/api\/products\/([0-9]+)/)) {
    const id = url?.split("/")[3];

    if (id) {
      switch (method) {
        case "GET":
          return productController.getOne(req, res, id);
        case "PUT":
          return productController.updateOne(req, res, id);
        case "DELETE":
          return productController.deleteOne(req, res, id);
      }
    }
  }

  return productController.notFound(res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
