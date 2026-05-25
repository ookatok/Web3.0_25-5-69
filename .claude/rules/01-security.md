---
name: rule-security
description: กฏความปลอดภัย — auth/authz, Zod validation, file upload, secrets, Tiptap XSS, CSP
---

# 1. Security Rules

## Authentication & Authorization (NextAuth v5 / Auth.js, admin-only)
- ระบบนี้มี role เดียวคือ **ADMIN** — login ผ่าน Credentials (อีเมล + รหัสผ่าน) + JWT session
- **NextAuth v5 split config (บังคับ)**:
  - `auth.config.ts` ต้อง **edge-safe** — ห้าม import bcrypt, Drizzle, หรือ Node API ใด ๆ (ใช้ใน `proxy.ts`)
  - `auth.ts` คือที่เดียวที่เรียก bcrypt + Drizzle (รันบน Node runtime เท่านั้น)
- **กันหน้า `/admin/*`** ที่ 2 ชั้น และต้อง sync กันเสมอ:
  1. **Edge** — `src/proxy.ts` (Next.js 16 convention; เดิมชื่อ `middleware.ts`) เช็ก JWT ทุก request ที่ขึ้นต้น `/admin` ยกเว้น `/admin/login` → ไม่มี session เด้งไป login
  2. **Server Action / Server Component** — ต้องเรียก helper เช่น `requireAdmin()` (จาก `@/infrastructure/auth` หรือ `@/shared/auth`) ก่อนทำงานทุกครั้ง
- **ห้ามเขียน session/role check แบบ ad-hoc** กระจายในแต่ละ action — รวมไว้ที่ helper เดียว
- **ไม่มีหน้าสมัครสมาชิกสาธารณะ** — admin คนแรกสร้างผ่าน seed script (`infrastructure/db/seed.ts`) เท่านั้น

## Input Validation (Server Actions = trust boundary)
- **ทุก Server Action ต้อง (1) เช็ก session ก่อน แล้ว (2) parse input ด้วย Zod ก่อนเรียก use case** — ไม่มีข้อยกเว้น
- Zod schema นิยามที่ `application/dto/` แล้ว reuse ทั้งฝั่งฟอร์ม (react-hook-form) และฝั่ง action
- ห้าม trust ค่าใด ๆ จาก client (id, slug, role, ownerId) — validate และ/หรือดึงจาก session เสมอ
- Query/route param ก็ต้อง validate (เช่น `z.coerce.number()` สำหรับ id)
- Server Actions ของ Next มี CSRF protection ในตัว แต่ยังต้อง validate input เองทุกครั้ง

## File Upload (รูป Portfolio / Blog cover)
- ใช้ chokepoint เดียว เช่น `validateUploadFile` / `validateUploadBuffer` ใน `infrastructure/services/upload-service.ts`
- เช็ก **extension + MIME + ขนาด (เช่น ≤ 5MB) + magic byte signature** — **ห้ามเชื่อ MIME จาก client**
- sanitize ชื่อไฟล์ด้วย timestamp suffix, ห้าม concat path จาก user input (ใช้ `path.basename()` / allowlist)
- ถ้าเก็บใน local เขียนใต้ `public/uploads/...` เท่านั้น; ถ้าใช้ external (Cloudinary/UploadThing) ต้องเพิ่ม host ใน `images.remotePatterns` + CSP `img-src`

## Tiptap / Rich-text XSS (สำคัญสำหรับ Blog)
- Tiptap เก็บเนื้อหาเป็น **HTML** — เนื้อหานี้ถือว่า "ไม่ปลอดภัย" แม้มาจาก admin
- ก่อน render ด้วย `dangerouslySetInnerHTML` ต้อง **sanitize** ก่อนเสมอ (เช่น `sanitize-html` / DOMPurify) ด้วย allowlist ของ tag/attribute
- ดีกว่า: sanitize ตอน **save** (เขียนลง DB เป็น HTML ที่สะอาดแล้ว) และ sanitize ซ้ำตอน render อีกชั้น
- ห้าม allow `<script>`, inline event handler (`onerror`, `onclick`), `javascript:` URL

## Secrets & Env
- ห้าม commit `.env`, `.env.production`, key, token
- ห้าม log `AUTH_SECRET`, `DATABASE_URL`, JWT, password, session token
- validate env ทั้งหมดด้วย Zod ที่ `shared/config/env.ts` — fail fast ตอน boot ถ้าตัวแปรหาย
- Client-side ใช้ได้เฉพาะ env ที่ขึ้นต้น `NEXT_PUBLIC_`
- **bcrypt เป็น server-only** — ห้าม import เข้า client component หรือ edge (`proxy.ts` / `auth.config.ts`)

## Database (Drizzle + MariaDB)
- ใช้ Drizzle query API / prepared statement เป็นหลัก — parameterized โดยอัตโนมัติ
- ถ้าจำเป็นต้อง raw ให้ใช้ tagged template `sql\`...\`` ที่ bind ค่า — **ห้าม** ต่อ string จาก user input เข้า SQL ตรง ๆ
- เข้าถึง DB เฉพาะใน `infrastructure/` (repository) — `domain/`, `application/`, `presentation/` ห้ามแตะ `db` ตรง

## OWASP Top 10 (ย่อ)
- **XSS**: ดูหัวข้อ Tiptap ด้านบน + ห้าม `dangerouslySetInnerHTML` กับ data ที่ไม่ sanitize
- **SQL Injection**: Drizzle query API / `sql\`\`` เท่านั้น
- **SSRF**: ห้าม fetch URL ที่มาจาก user input โดยไม่ allowlist host
- **CSRF**: ใช้ Server Actions (มี protection) หรือ method POST/PUT/PATCH/DELETE; cookie session เป็น `SameSite=Lax`
- **Path Traversal**: ห้าม concat path จาก user input — `path.basename()` หรือ allowlist
- **Broken Access Control**: ทุก action/route ที่เปลี่ยนสถานะต้องผ่าน `requireAdmin()`

## CSP & Headers
- `next.config.ts` ตั้ง CSP, HSTS, X-Frame-Options=SAMEORIGIN, `poweredByHeader: false` — ห้ามผ่อนปรนโดยไม่ปรึกษา
- การเพิ่ม external image/script host ต้องอัปเดตทั้ง `images.remotePatterns` และ CSP directive ที่เกี่ยว

## Logging & Error
- Error response จาก action/route ใช้รูปแบบ `{ error: "..." }` (ข้อความที่ปลอดภัยต่อ user)
- ห้าม leak stack trace / internal path ไป client ใน production
- ห้าม log PII (email, phone จากฟอร์มติดต่อ) แบบเต็ม — mask หรือใช้ id
