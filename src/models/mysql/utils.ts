import mysql from "mysql";

import { envConfig, envDatabase, MySQLConfig } from "./config";

export function mysqlCreateDB(
  config: MySQLConfig = { ...envConfig, database: envDatabase.new }
): void {
  const { host, user, password, database } = config;

  if (!host || !user || !password || !database) {
    console.error("At least one of the config properties is not defined.");
    process.exit(1);
  }

  const mysqlDb = mysql.createConnection({ host, user, password });
  const query = "CREATE DATABASE " + database;

  mysqlDb.query(query, (err) => {
    if (err) console.error(err);
    else
      console.log({
        query,
        config,
        message: "Success. MySQL Database created.",
      });

    mysqlDisconnect(mysqlDb);
  });
}

export function mysqlConnectDB(
  config: MySQLConfig = { ...envConfig, database: envDatabase.existing }
): mysql.Connection {
  const { host, user, password, database } = config;

  if (!host || !user || !password || !database) {
    console.error("At least one of the config properties is not defined.");
    process.exit(1);
  }

  console.log({
    config,
    status: "Success.",
    message: "MySQL Database server connected.",
  });

  return mysql.createConnection(config);
}

export function mysqlDropDB(
  config: MySQLConfig = { ...envConfig, database: envDatabase.existing },
  databaseNameToDrop: string
): void {
  const { host, user, password } = config;

  if (!host || !user || !password) {
    console.error("At least one of the config properties is not defined.");
    process.exit(1);
  }

  const mysqlDb = mysql.createConnection({ host, user, password });
  const query = "DROP DATABASE IF EXISTS " + databaseNameToDrop;

  mysqlDb.query(query, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log({
        query,
        config,
        status: "Success.",
        message: "MySQL Database dropped.",
      });
    }

    mysqlDisconnect(mysqlDb);
  });
}

export function mysqlDisconnect(mysqlDb: mysql.Connection): void {
  mysqlDb.end((err) => {
    if (err) console.error(err);
    else console.log("MySQL Database connection has ended.");
  });
}

export function mysqlCheckTable(databaseName: string, tableName: string): void {
  const mysqlDb = mysqlConnectDB();
  const query = `SHOW TABLES FROM ${databaseName} LIKE '${tableName}'`;

  mysqlDb.query(query, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log({
        query,
        status: "Success",
        message: "Table exists.",
      });
    }

    mysqlDisconnect(mysqlDb);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mysqlCreateTable(tableName: string, tableObject: any): void {
  const mysqlDb = mysqlConnectDB();
  if (!tableObject) return;

  mysqlDb.connect((connectErr) => {
    if (connectErr) {
      console.error(connectErr);
      return;
    }

    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

    // at the end of the fields, we do not want to add ', ', but ')'
    let fieldsCount = Object.keys(tableObject).length;

    for (const field in tableObject) {
      query += field;

      const row = tableObject[field];
      for (const column in row) {
        if (column === "notNull" && row[column] === true) {
          query += " NOT NULL";
        } else if (column === "length") {
          query += `(${row[column]})`;
        } else {
          query += ` ${row[column]}`;
        }
      }

      fieldsCount--;
      if (fieldsCount > 0) query += ", ";
    }

    query += ");";

    mysqlDb.query(query, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log({
          query,
          status: "Success.",
          message: "Table created.",
        });
      }

      mysqlDisconnect(mysqlDb);
    });
  });
}

export function mysqlDropTable(tableName: string): void {
  const mysqlDb = mysqlConnectDB();
  if (!tableName) {
    return;
  }

  mysqlDb.connect((connectErr) => {
    if (connectErr) {
      console.error(connectErr);
    } else {
      const query = `DROP TABLE ${tableName}`;
      mysqlDb.query(query, (dropTableErr) => {
        if (dropTableErr) console.error(dropTableErr);
        else {
          console.log({
            query,
            status: "Success.",
            message: "Table deleted",
          });
        }

        mysqlDisconnect(mysqlDb);
      });
    }
  });
}

