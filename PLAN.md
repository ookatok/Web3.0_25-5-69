# เอกสารวางแผนเว็บไซต์ (web3.0) — ธุรกิจบริการ + ระบบหลังบ้าน

> เว็บอ้างอิง: [thanaplus.com](https://thanaplus.com/) (โรงงานรับผลิตเสื้อ)
> แนวทาง: เว็บธุรกิจ/บริการ + เพิ่มระบบ **Auth (admin)**, **Blog**, **Portfolio**
> เทคโนโลยี: **Next.js 16 (App Router, React 19) · TypeScript · Drizzle ORM + MariaDB · NextAuth (Auth.js v5) · bcrypt · Tiptap · shadcn/ui + Radix · Tailwind v4 · Zod · Server Actions**
> เอกสารคู่กัน: [ARCHITECTURE.md](ARCHITECTURE.md) (โครงสร้างโค้ด) · [roadmap.md](roadmap.md) (ลำดับการสร้างทีละเฟส) · [.claude/rules/](.claude/rules/) (กฎโปรเจกต์) · [CLAUDE.md](CLAUDE.md)
> อัปเดต: 25 พ.ค. 2026

---

## 1. ภาพรวมและเป้าหมาย

เว็บนี้เป็นเว็บ "ธุรกิจบริการ" คล้าย thanaplus คือมีหน้าที่หลัก 3 อย่าง:

1. **ขายของ/ขายบริการ** — แนะนำสินค้า/บริการ และจูงใจให้ลูกค้าติดต่อ (ขอใบเสนอราคา / แชต Line / โทร)
2. **สร้างความน่าเชื่อถือ** — โชว์ผลงาน (Portfolio) และความรู้ (Blog) เพื่อให้ลูกค้าไว้ใจและช่วยเรื่อง SEO
3. **จัดการเองได้** — เจ้าของเว็บ (admin) เพิ่ม/แก้/ลบบทความและผลงานได้เองผ่านหน้าหลังบ้าน โดยไม่ต้องแก้โค้ด

หัวใจของหน้าเว็บฝั่งลูกค้าคือ **"ดูข้อมูล → เชื่อใจ → ติดต่อ"** ส่วนหลังบ้านคือ **"ล็อกอิน → จัดการเนื้อหา"**

---

## 2. โครงสร้างหน้าเว็บ (Sitemap)

### 2.1 หน้าฝั่งลูกค้า (Public)

| หน้า | Path | หน้าที่หลัก |
|------|------|-------------|
| หน้าแรก (Home) | `/` | ดึงดูดสายตา + สรุปทุกอย่าง + ปุ่มติดต่อ |
| บริการ/สินค้า (รวม) | `/services` | รวมบริการ/สินค้าทั้งหมดแบบการ์ด |
| บริการ/สินค้า (รายตัว) | `/services/[slug]` | รายละเอียดบริการแต่ละอย่าง + CTA |
| ผลงาน (รวม) | `/portfolio` | แกลเลอรีผลงาน กรองตามหมวดได้ |
| ผลงาน (รายชิ้น) | `/portfolio/[slug]` | รายละเอียดผลงาน + แกลเลอรีรูป |
| บทความ (รวม) | `/blog` | รายการบทความ ค้นหา/กรองหมวดได้ |
| บทความ (รายตัว) | `/blog/[slug]` | เนื้อหาบทความ + บทความที่เกี่ยวข้อง |
| เกี่ยวกับเรา | `/about` | เรื่องราว จุดเด่น ทีมงาน |
| ติดต่อเรา | `/contact` | ฟอร์มติดต่อ + แผนที่ + ช่องทางอื่น |
| คำถามที่พบบ่อย | `/faq` | FAQ accordion |
| นโยบายความเป็นส่วนตัว | `/privacy-policy` | ข้อกำหนด/PDPA |
| 404 / Error | `*` | หน้าไม่พบ / error |

### 2.2 หน้าหลังบ้าน (Admin — ต้องล็อกอิน)

| หน้า | Path | หน้าที่หลัก |
|------|------|-------------|
| เข้าสู่ระบบ | `/admin/login` | ฟอร์ม login (เฉพาะหน้านี้ที่ไม่ต้องล็อกอิน) |
| แดชบอร์ด | `/admin` | สรุปจำนวนบทความ/ผลงาน/ข้อความติดต่อล่าสุด |
| จัดการบทความ (รวม) | `/admin/blog` | ตารางบทความ + ปุ่มสร้าง/แก้/ลบ |
| สร้าง/แก้บทความ | `/admin/blog/new`, `/admin/blog/[id]/edit` | ฟอร์มเขียนบทความ (rich text) |
| จัดการผลงาน (รวม) | `/admin/portfolio` | ตารางผลงาน + ปุ่มสร้าง/แก้/ลบ |
| สร้าง/แก้ผลงาน | `/admin/portfolio/new`, `/admin/portfolio/[id]/edit` | ฟอร์มผลงาน + อัปโหลดหลายรูป |
| ข้อความติดต่อ | `/admin/contacts` | ดูข้อความจากฟอร์มติดต่อ (option) |
| ตั้งค่า | `/admin/settings` | เปลี่ยนรหัสผ่าน / ข้อมูลเว็บ (option) |

### 2.3 รายละเอียดเนื้อหาแต่ละหน้าสำคัญ

**หน้าแรก (`/`)** ควรมี section เรียงจากบนลงล่าง:

1. Hero — รูปใหญ่ + พาดหัว + ปุ่ม CTA ("ขอใบเสนอราคา" / "ดูผลงาน")
2. บริการ/สินค้าเด่น — การ์ด 4–8 อัน ลิงก์ไป `/services/[slug]`
3. จุดเด่น/ทำไมต้องเรา — ไอคอน + ข้อความสั้น (เช่น ออกแบบฟรี ส่งฟรี ให้คำปรึกษา)
4. ผลงานเด่น — ดึง portfolio ล่าสุด 3–6 ชิ้น
5. บทความล่าสุด — ดึง blog ล่าสุด 3 ชิ้น (เหมือน "ACADEMY" ของ thanaplus)
6. แถบ CTA ปิดท้าย — โทร / Line / ฟอร์มติดต่อ
7. Footer — ลิงก์ด่วน, ช่องทางติดต่อ, โซเชียล

**หน้าติดต่อ (`/contact`)** — ฟอร์ม (ชื่อ, เบอร์, อีเมล, รายละเอียด/สินค้าที่สนใจ) + ปุ่ม Line/โทร + แผนที่ Google Maps ฝัง

---

## 3. ออกแบบ 3 ระบบหลัก

### 3.1 ระบบ Auth (เฉพาะ admin)

จุดประสงค์: ป้องกันหน้า `/admin/*` ทั้งหมด ให้เฉพาะแอดมินที่ล็อกอินเข้าถึงได้

- ใช้ **Auth.js (NextAuth v5)** แบบ **Credentials (อีเมล + รหัสผ่าน)** — เหมาะกับกรณี admin จำนวนน้อย
- รหัสผ่านเก็บแบบ **hash ด้วย bcrypt** ไม่เก็บ plain text (**bcrypt = server-only** ห้ามหลุดเข้า client/edge)
- **split config (บังคับ)**: `auth.config.ts` ต้อง edge-safe (ไม่มี bcrypt/Drizzle) ใช้ใน `proxy.ts`; ส่วน `auth.ts` รัน bcrypt + Drizzle บน Node runtime
- **เก็บ session แบบ JWT** — Credentials ใช้ DB session ไม่ได้ จึง **ไม่ต้องมี adapter**
- กัน `/admin/*` **2 ชั้น (ต้อง sync กัน)**: (1) `src/proxy.ts` (Next 16 convention; เดิมชื่อ `middleware.ts`) เช็ก JWT ทุก request ขึ้นต้น `/admin` ยกเว้น `/admin/login`; (2) `requireAdmin()` ใน Server Action / Server Component
- ไม่มีหน้า "สมัครสมาชิก" สาธารณะ — สร้าง admin คนแรกผ่าน seed script (`src/infrastructure/db/seed.ts`)

> รายละเอียดความปลอดภัยเต็มดู [.claude/rules/01-security.md](.claude/rules/01-security.md)

### 3.2 ระบบ Blog post

หน้าแสดงผล: `/blog` (รายการ + แบ่งหน้า + ค้นหา + กรองหมวด), `/blog/[slug]` (เนื้อหาเต็ม + meta SEO + บทความเกี่ยวข้อง)
หน้าจัดการ: `/admin/blog` (ตาราง), ฟอร์มสร้าง/แก้ พร้อม **rich text editor = Tiptap** (เก็บเป็น HTML — **ต้อง sanitize ก่อนเก็บและก่อน render** ดู rule 01) โหลด editor ด้วย `dynamic(..., { ssr:false })` เฉพาะหน้า admin

ฟีเจอร์ที่ควรมี: สถานะ draft/published, สร้าง slug อัตโนมัติจากชื่อ, อัปโหลดรูปปก, หมวดหมู่ + แท็ก, นับยอดวิว (option)

> งานเขียน/แก้/ลบ ทั้ง Blog และ Portfolio ใช้ **Server Action** (`presentation/actions/*.actions.ts`) เป็นหลัก — บางเฉียบ: `requireAdmin → zod.parse → use case → revalidatePath`

### 3.3 ระบบ Portfolio post

คล้าย blog แต่เน้น "รูปภาพ" มากกว่า "ตัวอักษร"

หน้าแสดงผล: `/portfolio` (กริดรูป กรองตามประเภทงาน), `/portfolio/[slug]` (แกลเลอรีหลายรูป + รายละเอียดลูกค้า/ประเภทงาน/ปี)
หน้าจัดการ: `/admin/portfolio` + ฟอร์มที่ **อัปโหลดได้หลายรูป** ต่อหนึ่งผลงาน

### 3.4 Data Model (Drizzle ORM + MariaDB — `mysql-core`)

> MariaDB ไม่มี array type จึงใช้ `json` กับ `tags`/`images`; `id` เป็น cuid/uuid ที่ **สร้างใน use case (application)** ไม่ใช่ DB; ใส่ index ที่ column ที่ filter/sort บ่อย (status, publishedAt). โครงเต็มอยู่ใน [roadmap.md §1](roadmap.md) — ไฟล์จริงวางใน `src/infrastructure/db/schema/`

```ts
// users.ts (= admin)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hash
  name: varchar("name", { length: 255 }),
  role: mysqlEnum("role", ["ADMIN"]).notNull().default("ADMIN"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// posts.ts (Blog)
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

// projects.ts (Portfolio)
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

// contacts.ts (ข้อความจากฟอร์มติดต่อ)
export const contacts = mysqlTable("contacts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

> **DB workflow:** แก้ schema ที่ `src/infrastructure/db/schema/` แล้วหยุด → รัน `npm run db:generate` แล้ว `npm run db:migrate` เอง (ดู CLAUDE.md — ห้ามให้ Claude รัน drizzle-kit)

---

## 4. Tech Stack ที่แนะนำ

| ส่วน | เครื่องมือ | เหตุผล |
|------|-----------|--------|
| Framework | **Next.js 16** (App Router, React 19) | RSC/Server Actions, SSR/ISR ดีต่อ SEO |
| ภาษา | **TypeScript** (strict) | ลดบั๊ก, type จาก `z.infer`/Drizzle infer |
| สไตล์ | **Tailwind v4 + shadcn/ui + Radix** | UI สม่ำเสมอ, สีจาก CSS variable (rule 08) |
| ฐานข้อมูล | **MariaDB** | MySQL-compatible |
| ORM | **Drizzle ORM** (`drizzle-orm/mysql2`) | type-safe, เบา, migration ด้วย drizzle-kit |
| Auth | **NextAuth (Auth.js v5)** Credentials + bcrypt + JWT | admin-only, split config (edge/node) |
| Mutations | **Server Actions** (`"use server"`) | เป็นหลัก; route handler เฉพาะ NextAuth/webhook/upload |
| Rich text | **Tiptap** (เก็บ HTML + sanitize) | เขียนบทความ; โหลด dynamic เฉพาะ admin |
| อัปโหลดรูป | local `public/uploads/` หรือ Cloudinary/UploadThing | ผ่าน chokepoint `validateUploadFile` |
| ฟอร์ม | **react-hook-form + zod** + shadcn `Form` | reuse schema จาก `application/dto` |
| ไอคอน | **lucide-react** (named import) | เข้ากับ shadcn |
| Deploy | Vercel | เข้ากับ Next.js ที่สุด |

---

## 5. โครงสร้างโฟลเดอร์โปรเจกต์ (Clean Architecture 4 ชั้น)

> โครงเต็ม + เหตุผล + ตัวอย่าง flow ดู [ARCHITECTURE.md](ARCHITECTURE.md); สรุปย่อ:

```
web3.0/
├─ drizzle/                   # migration output (drizzle-kit)
├─ public/uploads/            # รูป static + ที่อัปโหลด
├─ src/
│  ├─ domain/                 # entity, value object, error — pure TS (ไม่พึ่ง framework)
│  ├─ application/            # ports (interface) + dto (zod) + use-cases (business logic)
│  ├─ infrastructure/         # drizzle repo, auth (NextAuth+bcrypt), upload, di/container
│  ├─ presentation/           # actions (Server Actions) + components (shadcn) + hooks
│  ├─ shared/                 # config/env (zod), utils, result
│  ├─ app/                    # routes เท่านั้น: (public)/ (admin)/ api/auth
│  └─ proxy.ts                # กัน /admin/* (Next 16; เดิม middleware.ts) — auth.config.ts edge-safe
├─ drizzle.config.ts          # dialect: "mysql"
├─ .env                       # DATABASE_URL, AUTH_SECRET
└─ package.json
```

**Dependency rule:** `app → presentation → application → domain`; `infrastructure` implement ports ของ `application` แล้ว wire ใน `di/container.ts` (ดู [rule 09](.claude/rules/09-clean-architecture.md))

---

## 6. Roadmap การพัฒนา (แบ่งเป็นเฟส)

> รายละเอียดเต็มแต่ละเฟส (checklist deliverable + Verify gate + DB change + กฎที่เกี่ยว) อยู่ใน [roadmap.md](roadmap.md) — สรุปลำดับ:

**เฟส 0 — ตั้งต้น:** create Next 16 + TS + Tailwind v4, init shadcn, ตั้งค่า Drizzle + `drizzle.config.ts`, validate env (zod), วางโครง 4 ชั้น + path alias, security headers

**เฟส 1 — DB foundation + users:** domain/port ของผู้ใช้ + schema `users` (Drizzle) + repo + bcrypt hasher + seed admin

**เฟส 2 — ระบบ Auth:** NextAuth v5 split config (`auth.config.ts`/`auth.ts`) + `requireAdmin()` + `proxy.ts` กัน `/admin` + หน้า login

**เฟส 3 — หน้าฝั่งลูกค้า (static):** Navbar/Footer/layout, Home, about, services, contact (ช่องทางติดต่อก่อน), faq, privacy + `generateMetadata`

**เฟส 4 — ระบบ Blog (slice เต็ม):** domain/dto/port/use-cases + schema `posts` + repo + Server Actions + Tiptap (sanitize) + หลังบ้าน CRUD + หน้า `/blog`, `/blog/[slug]`

**เฟส 5 — ระบบ Portfolio:** เหมือนเฟส 4 + `validateUploadFile` (upload หลายรูป) + schema `projects` + หน้า `/portfolio`, `/portfolio/[slug]`

**เฟส 6 — ขัดเงา + deploy:** ฟอร์มติดต่อเข้า DB (`contacts`, action public + zod + rate limit), dashboard, SEO (`sitemap.ts`/`robots.ts`/JSON-LD), PDPA, deploy Vercel

---

## 7. เรื่องที่ควรคิดเพิ่ม (Extras)

- **SEO (ต้องทำ — core):** `generateMetadata` ทุกหน้า, `sitemap.ts` + `robots.ts`, JSON-LD, **Dynamic OG image ต่อบทความด้วย `next/og`**, และ **RSS feed `app/feed.xml`** ของ blog — สำคัญมากสำหรับเว็บธุรกิจ (ดู [rule 05](.claude/rules/05-load-speed.md))
- **PDPA / Cookie consent:** มี banner ขอความยินยอม + หน้านโยบายความเป็นส่วนตัว
- **ภาษา:** ถ้าต้องการ TH/EN ค่อยเพิ่ม i18n ภายหลัง (เฟส 5+)
- **ประสิทธิภาพรูป:** ใช้ `next/image` เสมอเพื่อโหลดเร็ว
- **ความปลอดภัย:** rate limit หน้า login, validate ทุก input, ไม่เก็บรหัสผ่านเป็น plain text

---

## 8. Bonus (ฟีเจอร์เสริม — ทำเมื่อ core เสร็จ / ถ้ามีเวลาวันท้าย)

> ทุกข้อยังต้องอยู่ในกรอบกฎเดิม (Clean Architecture, Server Actions, zod, สีจาก token, shadcn) เรียงจากคุ้มค่า+ทำง่าย → ใหญ่ · ดูการจัดวันใน [roadmap.md — แผน 7 วัน](roadmap.md)

1. **Dark mode (next-themes)** — สลับโหมดสว่าง/มืดทั้งเว็บ ใช้ชุด `.dark` CSS variable ของ shadcn ([rule 08](.claude/rules/08-colors.md)) ห้าม hardcode สี · ชั้น: presentation · ~0.5 วัน
2. **ค้นหา + หน้า Tag/หมวดของ Blog** — ช่องค้นหา (debounce) + route `/blog/tag/[tag]`, `/blog/category/[slug]`; เพิ่ม use case `searchPosts`/`listPostsByTag` (Drizzle `where`/`like`) ดีต่อ SEO + UX · ชั้น: application + app · ~0.5–1 วัน
3. **แจ้งเตือนเมื่อมีลูกค้าติดต่อ + กันสแปม** — มี contact ใหม่ → ส่ง Email / Line Notify ผ่าน `infrastructure/services/`; กันสแปมด้วย honeypot + rate limit + reCAPTCHA (action ติดต่อเป็น **public** จึงต้อง zod + จำกัดอัตราตาม [rule 01](.claude/rules/01-security.md)) · ~0.5 วัน
4. **Admin dashboard + กราฟ** — นับยอดวิวบทความ (`views`) + กราฟจำนวน post/project/contact ด้วย **shadcn charts** (lib เดียว ตาม [rule 06](.claude/rules/06-ui-library.md)) + top posts · ชั้น: application (aggregate ที่ DB) + presentation · ~0.5–1 วัน
5. **Scheduled publish / Draft preview** — ตั้ง `publishedAt` ล่วงหน้า (ขึ้นเองเมื่อถึงเวลาได้ผ่าน `revalidate`) + ลิงก์ preview ของ draft (token) ก่อน publish · ชั้น: application + app · ~0.5 วัน
6. **i18n สองภาษา (TH/EN)** — `next-intl` แยกข้อความ + prefix `/en` ขยายกลุ่มลูกค้า (ทำท้ายสุดเพราะกระทบหลายหน้า) · ~1 วัน

> หมายเหตุ: **SEO เชิงลึก (Dynamic OG image ด้วย `next/og` + RSS feed `app/feed.xml`) ไม่ใช่ Bonus — เป็นงาน core อยู่ในเฟส 6** (ดู [roadmap.md](roadmap.md))

---

## สรุปสั้น ๆ

หน้าที่ "ต้องมี" สำหรับเริ่ม: **Home, Services, Portfolio, Blog, About, Contact, FAQ** (ฝั่งลูกค้า) + **Login, Dashboard, จัดการ Blog, จัดการ Portfolio** (หลังบ้าน) โดยมี 3 ระบบหลังบ้านคือ Auth (เฉพาะแอดมิน), Blog (CRUD บทความ), และ Portfolio (CRUD ผลงานพร้อมหลายรูป) — ทำตาม [roadmap.md](roadmap.md) เฟส 0→6 ภายใต้โครง Clean Architecture และกฎใน [.claude/rules/](.claude/rules/) จะค่อย ๆ ประกอบร่างได้ครบ
