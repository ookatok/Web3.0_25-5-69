import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "@/shared/config/env";
import * as schema from "./schema";

// Create a connection pool to MariaDB
const pool = mysql.createPool({
  uri: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema, mode: "default" });
export type DbType = typeof db;
