import http from "http";

import { ProductController } from "./controllers/product.controller";
import { sendHTML, sendCSS } from "./utils/utils";

const hostname = "127.0.0.1";
const port = 3000;

const productController = new ProductController();

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // when html sent to client, html imports will cause subsequent calls for the imports
  if (url?.endsWith(".css") && method === "GET") {
    const urlArray = url.split("/");
    const fileName = urlArray[urlArray.length - 1];
    const fileFolder = fileName.slice(0, fileName.indexOf(".css"));

    return sendCSS(`src/views/${fileFolder}/${fileName}`, res);
  }

  if (url === "/form/product") {
    switch (method) {
      case "GET":
        return sendHTML(
          "src/views/product.component/product.component.html",
          res
        );
    }
  }

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
