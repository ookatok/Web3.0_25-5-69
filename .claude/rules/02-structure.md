---
name: rule-structure
description: กฏโครงสร้างไฟล์/โฟลเดอร์ — naming, layering, alias, route grouping (Clean Architecture)
---

# 2. โครงสร้างไฟล์และโฟลเดอร์

> โครงสร้างเต็มและเหตุผลอยู่ใน [../../ARCHITECTURE.md](../../ARCHITECTURE.md) — ไฟล์นี้คือกฏย่อที่ต้องบังคับใช้

## Top-level Layout (Clean Architecture 4 ชั้น)
```
src/
  domain/            # Entities / value object / domain error — pure TS เท่านั้น
  application/        # use case + ports (interface) + dto (zod) — business logic
  infrastructure/    # Drizzle repo, auth, bcrypt, upload, di/container — implement ports
  presentation/      # actions (Server Actions) + components (shadcn) + hooks
  shared/            # cross-cutting: config/env, utils, result type
  app/               # Next.js App Router (routes เท่านั้น): (public)/ (admin)/ api/auth
  proxy.ts           # กัน /admin/* (Next 16; เดิม middleware.ts) — ใช้ auth.config.ts edge-safe
drizzle/             # migration output จาก drizzle-kit
public/uploads/
.claude/rules/
```

## Naming
- Component: `PascalCase.tsx` (เช่น `PostCard.tsx`, `TiptapEditor.tsx`)
- Hook: `useXxx.ts` camelCase
- Use case: `verb-noun.ts` (เช่น `create-post.ts`, `list-projects.ts`)
- Port (interface): `noun-repository.ts` → `interface PostRepository` (เช่น `password-hasher.ts`)
- Adapter: `drizzle-<noun>-repository.ts` / `bcrypt-password-hasher.ts`
- Zod schema/dto: `<noun>.dto.ts` → export `createPostSchema`, `updatePostSchema`
- Server Action file: `<noun>.actions.ts`
- Route segment ของ App Router: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`
- Private folder ที่ไม่กลายเป็น route: ขึ้นต้น `_` (เช่น `_components/`); route group ที่ไม่เป็น URL: วงเล็บ `(public)`

## Layering & Imports (ทิศทาง dependency ชี้เข้าด้านในเท่านั้น)
| ชั้น | import จากชั้นไหนได้ |
|------|----------------------|
| `domain/` | (ไม่มี — pure TS) |
| `application/` | domain, shared |
| `infrastructure/` | application, domain, shared |
| `presentation/` | application, domain, shared, di container |
| `app/` | presentation, di container |

- ❌ `domain/` ห้าม import React/Next/Drizzle/NextAuth/zod runtime
- ❌ `application/` ห้าม import `infrastructure/` — depend บน **port** ที่ตัวเองนิยาม
- ❌ `presentation/` / `app/` ห้ามเรียก `db` (Drizzle) ตรง — ผ่าน use case เท่านั้น
- ใช้ alias `@/*` เสมอ — ห้าม relative import ลึกเกิน 2 ระดับ (`../../../`)

## Mutations: Server Actions ก่อน (ไม่ใช่ API route)
- งานเขียน/แก้/ลบ ใช้ **Server Action** ใน `presentation/actions/*.actions.ts` (`"use server"`) เป็นหลัก
- Server Action ต้อง **บาง** — เช็ก session → validate zod → เรียก use case → `revalidatePath()` ที่เกี่ยว แล้วจบ
- **Route handler (`app/api/.../route.ts`) ใช้เฉพาะเมื่อจำเป็น**: NextAuth (`api/auth/[...nextauth]/route.ts`), webhook, public API, upload streaming
- ห้ามใส่ business logic / Drizzle query / role check ใน action หรือ route handler — ผ่าน use case

## Server-side vs Client-side
- เริ่มจาก **Server Component เสมอ** — เพิ่ม `"use client"` เฉพาะ leaf ที่ต้อง hook/state/event (เช่น `TiptapEditor`, ฟอร์ม)
- ห้าม mark layout ระดับสูงเป็น client (ทำให้ tree ทั้งหมดกลายเป็น client)

## เพิ่มไฟล์ใหม่
- หลีกเลี่ยงการสร้างไฟล์ใหม่ถ้าแก้ของเดิมได้; ก่อนสร้างใน `shared/`/`infrastructure/` ให้ Grep หาของเดิมก่อน
- ห้ามสร้าง `*.md` / `README` ใหม่ถ้าผู้ใช้ไม่ขอ
