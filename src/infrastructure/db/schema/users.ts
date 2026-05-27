/**
 * @file users.ts
 * @path src/infrastructure/db/schema/users.ts
 * @description กำหนดโครงสร้างตาราง users (id, email, passwordHash, name, role) สำหรับสิทธิ์ผู้ดูแลระบบ
 */

import { mysqlTable, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hash
  name: varchar("name", { length: 255 }),
  role: mysqlEnum("role", ["ADMIN"]).notNull().default("ADMIN"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
