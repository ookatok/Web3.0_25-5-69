# roadmap.md — ไกด์การพัฒนา web3.0

> ที่มา: สรุปจาก [PLAN.md](PLAN.md) (ผังหน้าเว็บ/ระบบ) แต่ปรับให้ **ตรงกฎใน [.claude/rules/](.claude/rules/)** และ stack จริง
> โครงสร้างชั้น: ดู [ARCHITECTURE.md](ARCHITECTURE.md) · ภาพรวม repo: ดู [CLAUDE.md](CLAUDE.md)
> Stack: **Next.js 16 (App Router, React 19) · TypeScript · Drizzle ORM + MariaDB · NextAuth (Auth.js v5) · bcrypt · Tiptap · shadcn/ui + Radix · Tailwind v4 · Zod · Server Actions**
> อัปเดต: 25 พ.ค. 2026

---

## 0. วิธีใช้ roadmap นี้

1. **ทำทีละเฟสจากบนลงล่าง** — แต่ละเฟสต่อยอดจากเฟสก่อน
2. **ทุก feature ที่กระทบ ≥ 2 ชั้น เดินตาม [rule 10](.claude/rules/10-feature-change-protocol.md)**: Map → Plan → Implement → Sweep dead code → Verify
3. **DB workflow (สำคัญ)** — เมื่อแก้ schema: **แก้ที่ `src/infrastructure/db/schema/` แล้วหยุด** → แจ้งให้รัน `npm run db:generate` แล้ว `npm run db:migrate` เอง (**Claude ห้ามรัน drizzle-kit เด็ดขาด** ดู CLAUDE.md)
4. **ผ่าน Verify gate ก่อนปิดเฟส** — `npm run build` + `npm run lint` ผ่าน และทดสอบ golden path ใน browser
5. ทุก checkbox `[ ]` คือ deliverable ที่ต้องเสร็จจริง
6. **โปรเจกต์มีเวลา 7 วัน** — ดูการจัดเฟสลงรายวันที่ [แผน 7 วัน (Timeline)](#แผน-7-วัน-timeline) ท้ายไฟล์ ส่วนฟีเจอร์ Bonus ดู [PLAN.md §8](PLAN.md)

### กฎทองที่ใช้ทุกเฟส (quick reference)
- **Dependency ชี้เข้าด้านในเท่านั้น** `app → presentation → application → domain`; infra implement ports ([rule 09](.claude/rules/09-clean-architecture.md))
- **Server Action บางเฉียบ**: `requireAdmin → zod.parse → use case → revalidatePath` — ห้าม business logic/Drizzle/role check inline ([rule 01](.claude/rules/01-security.md), [09](.claude/rules/09-clean-architecture.md))
- **Zod ทุก boundary** นิยามที่ `application/dto` ใช้ซ้ำทั้งฟอร์มและ action
- **UI = shadcn/ui + Radix เท่านั้น**, rich text = Tiptap, ไอคอน = lucide ([rule 06](.claude/rules/06-ui-library.md))
- **สีจาก CSS variable ของ shadcn ใน `globals.css` เท่านั้น** ห้าม hardcode hex ([rule 08](.claude/rules/08-colors.md))
- **Tiptap HTML ต้อง sanitize** ก่อนเก็บและก่อน render ([rule 01](.claude/rules/01-security.md))
- **bcrypt = server-only** ห้ามหลุดเข้า client/edge

---

## 1. Data Model (Drizzle ORM + MariaDB)

> แปลงจาก data model ใน PLAN.md ให้เป็น Drizzle `mysql-core`. MariaDB ไม่มี array type จึงใช้ `json` กับ `tags`/`images`. `id` เป็น cuid/uuid ที่ **สร้างใน use case (application)** ไม่ใช่ใน DB เพื่อให้ domain คุม invariant ได้

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

// src/infrastructure/db/schema/posts.ts (Blog)
import { mysqlTable, varchar, text, json, int, timestamp, mysqlEnum, index } from "drizzle-orm/mysql-core";
export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content").notNull(),                 // sanitized HTML จาก Tiptap
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

// src/infrastructure/db/schema/projects.ts (Portfolio)
export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  client: varchar("client", { length: 255 }),
  category: varchar("category", { length: 100 }),       // ประเภทงาน เช่น เสื้อยืด/โปโล
  images: json("images").$type<string[]>().default([]), // หลายรูป
  coverImage: varchar("cover_image", { length: 500 }),
  date: timestamp("date"),
  status: mysqlEnum("status", ["DRAFT", "PUBLISHED"]).notNull().default("DRAFT"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({ statusIdx: index("projects_status_idx").on(t.status) }));

// src/infrastructure/db/schema/contacts.ts (ข้อความฟอร์มติดต่อ)
export const contacts = mysqlTable("contacts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

> แต่ละตารางถูกสร้างจริงในเฟสของ slice ที่ใช้ (users → เฟส 1, posts → เฟส 4, projects → เฟส 5, contacts → เฟส 6) ไม่ต้องสร้างทั้งหมดทีเดียว

---

## เฟส 0 — ตั้งต้นโปรเจกต์ (Foundation)

**เป้าหมาย:** มีโครงโปรเจกต์ที่ boot ได้ + โครง 4 ชั้นว่าง ๆ + tooling พร้อม

- [ ] `create-next-app` (Next 16, App Router, TS, Tailwind v4, ESLint `next/core-web-vitals` + `next/typescript`)
- [ ] init **shadcn/ui** (`npx shadcn@latest init`) → ได้ `components.json` + `globals.css` พร้อม CSS variable ([rule 08](.claude/rules/08-colors.md))
- [ ] ติดตั้ง Drizzle: `drizzle-orm mysql2` + `drizzle-kit` (dev); สร้าง `drizzle.config.ts` (`dialect: "mysql"`) และ `src/infrastructure/db/client.ts` (`drizzle(mysql2 pool)`)
- [ ] `src/shared/config/env.ts` — validate env ด้วย **Zod** (`DATABASE_URL`, `AUTH_SECRET`) fail fast ([rule 01](.claude/rules/01-security.md))
- [ ] วางโครงโฟลเดอร์ 4 ชั้น (`domain/ application/ infrastructure/ presentation/ shared/`) ตาม [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] ตั้ง **path alias** ใน `tsconfig.json` (`@/domain/*`, `@/application/*`, ...) ([rule 02](.claude/rules/02-structure.md))
- [ ] `next/font` โหลดฟอนต์ที่ใช้จริง; `app/layout.tsx` พื้นฐาน
- [ ] ตั้งสคริปต์ `package.json`: `dev`, `build`, `lint`, `db:generate`, `db:migrate`, `db:studio`, `seed`, `gen:secret`
- [ ] `next.config.ts` — security headers เริ่มต้น (CSP, HSTS, X-Frame-Options=SAMEORIGIN, `poweredByHeader:false`) ([rule 01](.claude/rules/01-security.md))

**DB:** ยังไม่มี table — ยังไม่ต้องรัน drizzle-kit
**Verify gate:** `npm run dev` boot ได้, `npm run build` + `npm run lint` ผ่าน, alias `@/*` import ได้

---

## เฟส 1 — ฐานข้อมูล + Domain ผู้ใช้ (เตรียม Auth)

**เป้าหมาย:** มีตาราง `users` + ชิ้นส่วน domain/port ที่ Auth ต้องใช้

- [ ] `domain/entities/user.ts`, `domain/value-objects/email.ts`, `domain/value-objects/slug.ts` (เตรียมไว้ใช้เฟสถัด ๆ)
- [ ] `application/ports/user-repository.ts` (`findByEmail`, `create`), `application/ports/password-hasher.ts` (`hash`, `compare`)
- [ ] `infrastructure/db/schema/users.ts` (ดู Data Model) → **แก้ schema แล้วหยุด แจ้ง user รัน `db:generate` + `db:migrate`**
- [ ] `infrastructure/repositories/drizzle-user-repository.ts` (implement `UserRepository`)
- [ ] `infrastructure/auth/bcrypt-password-hasher.ts` (implement `PasswordHasher`)
- [ ] `infrastructure/db/seed.ts` — สร้าง admin คนแรก (hash ด้วย bcrypt) ; รันด้วย `npm run seed` หลัง migrate
- [ ] เริ่ม `infrastructure/di/container.ts` (wire user repo + hasher)

**DB:** เพิ่มตาราง `users` (รอ user รัน migrate)
**Verify gate:** user migrate สำเร็จ, `npm run seed` สร้าง admin ได้, build/lint ผ่าน
**กฎที่เกี่ยว:** [01](.claude/rules/01-security.md), [09](.claude/rules/09-clean-architecture.md)

---

## เฟส 2 — ระบบ Auth (admin-only)

**เป้าหมาย:** ล็อกอินได้ + กัน `/admin/*` ครบ 2 ชั้น

- [ ] `application/dto/auth.dto.ts` (`loginSchema`) + `application/use-cases/auth/verify-credentials.ts` (เรียก `hasher.compare`)
- [ ] **NextAuth v5 split config**:
  - [ ] `infrastructure/auth/auth.config.ts` — **edge-safe** (ไม่มี bcrypt/Drizzle) ใช้ใน `proxy.ts`
  - [ ] `infrastructure/auth/auth.ts` — `NextAuth()` + Credentials provider + `session.strategy = "jwt"` (เรียก use case/bcrypt บน Node)
- [ ] `infrastructure/auth/require-admin.ts` — helper `requireAdmin()` (ใช้ใน Server Action/Server Component)
- [ ] `src/proxy.ts` (Next 16; เดิม `middleware.ts`) — เช็ก JWT ทุก `/admin/*` ยกเว้น `/admin/login` → ไม่มี session เด้ง login
- [ ] `app/api/auth/[...nextauth]/route.ts` (route handler ที่จำเป็นต้องมี)
- [ ] `app/(admin)/login/page.tsx` — ฟอร์ม `react-hook-form + zod + shadcn Form` (reuse `loginSchema`)
- [ ] `app/(admin)/admin/layout.tsx` — `requireAdmin()` + Sidebar (shadcn)

**DB:** ไม่เปลี่ยน schema
**Verify gate:** เข้า `/admin` โดยไม่ล็อกอิน → เด้ง login; ล็อกอินถูก/ผิดทำงานถูกต้อง; ตรวจว่า **bcrypt ไม่หลุดเข้า edge/client bundle** (`auth.config.ts` ต้อง edge-safe)
**กฎที่เกี่ยว:** [01](.claude/rules/01-security.md), [09](.claude/rules/09-clean-architecture.md), [05](.claude/rules/05-load-speed.md) (server-only)

---

## เฟส 3 — โครงหน้าเว็บฝั่งลูกค้า + หน้า static

**เป้าหมาย:** เว็บสาธารณะดูครบ (ยังไม่ต่อ DB) เน้น SEO + responsive

- [ ] `presentation/components/shared/`: `Navbar`, `Footer` + `app/layout.tsx` (Server Component)
- [ ] หน้า `(public)/`: `page.tsx` (Home ตาม 7 section ใน PLAN.md), `about`, `services` (+ `[slug]` จาก static data ก่อน), `contact` (ช่องทางติดต่อ: Line/โทร/แผนที่ — ฟอร์มยังไม่ต่อ DB), `faq` (shadcn `Accordion`), `privacy-policy`, `not-found.tsx`
- [ ] ทุกหน้าใส่ `generateMetadata` (title/description/canonical/OG) ([rule 05](.claude/rules/05-load-speed.md))
- [ ] รูปทั้งหมดใช้ `next/image`; เริ่มจาก Server Component, `"use client"` เฉพาะ leaf ([rule 04](.claude/rules/04-performance.md))

**DB:** ไม่เปลี่ยน schema
**Verify gate:** responsive ทุก breakpoint, metadata ครบ, ไม่มีสี hardcode (ใช้ token), build/lint ผ่าน
**กฎที่เกี่ยว:** [04](.claude/rules/04-performance.md), [05](.claude/rules/05-load-speed.md), [06](.claude/rules/06-ui-library.md), [08](.claude/rules/08-colors.md)

---

## เฟส 4 — ระบบ Blog (slice เต็มรูปแบบ — ใช้เป็นแม่แบบ)

**เป้าหมาย:** CRUD บทความหลังบ้าน + หน้าอ่านฝั่งลูกค้า ครบทั้ง slice
**ก่อนเริ่ม:** Map slice ตาม [rule 10 Phase 0](.claude/rules/10-feature-change-protocol.md)

- [ ] `domain/entities/post.ts` (+ `isPublished()`), ใช้ `value-objects/slug.ts`
- [ ] `application/dto/post.dto.ts` (`createPostSchema`, `updatePostSchema`, `listPostsQuerySchema`)
- [ ] `application/ports/post-repository.ts`
- [ ] `application/use-cases/blog/`: `create-post`, `update-post`, `delete-post`, `list-posts`, `get-post-by-slug` (gen slug + ตั้ง status/publishedAt ในนี้)
- [ ] `infrastructure/db/schema/posts.ts` (+ index `status`, `publishedAt`) → **แก้ schema แล้วหยุด แจ้ง user รัน migrate**
- [ ] `infrastructure/repositories/drizzle-post-repository.ts` + wire `di/container.ts`
- [ ] `presentation/actions/blog.actions.ts` — `requireAdmin → zod → use case → revalidatePath('/blog')`
- [ ] `presentation/components/blog/`: `TiptapEditor` (โหลดด้วย `dynamic(..., { ssr:false })`), `PostForm`, `PostCard`, `PostList`; ตารางหลังบ้าน (`Table` + `@tanstack/react-table`)
- [ ] หลังบ้าน `app/(admin)/admin/blog/`: `page.tsx` (ตาราง + ลบด้วย `AlertDialog`), `new/`, `[id]/edit/`
- [ ] ลูกค้า `app/(public)/blog/`: `page.tsx` (list + pagination + filter หมวด), `[slug]/page.tsx` (render เนื้อหา + JSON-LD `Article` + related)
- [ ] **Security:** sanitize HTML จาก Tiptap **ตอน save** (เก็บ HTML สะอาด) และ **ตอน render** อีกชั้น ([rule 01](.claude/rules/01-security.md))
- [ ] **Sweep dead code** (BE+FE) ตาม [rule 10 Phase 3](.claude/rules/10-feature-change-protocol.md)

**DB:** เพิ่มตาราง `posts`
**Verify gate:** สร้าง/แก้/ลบ/publish บทความได้, หน้า `/blog` + `/blog/[slug]` แสดงถูก, ไม่มี XSS (ลองใส่ `<script>` ในเนื้อหาแล้วต้องไม่รัน), build/lint ผ่าน
**กฎที่เกี่ยว:** [01](.claude/rules/01-security.md), [04](.claude/rules/04-performance.md), [06](.claude/rules/06-ui-library.md), [09](.claude/rules/09-clean-architecture.md), [10](.claude/rules/10-feature-change-protocol.md)

---

## เฟส 5 — ระบบ Portfolio (หลายรูปต่อผลงาน)

**เป้าหมาย:** CRUD ผลงาน + อัปโหลดหลายรูป + แกลเลอรีฝั่งลูกค้า (ทำตามแม่แบบเฟส 4)

- [ ] `domain/entities/project.ts`
- [ ] `application/dto/project.dto.ts`, `application/ports/project-repository.ts`
- [ ] `application/use-cases/portfolio/`: `create-project`, `update-project`, `delete-project`, `list-projects`, `get-project-by-slug`
- [ ] `infrastructure/services/upload-service.ts` — chokepoint `validateUploadFile`/`validateUploadBuffer` (ext + MIME + ขนาด ≤5MB + magic byte, sanitize ชื่อไฟล์) ([rule 01](.claude/rules/01-security.md))
- [ ] `infrastructure/db/schema/projects.ts` (`images` เป็น json) → **แก้ schema แล้วหยุด แจ้ง user รัน migrate**
- [ ] `infrastructure/repositories/drizzle-project-repository.ts` + wire DI
- [ ] `presentation/actions/portfolio.actions.ts` (รวม action อัปโหลดรูปผ่าน chokepoint)
- [ ] `presentation/components/portfolio/`: `ProjectForm` + `ImageUploader` (หลายรูป), `ProjectCard`, `Gallery`
- [ ] หลังบ้าน `app/(admin)/admin/portfolio/`: `page.tsx`, `new/`, `[id]/edit/`
- [ ] ลูกค้า `app/(public)/portfolio/`: `page.tsx` (กริด + filter ประเภทงาน), `[slug]/page.tsx` (แกลเลอรี `next/image` + JSON-LD `CreativeWork`)
- [ ] ถ้าใช้ host รูปภายนอก (Cloudinary/UploadThing) → เพิ่มใน `images.remotePatterns` + CSP `img-src`
- [ ] **Sweep dead code** (BE+FE)

**DB:** เพิ่มตาราง `projects`
**Verify gate:** อัปโหลดหลายรูปได้, ปฏิเสธไฟล์ปลอม MIME ได้, หน้า `/portfolio` + `[slug]` แสดงถูก, build/lint ผ่าน
**กฎที่เกี่ยว:** [01](.claude/rules/01-security.md), [04](.claude/rules/04-performance.md), [06](.claude/rules/06-ui-library.md), [09](.claude/rules/09-clean-architecture.md), [10](.claude/rules/10-feature-change-protocol.md)

---

## เฟส 6 — ฟอร์มติดต่อ + Dashboard + ขัดเงา + Deploy

**เป้าหมาย:** เก็บข้อความติดต่อจริง, แดชบอร์ดสรุป, SEO/PDPA ครบ, ขึ้น production

- [ ] `infrastructure/db/schema/contacts.ts` → **แก้ schema แล้วหยุด แจ้ง user รัน migrate**
- [ ] `application/dto/contact.dto.ts` + `application/use-cases/contact/create-contact.ts` + repo
- [ ] `presentation/actions/contact.actions.ts` — ⚠ **action นี้ public (ไม่เรียก `requireAdmin`)** แต่ **ต้อง** zod validate + rate limit + ไม่ log PII เต็ม ([rule 01](.claude/rules/01-security.md))
- [ ] ต่อฟอร์มหน้า `/contact` เข้ากับ action; (option) ส่งอีเมลผ่าน `infrastructure/services/mail-service.ts`
- [ ] `app/(admin)/admin/contacts/page.tsx` — ตารางข้อความ; `app/(admin)/admin/page.tsx` — dashboard นับจำนวน post/project/contact
- [ ] SEO (core): `app/sitemap.ts`, `app/robots.ts`, JSON-LD ทุกหน้า content, **Dynamic OG image ต่อบทความด้วย `next/og`**, **RSS feed `app/feed.xml`** ของ blog ([rule 05](.claude/rules/05-load-speed.md))
- [ ] PDPA: cookie consent banner + ตรวจหน้า `privacy-policy` ให้ครบ
- [ ] รอบ performance/a11y: ตรวจ `"use client"` ไม่ยกเกิน, `revalidatePath/Tag` หลัง mutation ครบ, virtualization ตารางยาว ([rule 04](.claude/rules/04-performance.md))
- [ ] Deploy Vercel: ตั้ง env (`DATABASE_URL`, `AUTH_SECRET`), ตรวจ CSP/headers ใน `next.config.ts`, รัน migrate บน DB production (**user รันเอง**)

**DB:** เพิ่มตาราง `contacts`
**Verify gate:** ส่งฟอร์มติดต่อแล้วเข้า DB + เห็นในหลังบ้าน, sitemap/robots ใช้ได้, build/lint ผ่าน, ทดสอบ golden path ทุกระบบบน production
**กฎที่เกี่ยว:** [01](.claude/rules/01-security.md), [04](.claude/rules/04-performance.md), [05](.claude/rules/05-load-speed.md)

---

## เช็กลิสต์ปิดทุก slice (อ้างจาก [rule 09](.claude/rules/09-clean-architecture.md))

- [ ] `domain/` ไม่ import React/Next/Drizzle/NextAuth/zod runtime
- [ ] `application/` ขึ้นต่อ port (interface) ไม่ขึ้นต่อ Drizzle concrete
- [ ] `infrastructure/` implement port 1:1 และ wire ใน `di/container.ts`
- [ ] `presentation/` ไม่ import `infrastructure/` ตรง; Server Action บางตาม pattern
- [ ] มี zod dto สำหรับ input/output ทุกขอบ
- [ ] mutation เรียก `revalidatePath`/`revalidateTag` ที่เกี่ยว
- [ ] กวาด dead code (BE + FE) แล้ว ([rule 10](.claude/rules/10-feature-change-protocol.md))
- [ ] `npm run build` + `npm run lint` ผ่าน + ทดสอบ browser

---

## สรุปลำดับเฟส

| เฟส | สิ่งที่ได้ | ตาราง DB ที่เพิ่ม | กฎหลัก |
|----|-----------|------------------|--------|
| 0 | โครงโปรเจกต์ + tooling | — | 01, 02, 08 |
| 1 | DB foundation + users + domain | `users` | 01, 09 |
| 2 | Auth admin (login + proxy.ts) | — | 01, 09 |
| 3 | หน้าลูกค้า static + SEO | — | 04, 05, 06, 08 |
| 4 | Blog (slice เต็ม + Tiptap) | `posts` | 01, 06, 09, 10 |
| 5 | Portfolio (หลายรูป + upload) | `projects` | 01, 06, 09, 10 |
| 6 | Contact + dashboard + SEO + deploy | `contacts` | 01, 04, 05 |

---

## แผน 7 วัน (Timeline)

> โปรเจกต์มีเวลา **7 วัน** — map เฟส 0–6 ลงตามวัน (1 วัน ≈ 1 working day) **บัฟเฟอร์/เทสต์/deploy อยู่วันที่ 7**
> ถ้าเฟส Blog (วัน 4–5) บานปลาย ให้ดึงเวลาจาก Bonus ก่อน อย่าลดขั้นตอน Verify

| วัน | โฟกัส (เฟส) | Deliverable หลัก | Verify ปลายวัน |
|----|-------------|------------------|----------------|
| **1** | เฟส 0 + 1 | setup Next 16 + Drizzle + shadcn + env (zod) + โครง 4 ชั้น + schema `users` + seed admin | `dev` boot, migrate `users` สำเร็จ, build/lint ผ่าน |
| **2** | เฟส 2 | NextAuth v5 split config + `proxy.ts` + `requireAdmin()` + หน้า `/admin/login` + admin layout | เข้า `/admin` ไม่ล็อกอิน → เด้ง login; ล็อกอินถูก/ผิดทำงาน |
| **3** | เฟส 3 | Navbar/Footer/layout + Home + about/services/contact(static)/faq/privacy + `generateMetadata` | responsive ครบ, metadata ครบ, ไม่มีสี hardcode |
| **4** | เฟส 4 (BE + หลังบ้าน) | Blog domain/dto/port/use-cases + schema `posts` + repo + Server Actions + Tiptap + admin CRUD | สร้าง/แก้/ลบ/publish บทความใน admin ได้ |
| **5** | เฟส 4 (public) + เฟส 5 (BE) | หน้า `/blog` + `[slug]` (sanitize, JSON-LD) + Portfolio domain/use-cases + `upload-service` + schema `projects` | อ่านบทความได้, ใส่ `<script>` แล้วไม่รัน (กัน XSS) |
| **6** | เฟส 5 (หลังบ้าน+public) + เฟส 6 (เริ่ม) | Portfolio CRUD หลายรูป + `/portfolio` + `[slug]` gallery + schema `contacts` + contact action + dashboard | อัปโหลดหลายรูปได้, ปฏิเสธไฟล์ปลอม MIME ได้ |
| **7** | เฟส 6 (จบ) + buffer | SEO `sitemap.ts`/`robots.ts`/JSON-LD + **OG image (`next/og`) + RSS `feed.xml`** + PDPA + รอบ perf/a11y + deploy Vercel + ทดสอบ golden path | build/lint ผ่าน, ทดสอบทุกระบบบน production, (Bonus ถ้าเหลือเวลา) |

### Bonus (ทำเฉพาะถ้า core เสร็จก่อนเวลา — รายละเอียดใน [PLAN.md §8](PLAN.md))
- **วันที่ 7 ถ้าเหลือเวลา (เร็ว ~0.5 วัน):** Dark mode · แจ้งเตือน contact + กันสแปม · Scheduled publish
- **หลัง launch / เฟส 7+ (ใหญ่กว่า):** ค้นหา + หน้า Tag/หมวด blog · Dashboard + กราฟ (shadcn charts) · i18n TH/EN
- ทุก Bonus ยังต้องผ่านเช็กลิสต์ปิด slice + Verify gate เดิม ห้ามลัด
