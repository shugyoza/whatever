import dotenv from "dotenv";

dotenv.config();

// config to connect to mysql
export const envConfig: MySQLConfig = {
  host: process.env.MYSQL_HOST || "",
  user: process.env.MYSQL_USER || "",
  password: process.env.MYSQL_PASSWORD || "",
};

// select whether to create new or use existing one
// once database created, database name must be assigned to existing, and leave new as blank
export const envDatabase = {
  new: process.env.MYSQL_DB_NEW,
  existing: process.env.MYSQL_DB_EXISTING,
};

export interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database?: string;
}
