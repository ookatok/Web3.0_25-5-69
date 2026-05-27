/**
 * @file client.ts
 * @path src/infrastructure/db/client.ts
 * @description ไฟล์กำหนดค่าการเชื่อมต่อ MySQL Database Client ผ่าน Drizzle ORM และจัดการ Connection Pool
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "@/shared/config/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pool: mysql.Pool | undefined;
};

// Create or reuse connection pool to MySQL
const pool = globalForDb.pool ?? mysql.createPool({
  uri: env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
export type DbType = typeof db;
