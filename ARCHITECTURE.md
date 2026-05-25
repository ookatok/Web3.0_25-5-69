# โครงสร้างโฟลเดอร์ (Clean Architecture) — web3.0

> เว็บธุรกิจบริการ + ระบบ Auth (admin), Blog, Portfolio
> Stack: **Next.js 16 (App Router) · TypeScript · Drizzle ORM + MariaDB · NextAuth (Auth.js v5) · bcrypt · Tiptap · shadcn/ui + Radix · Zod · Server Actions**
> อัปเดต: 25 พ.ค. 2026

---

## 1. แนวคิด Clean Architecture (อ่านก่อน)

หัวใจมีข้อเดียวคือ **The Dependency Rule: dependency ชี้เข้าด้านในเสมอ** ชั้นในไม่รู้จักชั้นนอก

```
            ┌─────────────────────────────────────────────┐
            │  Presentation / Frameworks & Drivers          │  ← Next.js, UI, Server Actions, Drizzle
            │   ┌─────────────────────────────────────┐     │
            │   │  Infrastructure (Adapters)            │     │  ← repository impl, auth, db
            │   │   ┌─────────────────────────────┐     │     │
            │   │   │  Application (Use Cases)       │     │     │  ← business logic + ports
            │   │   │   ┌─────────────────────┐     │     │     │
            │   │   │   │  Domain (Entities)    │     │     │     │  ← core rules, ไม่พึ่งใคร
            │   │   │   └─────────────────────┘     │     │     │
            │   │   └─────────────────────────────┘     │     │
            │   └─────────────────────────────────────┘     │
            └─────────────────────────────────────────────┘
                 ลูกศรพึ่งพา (import) ชี้เข้าด้านในเท่านั้น →
```

แปลเป็นกฎใช้งานจริง 4 ข้อ:

1. **Domain** ห้าม import อะไรจาก Next / Drizzle / NextAuth เด็ดขาด — เป็น TypeScript ล้วน
2. **Application** รู้จักแค่ Domain และ " port" (interface) ที่ตัวเองนิยาม — ไม่รู้ว่าจริง ๆ ใช้ Drizzle หรือ MariaDB
3. **Infrastructure** เป็นคน implement port เหล่านั้นด้วยของจริง (Drizzle, bcrypt, mailer)
4. **Presentation** (หน้า + Server Actions + UI) เรียก use case ผ่าน DI container เท่านั้น

ผลที่ได้: ถ้าวันหน้าเปลี่ยน MariaDB → Postgres หรือเปลี่ยน Tiptap → อื่น แก้แค่ชั้น Infrastructure/Presentation โดยที่ business logic ไม่กระทบ

---

## 2. โครงสร้างโฟลเดอร์เต็ม

