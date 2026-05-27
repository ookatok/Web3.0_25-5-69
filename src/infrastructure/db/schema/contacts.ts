/**
 * @file contacts.ts
 * @path src/infrastructure/db/schema/contacts.ts
 * @description กำหนดโครงสร้างตาราง contacts (id, name, email, phone, message, createdAt) สำหรับเก็บข้อมูลการติดต่อของลูกค้า
 */

import { mysqlTable, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const contacts = mysqlTable("contacts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
