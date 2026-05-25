# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

โปรเจกต์: **web3.0** — เว็บธุรกิจบริการ (แนว thanaplus) + ระบบ Auth (admin), Blog, Portfolio
เอกสารที่เกี่ยวข้อง: [PLAN.md](PLAN.md) (ผังหน้าเว็บ/roadmap) · [ARCHITECTURE.md](ARCHITECTURE.md) (โครงสร้างโฟลเดอร์ Clean Architecture)

## Project Rules (MUST READ FIRST)

ก่อนแก้ไขโค้ดทุกครั้ง ต้องอ่านและปฏิบัติตามกฏใน [.claude/rules/](.claude/rules/) — กฏเหล่านี้ override default behavior:

- [01-security.md](.claude/rules/01-security.md) — NextAuth v5 (split config), Server Action เป็น trust boundary, Zod, file upload, Tiptap XSS, secrets, CSP
- [02-structure.md](.claude/rules/02-structure.md) — โครงสร้าง 4 ชั้น, naming, layering, Server Actions ก่อน API route
- [03-clean-code.md](.claude/rules/03-clean-code.md) — TS strict, no-`any`, type จาก `z.infer` / Drizzle `$inferSelect`, comment WHY-only
- [04-performance.md](.claude/rules/04-performance.md) — Server Component first, re-render control, Tiptap dynamic import, virtualization
- [05-load-speed.md](.claude/rules/05-load-speed.md) — bundle size, code split, caching/revalidate, Drizzle query, SEO (metadata/sitemap/JSON-LD)
- [06-ui-library.md](.claude/rules/06-ui-library.md) — **shadcn/ui + Radix เท่านั้น** ห้ามเขียน UI primitive เอง; rich text = Tiptap; ไอคอน = lucide
- [07-reusability.md](.claude/rules/07-reusability.md) — Rule of Three, ค้นของเดิมก่อน extract, composition > configuration
- [08-colors.md](.claude/rules/08-colors.md) — **ใช้ CSS variable ของ shadcn ใน [src/app/globals.css](src/app/globals.css) เท่านั้น** ห้าม hardcode hex / Tailwind default palette
- [09-clean-architecture.md](.claude/rules/09-clean-architecture.md) — **4-layer (domain/application/infrastructure/presentation) + ports + DI** dependency ชี้เข้าด้านในเท่านั้น, Server Action บางเฉียบ, business logic อยู่ใน use case
- [10-feature-change-protocol.md](.claude/rules/10-feature-change-protocol.md) — **Protocol บังคับทุกครั้งที่แก้/เพิ่ม feature**: Map → Plan → Implement → **sweep dead code (BE + FE)** → Verify

ถ้ากฏขัดกับคำขอผู้ใช้ → แจ้งและขอคำยืนยันก่อนละเมิด ห้ามเงียบ ๆ ข้ามกฏ

## Database Workflow (สำคัญมาก)

ใช้ **Drizzle ORM + MariaDB** จัดการ schema/migration ด้วย **drizzle-kit**

- **ห้ามรัน `drizzle-kit push` / `npm run db:push` เด็ดขาด** — ไม่ว่ากรณีใด ๆ
- **ห้ามรัน `drizzle-kit generate` / `drizzle-kit migrate` เอง** — ผู้ใช้จะรันเองทุกครั้ง
- เมื่อมีงานเกี่ยวกับ database (เพิ่ม/แก้ table, column, relation, index, enum) → **แก้ที่ [src/infrastructure/db/schema/](src/infrastructure/db/schema/) เท่านั้น** แล้วหยุด
- หลังแก้ schema เสร็จ → **แจ้งผู้ใช้** ว่าควรรันคำสั่งอะไร (เช่น `npm run db:generate` แล้ว `npm run db:migrate`) **แล้วรอผู้ใช้รันเอง**
- ถ้าต้องตรวจ schema ปัจจุบันใน DB → ขอให้ผู้ใช้ `drizzle-kit pull` หรือ query เอง อย่ารันให้

## Architecture

Next.js 16 (App Router, React 19) เว็บธุรกิจบริการ + หลังบ้านสำหรับ admin จัดการ Blog/Portfolio
โครงสร้าง **Clean Architecture 4 ชั้น** (รายละเอียดเต็มใน [ARCHITECTURE.md](ARCHITECTURE.md)):

```
src/domain/         # entity, value object, error — pure TS
src/application/     # ports (interface) + dto (zod) + use-cases
src/infrastructure/ # drizzle repo, auth (NextAuth+bcrypt), upload, di/container
src/presentation/   # actions (Server Actions) + components (shadcn) + hooks
src/shared/         # config/env (zod), utils, result
src/app/            # routes: (public)/ (admin)/ api/auth
src/proxy.ts        # กัน /admin/* (Next 16; เดิม middleware.ts) ใช้ auth.config.ts edge-safe
```