```
web3.0/
├─ drizzle/                          # ผลลัพธ์ migration จาก drizzle-kit
│  └─ migrations/
├─ public/                           # โลโก้, รูป static
├─ src/
│  │
│  ├─ domain/                        # ───── ชั้น 1: Entities (กฎหลักของธุรกิจ) ─────
│  │  ├─ entities/
│  │  │  ├─ post.ts                  # type Post + กฎ เช่น isPublished()
│  │  │  ├─ project.ts               # type Project (Portfolio)
│  │  │  └─ user.ts                  # type AdminUser + Role
│  │  ├─ value-objects/
│  │  │  ├─ slug.ts                  # สร้าง/ตรวจ slug
│  │  │  └─ email.ts
│  │  └─ errors/
│  │     └─ domain-error.ts          # NotFoundError, ValidationError ฯลฯ
│  │
│  ├─ application/                   # ───── ชั้น 2: Use Cases + Ports ─────
│  │  ├─ ports/                      # "สัญญา" (interface) ที่ infra ต้องทำตาม
│  │  │  ├─ post-repository.ts       # interface PostRepository
│  │  │  ├─ project-repository.ts
│  │  │  ├─ user-repository.ts
│  │  │  └─ password-hasher.ts       # interface { hash, compare }
│  │  ├─ dto/                        # zod schema + type ของ input/output
│  │  │  ├─ post.dto.ts              # createPostSchema, updatePostSchema
│  │  │  ├─ project.dto.ts
│  │  │  └─ auth.dto.ts              # loginSchema
│  │  └─ use-cases/
│  │     ├─ blog/
│  │     │  ├─ create-post.ts
│  │     │  ├─ update-post.ts
│  │     │  ├─ delete-post.ts
│  │     │  ├─ list-posts.ts
│  │     │  └─ get-post-by-slug.ts
│  │     ├─ portfolio/
│  │     │  ├─ create-project.ts
│  │     │  ├─ update-project.ts
│  │     │  ├─ delete-project.ts
│  │     │  └─ list-projects.ts
│  │     └─ auth/
│  │        └─ verify-credentials.ts # ตรวจอีเมล+รหัส (เรียก hasher.compare)
│  │
│  ├─ infrastructure/               # ───── ชั้น 3: Adapters / ของจริง ─────
│  │  ├─ db/
│  │  │  ├─ schema/                  # Drizzle table (mysql-core)
│  │  │  │  ├─ posts.ts
│  │  │  │  ├─ projects.ts
│  │  │  │  ├─ users.ts
│  │  │  │  └─ index.ts
│  │  │  ├─ client.ts                # drizzle(mysql2 pool) → export `db`
│  │  │  └─ seed.ts                  # สร้าง admin คนแรก (bcrypt hash)
│  │  ├─ repositories/               # implement ports ด้วย Drizzle
│  │  │  ├─ drizzle-post-repository.ts
│  │  │  ├─ drizzle-project-repository.ts
│  │  │  └─ drizzle-user-repository.ts
│  │  ├─ auth/
│  │  │  ├─ auth.config.ts           # ⚠ edge-safe (ไม่มี bcrypt) → ใช้ใน proxy.ts
│  │  │  ├─ auth.ts                  # NextAuth() init + Credentials + bcrypt (Node)
│  │  │  └─ bcrypt-password-hasher.ts# implement PasswordHasher port
│  │  ├─ services/
│  │  │  ├─ upload-service.ts        # อัปโหลดรูป (UploadThing/Cloudinary/local)
│  │  │  └─ mail-service.ts          # ส่งอีเมลจากฟอร์มติดต่อ (option)
│  │  └─ di/
│  │     └─ container.ts             # composition root: ผูก port → impl
│  │
│  ├─ presentation/                 # ───── ชั้น 4: UI Adapters ─────
│  │  ├─ actions/                    # Server Actions = "controller" (บาง ๆ)
│  │  │  ├─ blog.actions.ts          # "use server" → validate → เรียก use case
│  │  │  ├─ portfolio.actions.ts
│  │  │  └─ auth.actions.ts
│  │  ├─ components/
│  │  │  ├─ ui/                      # shadcn generate ลงตรงนี้
│  │  │  ├─ shared/                  # Navbar, Footer, SectionHeading
│  │  │  ├─ blog/                    # PostCard, PostList, TiptapEditor
│  │  │  ├─ portfolio/               # ProjectCard, Gallery, ImageUploader
│  │  │  └─ admin/                   # AdminSidebar, DataTable, ConfirmDialog
│  │  └─ hooks/
│  │     └─ use-...ts
│  │
│  ├─ shared/                       # ───── cross-cutting (ใช้ได้ทุกชั้น) ─────
│  │  ├─ config/
│  │  │  └─ env.ts                   # อ่าน + validate env ด้วย zod
│  │  ├─ utils/
│  │  │  ├─ cn.ts                    # className helper (shadcn)
│  │  │  └─ format.ts
│  │  └─ result.ts                   # Result<T, E> / Either สำหรับ error handling
│  │
│  ├─ app/                          # ───── Next.js App Router (จุดเข้า) ─────
│  │  ├─ (public)/
│  │  │  ├─ page.tsx                 # หน้าแรก
│  │  │  ├─ services/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ portfolio/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ blog/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  ├─ contact/page.tsx
│  │  │  └─ faq/page.tsx
│  │  ├─ (admin)/
│  │  │  ├─ login/page.tsx
│  │  │  └─ admin/
│  │  │     ├─ layout.tsx            # ตรวจ session + AdminSidebar
│  │  │     ├─ page.tsx              # dashboard
│  │  │     ├─ blog/
│  │  │     │  ├─ page.tsx           # ตาราง
│  │  │     │  ├─ new/page.tsx
│  │  │     │  └─ [id]/edit/page.tsx
│  │  │     └─ portfolio/
│  │  │        ├─ page.tsx
│  │  │        ├─ new/page.tsx
│  │  │        └─ [id]/edit/page.tsx
│  │  ├─ api/
│  │  │  └─ auth/[...nextauth]/route.ts  # NextAuth handler (จำเป็นต้องเป็น route)
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  │
│  └─ proxy.ts                       # กัน /admin/* (Next 16; เดิม middleware.ts) ใช้ auth.config.ts edge-safe
│
├─ drizzle.config.ts                 # ตั้งค่า drizzle-kit (dialect: "mysql")
├─ components.json                   # config ของ shadcn
├─ .env                              # DATABASE_URL, AUTH_SECRET, ...
├─ tsconfig.json                     # ตั้ง path alias (ดูข้อ 4)
└─ package.json
```

---

## 3. ตัวอย่าง Flow จริง: "แอดมินสร้างบทความ"

