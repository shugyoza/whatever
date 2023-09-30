import {
  mysqlFindById,
  mysqlFindOne,
  mysqlInsertOne,
  mysqlAlterTable,
} from "./utils";

// mysqlFindById(2, "customers", "myJSExpresSQL");
// mysqlFindOne("customers", "myJSExpresSQL", { name: "Stephen" });
// mysqlInsertOne("customers", {
//   name: "John",
//   address: "blabla",
//   description: "bloblo",
// });
mysqlAlterTable("customers", "_id", {
  type: "BIGINT",
  extra: "AUTO_INCREMENT",
  key: "PRIMARY KEY",
});
