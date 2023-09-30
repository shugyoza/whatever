import http from "http";

import { extractPOSTData } from "./utils/utils";
import {
  mysqlFindAll,
  mysqlFindById,
  mysqlFindOne,
  mysqlInsertOne,
} from "../models/mysql/utils";

export async function getAll(
  res: http.ServerResponse<http.IncomingMessage>,
  tableName: string
): Promise<void> {
  try {
    const result = await mysqlFindAll(tableName);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error(err);
  }
}

export async function getOneById(
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  id: number | string,
  tableName: string
): Promise<void> {
  try {
    const document = await mysqlFindById(id, tableName);

    if (!document) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product not found." }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(document));
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getDocuments(
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  tableName: string
): Promise<void> {
  try {
    const stringifiedJSON = await extractPOSTData(req);

    if (!stringifiedJSON || typeof stringifiedJSON !== "string") {
      return;
    }

    const json = JSON.parse(stringifiedJSON);
    const document = await mysqlFindOne(tableName, json.where, json.or);

    if (!document) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product not found." }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(document));
    }
  } catch (err) {
    console.error(err);
  }
}

export async function addOne(
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  tableName: string
): Promise<void> {
  try {
    const body = await extractPOSTData(req);

    if (!body || typeof body !== "string") {
      return;
    }

    const { name, address, description } = JSON.parse(body);

    const newDocument = await mysqlInsertOne(tableName, {
      _id: null,
      name,
      address,
      description,
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newDocument));
  } catch (err) {
    console.error(err);
  }
}
