// for creating Database, Tables, or altering Tables before/while developing the app
import { envConfig } from "./config";
import {
  mysqlCreateDB,
  mysqlDropDB,
  mysqlCheckTable,
  mysqlCreateTable,
  mysqlAlterTable,
  mysqlDropTable,
} from "./utils";

mysqlDo();

const todo = {
  create: {
    database: "", // database name here if you want to create a database
    tables: [
      {
        name: "", // table name to create
        body: {}, // schema (all the rows, columns, types) for the table to create in mysql
      },
    ],
  },
  check: {
    tables: [
      {
        name: "", // name of table that needs to be dropped
        database: "", // database name where table exists
      },
    ],
  },
  alter: {
    tables: [
      {
        name: "", // name of the table where field exists
        field: {
          name: "", // name of the field within the table that needs to be modified
          body: {}, // schema of the field within the table that needs to be modified
        },
      },
    ],
  },
  drop: {
    database: "", // database name that needs to be deleted/dropped
    tables: [
      // name of table that needs to be dropped
    ],
  },
};

function mysqlDo(execute = todo) {
  const { create, check, alter, drop } = execute;

  if (create.database) {
    const database = create.database;
    mysqlCreateDB({ ...envConfig, database });
  }

  if (create.tables[0]?.name) {
    create.tables.forEach((table) => {
      mysqlCreateTable(table.name, table.body);
    });
  }

  if (check.tables[0]?.name && check.tables[0].database) {
    check.tables.forEach((table) => {
      mysqlCheckTable(table.database, table.name);
    });
  }

  if (alter.tables[0]?.name) {
    alter.tables.forEach((table) => {
      const { field } = table;
      mysqlAlterTable(table.name, field.name, field.body);
    });
  }

  if (drop.database) {
    mysqlDropDB(envConfig, drop.database);
  }

  if (drop.tables.length) {
    drop.tables.forEach((tableName: string) => {
      mysqlDropTable(tableName);
    });
  }
}