ไล่จากนอกเข้าใน เพื่อให้เห็นว่าแต่ละชั้นทำงานต่อกันยังไง:

```
[1] app/(admin)/admin/blog/new/page.tsx
        ฟอร์ม (react-hook-form + zod) — เรียก action ตอน submit
                 │
                 ▼
[2] presentation/actions/blog.actions.ts        ("use server")
        - เช็ก session ด้วย auth()  ← ถ้าไม่ใช่ admin → throw
        - validate ด้วย createPostSchema (zod)
        - container.createPost.execute(input)
                 │
                 ▼
[3] application/use-cases/blog/create-post.ts
        - business rule: gen slug, ตั้ง status, set publishedAt
        - เรียก this.postRepo.save(post)   ← รู้จักแค่ "interface"
                 │
                 ▼
[4] infrastructure/repositories/drizzle-post-repository.ts
        - implement PostRepository ด้วย Drizzle จริง
        - db.insert(posts).values(...)
                 │
                 ▼
[5] infrastructure/db/client.ts → MariaDB
```

จุดเชื่อม (`container.ts`) คือที่เดียวที่ "ของจริง" มาเจอ "interface":

```ts
// infrastructure/di/container.ts
import { db } from "@/infrastructure/db/client";
import { DrizzlePostRepository } from "@/infrastructure/repositories/drizzle-post-repository";
import { CreatePost } from "@/application/use-cases/blog/create-post";

const postRepo = new DrizzlePostRepository(db);

export const container = {
  createPost: new CreatePost(postRepo),
  // ...use case อื่น ๆ
};
```

> use case รับ repository ผ่าน constructor (dependency injection) จึงไม่รู้ว่าเบื้องหลังเป็น Drizzle — ทดสอบง่ายเพราะ mock interface ได้

---

## 4. Path alias (tsconfig.json) — บังคับทิศทาง dependency ให้อ่านง่าย

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/domain/*":         ["src/domain/*"],
      "@/application/*":     ["src/application/*"],
      "@/infrastructure/*":  ["src/infrastructure/*"],
      "@/presentation/*":    ["src/presentation/*"],
      "@/shared/*":          ["src/shared/*"],
      "@/*":                 ["src/*"]
    }
  }
}
```

กฎ import ที่ทีมควรถือ (ใส่ใน lint ก็ได้ด้วย eslint-plugin-boundaries):

| ชั้น | import จากชั้นไหนได้ |
|------|----------------------|
| domain | (ไม่มี — พึ่งตัวเองเท่านั้น) |
| application | domain, shared |
| infrastructure | application, domain, shared |
| presentation | application, domain, shared, (di container) |
| app | presentation, di container |

---

## 5. หมายเหตุเฉพาะ stack นี้

- **NextAuth v5 split config** — `auth.config.ts` ต้อง edge-safe (ไม่มี bcrypt/Drizzle) เพื่อให้ `proxy.ts` (Next 16 convention; เดิมชื่อ `middleware.ts`) import ได้ ส่วน bcrypt อยู่ใน `auth.ts` ที่รันบน Node เท่านั้น
- **Credentials provider → JWT session** (`session.strategy = "jwt"`) เพราะ Credentials ใช้ DB session ไม่ได้ ⇒ กรณี admin-only นี้ไม่ต้องมี drizzle adapter
- **Server Actions เป็นด่านความปลอดภัย** — ทุก action ต้อง (1) เช็ก session, (2) validate zod ก่อนเรียก use case เสมอ
- **Drizzle + MariaDB** — `drizzle.config.ts` ตั้ง `dialect: "mysql"`, client ใช้ `drizzle-orm/mysql2` + connection pool, ตาราง define ด้วย `mysql-core`
- **Tiptap** เก็บเนื้อหาเป็น HTML (หรือ JSON) ลง column `content` — ตัว editor เป็น client component อยู่ใน `presentation/components/blog/`
- **shadcn/ui** generate ลง `presentation/components/ui/` และตั้ง `components.json` ให้ชี้ alias ตรงกัน
- **Zod** ใช้ซ้ำได้ 2 ที่: นิยามใน `application/dto` แล้ว import ไปใช้ทั้งฝั่งฟอร์ม (react-hook-form) และฝั่ง server action

---

## สรุป

โครงนี้แยกชัด 4 ชั้น: `domain` (กฎธุรกิจล้วน) → `application` (use case + interface) → `infrastructure` (Drizzle/bcrypt/NextAuth ของจริง) → `presentation` + `app` (UI + Server Actions) โดย dependency ชี้เข้าด้านในทางเดียว ทำให้เปลี่ยน DB หรือ UI library ได้โดยไม่แตะ business logic และเทสต์ได้ง่ายด้วยการ mock ports
