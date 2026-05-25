---
name: rule-feature-change-protocol
description: Protocol บังคับทุกครั้งที่แก้/เพิ่ม feature — Map -> Plan -> Implement -> Sweep dead code -> Verify
---

# 10. Feature Change Protocol (BE + FE)

ทุกครั้งที่ **แก้** หรือ **เพิ่ม feature** ที่กระทบ ≥ 2 ชั้น ต้องเดินตาม protocol นี้
เป้าหมาย: เข้าใจ slice ทั้งเส้นก่อน แล้วแก้แบบ surgical ไม่ทิ้ง dead code (ทั้ง BE + FE)

> ใช้คู่กับ [09-clean-architecture.md](09-clean-architecture.md) (โครงสร้าง) และ [07-reusability.md](07-reusability.md) (Rule of Three)
> ข้ามได้เฉพาะ: bug fix 1–2 บรรทัด, เปลี่ยนสี/typo

## หลักการ
1. **อ่านก่อนเขียน** — ห้ามเดาโครงสร้าง ห้าม assume pattern โดยไม่เปิดไฟล์
2. **เข้าใจ slice ทั้งเส้น** — 1 feature = domain → application(port/dto/use-case) → infrastructure(repo) → presentation(action/component/hook) → app(route/page)
3. **แก้แบบ surgical** — แตะเฉพาะที่เกี่ยว ห้าม refactor นอก scope โดยไม่บอก
4. **ลบของตายทันที** — ทุก mod/add ต้องตามด้วยการกวาด dead code

## Phase 0 — Map the slice (ก่อนแตะโค้ด)
ตอบให้ครบ (ใช้ Glob/Grep/Read หรือ Agent `Explore`):

**Backend**
- [ ] domain entity/value object ที่เกี่ยว: ไฟล์ไหน?
- [ ] port + use case ที่เกี่ยว: ชื่ออะไร รับ input อะไร return อะไร?
- [ ] zod dto: มีอยู่แล้วไหม? — ถ้ามี **reuse** ห้ามสร้างทับ
- [ ] Drizzle schema + repository: column/field ไหนถูกอ่าน/เขียน?
- [ ] entry point: Server Action ตัวไหน (หรือ route handler ตัวไหน)? ใช้ `requireAdmin()` แล้วหรือยัง?

**Frontend**
- [ ] presentation component/hook ที่เกี่ยว: ไฟล์ไหน, Server หรือ Client?
- [ ] route page ที่ render: `app/(public)/...` หรือ `app/(admin)/admin/...`?
- [ ] หลัง mutation ต้อง `revalidatePath`/`revalidateTag` หน้าไหน?

**ห้ามข้าม phase 0**: ห้ามเขียนโค้ดทั้งที่ตอบ "ไม่รู้", ห้าม assume ว่ามี hook/use case อยู่แล้วโดยไม่ Grep, ห้ามสร้างไฟล์ใหม่โดยไม่ตรวจของเดิม

## Phase 1 — Plan
- [ ] กระทบชั้นไหนบ้าง? (domain/application/infrastructure/presentation)
- [ ] ใช้ pattern เต็มหรือ shortcut (ดูข้อยกเว้น rule 9)?
- [ ] extend use case/port เดิมได้ หรือต้องตัวใหม่?
- [ ] zod dto เปลี่ยน → กระทบ caller ไหน (Grep ก่อน)?
- [ ] component ใหม่เป็น Server หรือ Client?
- **ห้าม over-engineer** — feature เล็ก/read-only ใช้ shortcut ได้

## Phase 2 — Implement
- ทำตาม dependency rule ของ rule 9 เคร่งครัด
- ใช้ auth helper / zod dto / UI token / DI container เดิม (rules 1, 6, 8, 9)
- Server Action บาง: `requireAdmin → zod.parse → use case → revalidate`
- เขียน zod schema สำหรับ boundary ใหม่ทุกตัว

## Phase 3 — Sweep dead code (บังคับทุกครั้ง)
หลังแก้เสร็จ **ต้อง** กวาด dead code ของ slice ที่แตะก่อน mark task เสร็จ

**Backend**
- [ ] use case ที่ไม่มี caller (Grep ทั้ง repo ก่อนลบ) → ลบ
- [ ] port method ที่ไม่มี use case เรียก → ลบทั้ง interface + ทุก adapter ที่ implement
- [ ] repository method / adapter ที่ตายตาม port → ลบ
- [ ] route handler ที่ไม่มี caller (Grep path) → ลบทั้ง folder
- [ ] zod dto / domain type ที่ไม่ถูก import → ลบ
- [ ] Drizzle column ที่ไม่มีใครอ้างถึงแล้ว → **แจ้งผู้ใช้** ให้แก้ schema (ห้ามรัน drizzle-kit เอง ดู CLAUDE.md)
- [ ] unused import → ลบทุกตัวที่ ESLint เตือน

**Frontend**
- [ ] hook/component ที่ Grep แล้วไม่มีใครใช้ → ลบทั้งไฟล์
- [ ] Server Action ที่ไม่มี caller → ลบ
- [ ] route page ที่ไม่มี link/navigate ชี้มา → คุยกับผู้ใช้ก่อนลบ (อาจเป็น direct URL/SEO)
- [ ] asset ใน `public/uploads/` ที่ไม่มี caller → คุยกับผู้ใช้ก่อนลบ (อาจเป็นไฟล์จริงของลูกค้า)
- [ ] dead branch / commented-out code → ลบทันที (ใช้ git log)

**ตัวช่วย**: Grep ชื่อทั้ง repo (จำกัด `src/`), `npm run build` (unused import), `npm run lint`, Agent `Explore` ("ใครเรียก X บ้าง")

**ห้าม**: ทิ้งของไม่มี caller "เผื่ออนาคต", ใส่ `_` prefix / `eslint-disable` เพื่อ silence unused, ลบไฟล์ที่ไม่แน่ใจโดยไม่ Grep+ถาม, ลบ asset โดยไม่ถาม

## Phase 4 — Verify
- [ ] `npm run build` — type check + build ผ่าน
- [ ] `npm run lint` — ผ่าน
- [ ] UI change → `npm run dev` ทดสอบ golden path + edge case ใน browser
- [ ] DB schema เปลี่ยน → **แจ้งคำสั่ง drizzle-kit ให้ผู้ใช้รันเอง** (ห้ามรันเอง)
- [ ] End-of-turn summary: 1–2 ประโยค บอกว่าเปลี่ยนอะไร + กวาด dead code อะไรไป

## Anti-pattern (เห็นแล้วต้องหยุด)
- ❌ เพิ่ม feature โดยไม่อ่าน slice เดิม
- ❌ เพิ่ม use case ใหม่ทั้งที่ของเดิมรับ argument เพิ่มได้
- ❌ ลบ caller สุดท้ายแล้วไม่ตามไปลบ use case/hook/port
- ❌ เพิ่ม Drizzle column แต่ไม่ใช้ใน application ใด ๆ (ตายตั้งแต่ commit)
