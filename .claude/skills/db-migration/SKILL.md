---
name: db-migration
description: workflow แก้ schema ฐานข้อมูล (Drizzle ORM + MariaDB) ของโปรเจกต์ web3.0 อย่างปลอดภัย. ใช้ skill นี้ทุกครั้งที่งานเกี่ยวกับ database — เพิ่ม/แก้/ลบ table, column, relation, index, enum, หรือเมื่อผู้ใช้พูดว่า "เพิ่มตาราง", "เพิ่มฟิลด์", "แก้ schema", "migrate", "drizzle". กฎเหล็ก: แก้เฉพาะไฟล์ schema แล้วหยุด ห้ามรัน drizzle-kit / db:push / db:generate / db:migrate เด็ดขาด — ผู้ใช้รันเอง
---

# DB Migration — Drizzle Schema Workflow (อ่านก่อนแตะ schema)

โปรเจกต์ใช้ **Drizzle ORM + MariaDB** (`drizzle-orm/mysql2`, table ด้วย `mysql-core`)

## ⛔ กฎเหล็ก (จาก CLAUDE.md — ห้ามละเมิด)
1. **ห้ามรัน** `drizzle-kit push` / `npm run db:push` — ไม่ว่ากรณีใด ๆ
2. **ห้ามรัน** `drizzle-kit generate` / `drizzle-kit migrate` / `npm run db:generate` / `npm run db:migrate` เอง — **ผู้ใช้รันเองทุกครั้ง**
3. งาน DB ทุกอย่าง → **แก้ที่ `src/infrastructure/db/schema/` เท่านั้น แล้วหยุด**
4. ตรวจ schema ปัจจุบันใน DB → ขอให้ผู้ใช้ `drizzle-kit pull` หรือ query เอง — **อย่ารันให้**

## Workflow

### 1. หาไฟล์ schema ที่เกี่ยว
- ตารางอยู่แยกไฟล์ใน `src/infrastructure/db/schema/` (เช่น `posts.ts`, `projects.ts`, `users.ts`, `contacts.ts`)
- มี barrel `schema/index.ts` รวม export — ถ้าเพิ่มไฟล์ตารางใหม่ ต้องเพิ่ม `export * from "./<table>"` ที่ index ด้วย
- ก่อนแก้ Grep ดูว่า column ที่จะแตะถูกอ้างใน repository / use case / dto ที่ไหนบ้าง (กระทบ slice)

### 2. แก้ schema ตาม convention โปรเจกต์
ดูแม่แบบ type/column ที่ถูกต้องใน [references/drizzle-patterns.md](references/drizzle-patterns.md). หลักสำคัญ:
- `id` = `varchar("id", { length: 36 })` (uuid/cuid) **สร้างใน use case ไม่ใช่ DB** — ห้ามใช้ auto-increment
- MariaDB ไม่มี array type → ใช้ `json("...").$type<string[]>().default([])` สำหรับ `tags`/`images`
- HTML จาก Tiptap เก็บใน `text("content")` (sanitize ก่อน save — rule 01)
- สถานะใช้ `mysqlEnum("status", ["DRAFT", "PUBLISHED"])`
- เวลา: `timestamp(...).notNull().defaultNow()`, อัปเดต: `.onUpdateNow()`
- ใส่ `index(...)` ที่ column ที่ filter/sort บ่อย (`slug`, `status`, `publishedAt`) — rule 05
- `slug`/`email` ที่ unique → `.unique()`

### 3. หยุด แล้วแจ้งผู้ใช้ (สำคัญที่สุด)
หลังแก้ schema เสร็จ **อย่าทำต่อ** ให้แจ้งผู้ใช้ด้วยข้อความประมาณนี้:

> แก้ schema ที่ `src/infrastructure/db/schema/<file>.ts` เรียบร้อย — กรุณารันคำสั่งนี้เองตามลำดับ:
> ```
> npm run db:generate   # drizzle-kit สร้างไฟล์ migration จาก schema
> npm run db:migrate    # apply migration ไป DB ตาม DATABASE_URL
> ```
> (ผมไม่รันให้ตามกฏโปรเจกต์ — ถ้าต้องการ seed admin ใหม่ค่อยรัน `npm run seed` หลัง migrate)

### 4. งานต่อเนื่องใน slice (ถ้าเป็นส่วนหนึ่งของ feature)
- column ใหม่ที่เพิ่ม → ต้องไหลผ่าน entity (domain) → dto (zod) → port → repository → action/form ให้ครบ (ใช้ skill **new-feature**)
- **ห้าม** เพิ่ม column ที่ไม่มีใครใช้ใน application (ตายตั้งแต่ commit — rule 10)
- ลบ column → Grep ให้แน่ใจว่าไม่มี caller, แก้ schema, แล้วแจ้ง user รัน migrate

## Checklist
- [ ] แก้เฉพาะไฟล์ใน `src/infrastructure/db/schema/`
- [ ] ตารางใหม่ export ผ่าน `schema/index.ts` แล้ว
- [ ] `id` = varchar(36), array = json, index ครบ column ที่ filter/sort
- [ ] column ใหม่/ที่ลบ ไหลครบทั้ง slice (entity → dto → port → repo → action)
- [ ] **ไม่ได้รัน** drizzle-kit / db:push / db:generate / db:migrate เอง
- [ ] แจ้งคำสั่ง migrate ให้ผู้ใช้รันเองแล้ว
