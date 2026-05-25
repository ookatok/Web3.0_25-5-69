---
name: server-action
description: scaffold Server Action (mutation) ของโปรเจกต์ web3.0 ให้ถูก pattern และปลอดภัย. ใช้ skill นี้ทุกครั้งที่ผู้ใช้ขอ "สร้าง/แก้ server action", "ทำปุ่มบันทึก/ลบ/แก้ไข", "เชื่อมฟอร์มกับหลังบ้าน", หรือมีงานเขียน/แก้/ลบข้อมูล (create/update/delete). Server Action เป็น trust boundary — ต้อง requireAdmin → zod.parse → use case → revalidatePath เสมอ และต้องบาง (ห้ามมี business logic / Drizzle / role check แบบ inline)
---

# Server Action — Mutation Pattern (บางและปลอดภัย)

ในโปรเจกต์นี้ งานเขียน/แก้/ลบใช้ **Server Action** (ไม่ใช่ API route) เป็นหลัก
Route handler ใช้เฉพาะที่จำเป็น: NextAuth, webhook, upload streaming, public API

> อ้างอิง: [rule 01](../../rules/01-security.md) (trust boundary), [rule 09](../../rules/09-clean-architecture.md) (action บาง), [rule 02](../../rules/02-structure.md) (Server Action ก่อน API route)

## โครง 4 ขั้น (ห้ามขาดข้อไหน)
```
"use server"
1) requireAdmin()              // auth — เช็ก session ก่อนเสมอ (ยกเว้น public action ดูด้านล่าง)
2) schema.parse(input)         // validate ด้วย zod dto (reuse จาก application/dto)
3) container.useCase.execute() // business logic อยู่ใน use case ผ่าน DI container
4) revalidatePath("/...")      // อัปเดตหน้า public + admin ที่เกี่ยว
return { data } | { error }    // error เป็นข้อความที่ปลอดภัยต่อ user
```

## ขั้นตอน
1. action อยู่ที่ `src/presentation/actions/<feature>.actions.ts` ขึ้นต้นไฟล์ด้วย `"use server"`
2. ตั้งชื่อ `verbNounAction` (เช่น `createPostAction`, `deleteProjectAction`)
3. **reuse zod schema** จาก `application/dto` — อย่านิยาม schema ใหม่ในไฟล์ action (rule 07)
4. **reuse use case** จาก `container` — อย่าเขียน Drizzle query หรือ business logic ในไฟล์ action
5. `revalidatePath` ทั้งหน้า public (`/<entities>`, `/<entities>/[slug]`) และหน้า admin (`/admin/<entities>`)
6. คัดลอกแม่แบบจาก `templates/`:
   - admin mutation → [templates/admin-action.ts.tmpl](templates/admin-action.ts.tmpl)
   - public action (เช่น ฟอร์มติดต่อ) → [templates/public-action.ts.tmpl](templates/public-action.ts.tmpl)

## Admin action vs Public action
- **Admin (ส่วนใหญ่)**: ต้อง `requireAdmin()` เป็นบรรทัดแรกเสมอ
- **Public (ข้อยกเว้น เช่น ฟอร์มติดต่อ `createContactAction`)**: **ไม่เรียก** `requireAdmin` แต่ **ต้อง**:
  - zod validate input
  - rate limit (กัน spam)
  - **ไม่ log PII เต็ม** (email/phone) — mask หรือใช้ id (rule 01)

## Error handling
- คืน `{ error: "ข้อความปลอดภัย" }` — **ห้าม** leak stack trace / internal path ไป client (production)
- ถ้า zod `parse` throw ให้ดักแล้วแปลงเป็น `{ error }` (หรือใช้ `safeParse` แล้วเช็ก `success`)
- ห้าม throw string — ใช้ Error / domain error

## ห้าม (เห็นแล้วต้องแก้)
- ❌ business logic / Drizzle query / role check แบบ inline ในไฟล์ action
- ❌ นิยาม zod schema ซ้ำในไฟล์ action (reuse จาก dto)
- ❌ trust ค่าจาก client (id, slug, ownerId) โดยไม่ validate / ไม่ดึงจาก session
- ❌ ลืม `revalidatePath` หลัง mutation
- ❌ ใส่ business logic ใน route handler แทน (mutation ใช้ Server Action)

## Checklist
- [ ] ไฟล์ขึ้นต้น `"use server"` และอยู่ใน `presentation/actions/`
- [ ] บรรทัดแรก `requireAdmin()` (หรือเป็น public action ที่ rate-limit + ไม่ log PII)
- [ ] validate ด้วย zod dto ที่ reuse จาก `application/dto`
- [ ] เรียก use case ผ่าน `container` (ไม่มี logic/Drizzle ในไฟล์)
- [ ] `revalidatePath` หน้า public + admin ที่เกี่ยว
- [ ] error คืนเป็น `{ error }` ไม่ leak internal
