import http from "http";
import dotenv from "dotenv";

import { ProductController } from "./controllers/product.controller";
import {
  sendHTML,
  sendCSS,
  sendJS,
} from "./views/utils/server-side-rendering-utils";
import {
  getAll,
  getOneById,
  addOne,
  getDocuments,
} from "./controllers/mysql.controller";

dotenv.config();
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

const productController = new ProductController();

const server = http.createServer((req, res) => {
  const { url, method } = req;

  /* 
    TODO: create an endpoint to check quantity (counter) of data
    so that it could decide to make multiple calls for pagination
  */

  if (url === "/") {
    switch (method) {
      case "GET":
        sendHTML("src/views/main/main.html", res); //("src/index.html", res);
        return;
    }
  }

  // when html sent to client, html imports will cause subsequent calls for the imports
  if (url?.endsWith(".css") && method === "GET") {
    const urlArray = url.split("/");
    const fileName = urlArray[urlArray.length - 1];
    const fileFolder = fileName.slice(0, fileName.indexOf(".css"));

    // css file is not compiled to dist/ folder, so this is the proper path to find the file
    return sendCSS(process.cwd() + `/src/views/${fileFolder}/${fileName}`, res);
  }

  if (url?.endsWith(".js") && method === "GET") {
    const urlArray = url.split("/");
    const fileName = urlArray[urlArray.length - 1];
    const fileFolder = fileName.slice(0, fileName.indexOf(".js"));

    // .ts file gets mapped to dist/ folder, so this is the proper path to find the file
    return sendJS(process.cwd() + `/dist/views/${fileFolder}/${fileName}`, res);
  }

  if (url === "/products") {
    switch (method) {
      case "GET":
        return sendHTML(
          "src/views/product.component/product.component.html",
          res
        );
    }
  }

  if (url?.match(/\/products\/([0-9]+)/)) {
    const id = url?.split("/")[3];

    if (id) {
      switch (method) {
        case "GET":
          return productController.getOne(req, res, id);
        case "PUT":
          return;
          productController.updateOne(req, res, id);
        case "DELETE":
          return productController.deleteOne(req, res, id);
      }
    }
  }

  // APIs
  // /api/mysql/[tableName]/
  if (url?.match(/\/api\/mysql\/([A-Za-z0-9_-]+)\/(find)/)) {
    const urlArray = url?.split("/");
    const tableName = urlArray[3];

    switch (method) {
      case "POST":
        return getDocuments(req, res, tableName);
    }
  }

  // /api/mysql/[tableName]/:id
  if (url?.match(/\/api\/mysql\/([A-Za-z0-9_-]+)\/([0-9]+)/)) {
    const urlArray = url?.split("/");
    const tableName = urlArray[3];
    const params = urlArray[4];

    switch (method) {
      case "GET":
        return getOneById(req, res, params, tableName);
      case "PUT":
        return;
      case "DELETE":
        return;
    }
  }

  // /api/mysql/[tableName]
  if (url?.match(/\/api\/mysql\/([A-Za-z0-9_-]+)/)) {
    const urlArray = url?.split("/");
    const tableName = urlArray[3];

    if (tableName) {
      switch (method) {
        case "GET":
          return getAll(res, tableName);
        case "POST":
          return addOne(req, res, tableName);
        case "DELETE":
          return;
      }
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

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
