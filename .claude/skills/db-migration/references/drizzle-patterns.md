# Drizzle Patterns — MariaDB (mysql-core) ของโปรเจกต์ web3.0

> source of truth ของ data model อยู่ใน [roadmap.md > 1. Data Model](../../../../roadmap.md). ไฟล์นี้สรุป pattern ที่ใช้ซ้ำเวลาแก้ schema
> ทุกตารางอยู่ที่ `src/infrastructure/db/schema/` แล้ว re-export ผ่าน `schema/index.ts`

## column types ที่ใช้บ่อย
| งาน | เขียนแบบนี้ |
|-----|-----------|
| primary key | `id: varchar("id", { length: 36 }).primaryKey()` (สร้างค่าใน use case) |
| ข้อความสั้น | `varchar("title", { length: 255 }).notNull()` |
| ข้อความยาว / HTML | `text("content").notNull()` (Tiptap HTML — sanitize ก่อน save) |
| unique | `varchar("slug", { length: 255 }).notNull().unique()` |
| array (tags/images) | `json("tags").$type<string[]>().default([])` (MariaDB ไม่มี array) |
| enum สถานะ | `mysqlEnum("status", ["DRAFT", "PUBLISHED"]).notNull().default("DRAFT")` |
| ตัวเลขนับ | `int("views").notNull().default(0)` |
| สร้างเมื่อ | `timestamp("created_at").notNull().defaultNow()` |
| อัปเดตเมื่อ | `timestamp("updated_at").notNull().defaultNow().onUpdateNow()` |
| เวลา nullable | `timestamp("published_at")` |

## index (rule 05 — ใส่ที่ column ที่ filter/sort บ่อย)
```ts
export const posts = mysqlTable("posts", {
  // ...columns
}, (t) => ({
  statusIdx: index("posts_status_idx").on(t.status),
  publishedAtIdx: index("posts_published_at_idx").on(t.publishedAt),
}));
```

## ตัวอย่างตารางจริง (อ้างอิงเร็ว)
```ts
// src/infrastructure/db/schema/users.ts
import { mysqlTable, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hash
  name: varchar("name", { length: 255 }),
  role: mysqlEnum("role", ["ADMIN"]).notNull().default("ADMIN"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```
```ts
// src/infrastructure/db/schema/posts.ts (Blog) — มี index + json tags + enum + onUpdateNow
import { mysqlTable, varchar, text, json, int, timestamp, mysqlEnum, index } from "drizzle-orm/mysql-core";
export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content").notNull(),
  coverImage: varchar("cover_image", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>().default([]),
  status: mysqlEnum("status", ["DRAFT", "PUBLISHED"]).notNull().default("DRAFT"),
  views: int("views").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (t) => ({
  statusIdx: index("posts_status_idx").on(t.status),
  publishedAtIdx: index("posts_published_at_idx").on(t.publishedAt),
}));
```

## barrel export
```ts
// src/infrastructure/db/schema/index.ts
export * from "./users";
export * from "./posts";
export * from "./projects";
export * from "./contacts";
```

## ห้าม
- ❌ auto-increment id — โปรเจกต์ gen id ใน use case (application)
- ❌ array column ตรง ๆ (ใช้ json)
- ❌ ต่อ string จาก user input เข้า SQL — Drizzle query API / `sql\`\`` ที่ bind ค่าเท่านั้น (rule 01)
- ❌ รัน drizzle-kit เอง — แก้ schema แล้วแจ้ง user (ดู [SKILL.md](../SKILL.md))