**Dependency rule**: `app → presentation → application → domain`; `infrastructure` implements `application/ports` และถูก wire ใน `di/container.ts` เท่านั้น (ดู [rule 09](.claude/rules/09-clean-architecture.md))

### Auth model (admin-only)
- role เดียว = **ADMIN**; login ด้วย NextAuth v5 (Auth.js) Credentials + bcrypt + **JWT session** (Credentials ใช้ DB session ไม่ได้ → ไม่ต้องมี adapter)
- **split config**: `auth.config.ts` edge-safe (ใช้ใน `proxy.ts`), `auth.ts` รัน bcrypt+Drizzle บน Node
- กัน `/admin/*` 2 ชั้น: `proxy.ts` (edge) + `requireAdmin()` ใน Server Action/Server Component — ต้อง sync กัน
- ไม่มีหน้าสมัครสมาชิก; admin คนแรกมาจาก `src/infrastructure/db/seed.ts`

### Mutations = Server Actions
งานเขียน/แก้/ลบ ใช้ Server Action ใน `src/presentation/actions/*.actions.ts` (`"use server"`) เป็นหลัก — บางเฉียบ: `requireAdmin → zod.parse → use case → revalidatePath`. Route handler ใช้เฉพาะ NextAuth (`app/api/auth/[...nextauth]/route.ts`), webhook, upload, public API

### Blog / Portfolio
- Blog: เนื้อหาจาก **Tiptap** เก็บเป็น HTML — **ต้อง sanitize ก่อน render** (ดู [rule 01](.claude/rules/01-security.md))
- Portfolio: 1 ผลงานมีหลายรูป — อัปโหลดผ่าน chokepoint `validateUploadFile` เท่านั้น

## Commands

> โปรเจกต์ยังอยู่ช่วงตั้งต้น — สคริปต์ด้านล่างคือชุดที่ตั้งใจให้มีใน `package.json` (ปรับตามจริงเมื่อ scaffold)

- `npm run dev` — start Next.js dev server (port 3000)
- `npm run build` — `next build` ใช้ verify type/build error
- `npm run lint` — ESLint (`next/core-web-vitals` + `next/typescript`)
- `npm run db:generate` — drizzle-kit generate migration จาก schema (**ผู้ใช้รันเอง**)
- `npm run db:migrate` — apply migration ไป DB ตาม `DATABASE_URL` (**ผู้ใช้รันเอง**)
- `npm run db:studio` — เปิด Drizzle Studio ดูข้อมูล
- `npm run seed` — สร้าง admin คนแรก (`src/infrastructure/db/seed.ts`)
- `npm run gen:secret` — print `AUTH_SECRET` ใหม่ (เช่น `openssl rand -base64 32`)

ถ้ายังไม่มี test framework — เมื่อแก้ logic สำคัญต้องทดสอบด้วยมือผ่าน browser และระบุใน end-of-turn summary

## Environment

- MariaDB ผ่าน Drizzle (`drizzle-orm/mysql2`). `.env` ต้องมี `DATABASE_URL` และ `AUTH_SECRET`
- validate env ด้วย Zod ที่ [src/shared/config/env.ts](src/shared/config/env.ts) — fail fast ตอน boot ถ้าตัวแปรหาย
- client-side ใช้ได้เฉพาะ env ที่ขึ้นต้น `NEXT_PUBLIC_`
- **bcrypt เป็น server-only** ห้ามหลุดเข้า client/edge

## Conventions

- Imports ใช้ alias `@/*` → `./src/*` (ดู [tsconfig.json](tsconfig.json)) — ห้าม relative ลึกเกิน 2 ระดับ
- TypeScript `strict`; type source of truth: `z.infer<typeof schema>` > Drizzle `$inferSelect`/`$inferInsert` > hand-rolled
- โค้ดผสมไทย/อังกฤษ (ไทยเป็นหลักสำหรับ business note) — match ภาษาในไฟล์เดิมเมื่อแก้
- mutation ทุกครั้งต้อง `revalidatePath`/`revalidateTag` หน้าที่เกี่ยว

## Skills

โปรเจกต์ยังไม่มี project skill เฉพาะใน `.claude/skills/` — ถ้าต้องการสร้าง workflow skill (เช่น new-feature, migrate) ใช้ `skill-creator` แล้ววางใน `.claude/skills/<name>/SKILL.md`