export function mysqlAlterTable(
  tableName: string,
  fieldName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldObject: { [key: string]: any }
): void {
  if (!tableName || !fieldName || !fieldObject) {
    return;
  }

  const mysqlDb = mysqlConnectDB();
  // if there is an existing primary key and this wants to alter it, we have to drop primary key first
  // else mysql will throw a "Multiple primary key defined" error
  mysqlDb.connect((connectErr) => {
    if (connectErr) {
      console.error(connectErr);
      return;
    }

    let query = `ALTER TABLE ${tableName} `;

    const fieldIsPrimaryKey =
      Object.values(fieldObject).includes("PRIMARY KEY");

    // if field to alter is a primary key, we cannot MODIFY, but DROP first, then ADD again with new values
    if (fieldIsPrimaryKey) {
      query += `ADD ${fieldName}`;

      const dropQuery = `ALTER TABLE ${tableName} DROP ${fieldName}`;
      mysqlDb.query(dropQuery, (alterTableErr) => {
        if (alterTableErr) {
          console.error(alterTableErr);

          // if the error is because the field does not exist, we can just proceed to add it, because perhaps this prop may have been deleted previously
        } else {
          console.log({
            query: dropQuery,
            status: "Success",
            message: `${fieldName} field had been dropped from ${tableName}.`,
          });
        }
      });

      // when field is not a primary key, then we can MODIFY
      if (!fieldIsPrimaryKey) {
        query += `MODIFY ${fieldName}`;
      }

      for (const column in fieldObject) {
        if (column === "notNull" && fieldObject[column] === true) {
          query += " NOT NULL";
        } else if (column === "length") {
          query += `(${fieldObject[column]})`;
        } else {
          query += ` ${fieldObject[column]}`;
        }
      }

      console.log(query);
      mysqlDb.query(query, (alterTableErr) => {
        if (alterTableErr) console.error(alterTableErr);
        else {
          console.log({
            query,
            status: "Success.",
            message: `Field: ${fieldName} within ${tableName} table had been updated.`,
          });
        }

        mysqlDisconnect(mysqlDb);
      });
    }
  });
}

export function mysqlInsertOne(
  tableName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableObject: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!tableName || !Object.keys(tableObject).length) {
      return console.error(
        "Table name is undefined, or table object has invalid value"
      );
    }

    const mysqlDb = mysqlConnectDB();

    mysqlDb.connect((connectErr) => {
      if (connectErr) {
        console.error(connectErr);
        reject(connectErr);
      } else {
        // construct query
        let query = `INSERT INTO ${tableName} (`;
        let values = "VALUES (";

        for (const column in tableObject) {
          if (query[query.length - 1] !== "(") {
            query += ", ";
          }

          if (values[values.length - 1] !== "(") {
            values += ", ";
          }

          query += column;
          values += `'${tableObject[column]}'`;
        }

        query += ") ";
        values += ");";

        query = `${query} ${values}`;

        mysqlDb.query(query, (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);
            reject(insertErr);
          } else {
            const response = {
              query,
              status: "Success.",
              message: "One document had been inserted.",
              insertId: result.insertId,
              result: tableObject,
            };
            resolve(response);
          }

          mysqlDisconnect(mysqlDb);
        });
      }
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mysqlFindAll(tableName: string): Promise<any> {
  if (!tableName) {
    console.error("there is no tableName");
  }

  const mysqlDb = mysqlConnectDB();

  return new Promise((resolve, reject) => {
    mysqlDb.connect((connectErr) => {
      if (connectErr) {
        reject(connectErr);
      }

      const query = `SELECT * FROM ${tableName}`;

      mysqlDb.query(query, (selectErr, result) => {
        if (selectErr) reject(selectErr);
        else {
          const response = {
            query,
            status: "Success.",
            message: "Results from database had been retrieved.",
            result,
          };
          resolve(response);
        }

        mysqlDisconnect(mysqlDb);
      });
    });
  });
}

export function mysqlFindById(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: string | number,
  tableName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (!id || !tableName) {
    console.error("Id OR tableName is undefined.");
  }

  const mysqlDb = mysqlConnectDB();
  const query = `SELECT * FROM ${tableName} WHERE (_id = ${id})`;

  return new Promise((resolve, reject) => {
    mysqlDb.query(query, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const response = {
          query,
          status: "Success.",
          message: "One document found.",
          id,
          result,
        };
        resolve(response);
      }

      mysqlDisconnect(mysqlDb);
    });
  });
}

export function mysqlFindOne(
  tableName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: { [key: string]: any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  or?: { [key: string]: any }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!where || !tableName) {
      return reject("Where or table is undefined");
    }

    const mysqlDb = mysqlConnectDB();
    // SELECT * FROM customers WHERE (_id = 1 AND name = 'Stephen' AND address = 'blabla' AND description = 'bleble')
    let query = `SELECT * FROM ${tableName} WHERE (`;

    for (const key in where) {
      if (query[query.length - 1] === "(") query += `${key} = '${where[key]}'`;
      else query += ` AND ${key} = '${where[key]}'`;
    }

    query += ")";

    if (or) {
      query += "OR (";

      for (const key in or) {
        if (query[query.length - 1] === "(") query += `${key} = '${or[key]}'`;
        else query += ` AND ${key} = '${or[key]}`;
      }

      query += ")";
    }

    mysqlDb.query(query, (err, result) => {
      if (err) {
        return console.error(err);
      }

      const response = {
        query,
        status: "Success.",
        message: "Results returned.",
        result,
      };
      resolve(response);
      mysqlDisconnect(mysqlDb);
    });
  });
}
