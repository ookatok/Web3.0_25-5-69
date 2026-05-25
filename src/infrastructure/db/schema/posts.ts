import { mysqlTable, varchar, text, json, int, timestamp, mysqlEnum, index } from "drizzle-orm/mysql-core";

export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content").notNull(),                 // HTML content from Tiptap
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
