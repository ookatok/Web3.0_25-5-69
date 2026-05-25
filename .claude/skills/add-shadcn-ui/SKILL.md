---
name: add-shadcn-ui
description: เพิ่ม/ใช้งาน UI component ในโปรเจกต์ web3.0 ให้ถูกกฏ — shadcn/ui + Radix เท่านั้น และใช้สีผ่าน CSS variable token เท่านั้น. ใช้ skill นี้ทุกครั้งที่ผู้ใช้ขอ "ทำปุ่ม/ฟอร์ม/dialog/ตาราง/การ์ด/เมนู/toast", "เพิ่ม component", "ทำ UI/หน้าจอ", หรือจะแตะ styling/สี. ห้ามเขียน UI primitive เอง ถ้า shadcn มีให้แล้ว และห้าม hardcode hex / Tailwind default palette
---

# Add shadcn/ui Component (UI + สี ให้ถูกกฏ)

โปรเจกต์นี้เป็น greenfield ที่เลือก **shadcn/ui + Radix** ตั้งแต่ต้น (ไม่มี MUI/Ant/Chakra)
ทุก UI primitive มาจาก shadcn; ไอคอน = `lucide-react`; rich text = Tiptap (ข้อยกเว้นเดียว)

> อ้างอิง: [rule 06](../../rules/06-ui-library.md) (UI library), [rule 08](../../rules/08-colors.md) (สี = CSS variable), [rule 04](../../rules/04-performance.md) (Server/Client)
> แผนที่ component + token อ่านเร็วได้ที่ [references/component-map.md](references/component-map.md)

## ขั้นตอนก่อนเขียน UI ใด ๆ
1. เปิด https://ui.shadcn.com/docs/components ตรวจว่ามี component ที่ต้องการไหม
2. ถ้ามี → **แจ้งคำสั่งให้ผู้ใช้ยืนยัน/รัน** (generate ลง `src/presentation/components/ui/`):
   ```
   npx shadcn@latest add <component>
   ```
   (อย่าเขียน primitive เลียนแบบเอง — ใช้ของ shadcn)
3. ใช้ตาม API ใน docs ตรง ๆ — อย่าเขียน wrapper บางเฉียบที่แค่ rename prop (rule 07)
4. ถ้า shadcn ไม่มีจริง ๆ → สร้าง custom โดยอิง Radix primitive + Tailwind ตามสไตล์ shadcn

## สี — CSS variable token เท่านั้น (rule 08)
`src/app/globals.css` คือ single source of truth ของสี (ชุด token ของ shadcn)
- ✅ ใช้ utility ที่ผูก token: `bg-primary text-primary-foreground`, `border-border bg-card`, `text-muted-foreground`
- ✅ opacity modifier: `bg-primary/90`
- ✅ semantic: ปุ่มลบ = `bg-destructive`, focus ring = `ring`
- ❌ Tailwind default palette: `bg-red-500`, `text-blue-600`
- ❌ arbitrary hex: `bg-[#31fb4c]`, `text-[#222]`, `style={{ color: '#2f2f2f' }}`
- ต้องการ token ใหม่ (เช่น `--success`/`--warning`) → **คุยกับผู้ใช้ก่อน** แล้วเพิ่มทั้ง light + dark ใน `globals.css`

## Forms (มาตรฐานโปรเจกต์)
ฟอร์มทุกตัว = **`react-hook-form` + `zod` + shadcn `Form`**
- reuse zod schema จาก `application/dto` (ตัวเดียวกับที่ Server Action ใช้ validate — rule 07)
- submit → เรียก Server Action จาก `presentation/actions` (ใช้ skill **server-action**)

## Server vs Client (rule 04)
- เริ่มจาก **Server Component** เสมอ; ใส่ `"use client"` เฉพาะ leaf ที่ต้อง hook/state/event (ฟอร์ม, TiptapEditor)
- อย่า mark layout ระดับสูงเป็น client
- component หนัก (Tiptap, modal, chart) → `dynamic(() => import(...))` ตามเหมาะสม

## ที่วางไฟล์
- UI primitive (shadcn generate) → `src/presentation/components/ui/`
- composed component ตาม feature → `src/presentation/components/<feature>/` (เช่น `blog/PostCard.tsx`)
- ใช้ `cn()` จาก `src/shared/utils/cn.ts` merge class แบบมีเงื่อนไข

## ไอคอน & Charts
- ไอคอน: `lucide-react` **named import ทีละตัว** (`import { Camera } from "lucide-react"`) — ห้าม import ทั้งชุด (rule 05)
- chart (ถ้าจำเป็น): **shadcn charts** (ห่อ recharts) ตัวเดียวต่อโปรเจกต์ — ห้ามผสมหลาย chart lib

## ห้าม
- ❌ เขียน `Button`/`Input`/`Dialog`/`Select`/`Sheet`/`Toast` เองถ้า shadcn มี
- ❌ เพิ่ม UI library อื่น (MUI/Ant/Chakra/Mantine) — ถ้าคิดว่าจำเป็นต้องปรึกษาก่อน
- ❌ hardcode สี / arbitrary hex / Tailwind default palette
- ❌ wrapper บางเฉียบที่แค่ rename prop ของ shadcn

## Checklist
- [ ] ตรวจ shadcn docs แล้วว่ามี component นี้ไหม
- [ ] ถ้ามี → แจ้ง `npx shadcn@latest add <component>` ให้ผู้ใช้ (ไม่เขียนเลียนแบบเอง)
- [ ] สีทุกจุดใช้ token (ไม่มี hex / default palette / arbitrary)
- [ ] ฟอร์มใช้ rhf + zod + shadcn Form, reuse dto
- [ ] Server Component เป็น default; `"use client"` เฉพาะ leaf
- [ ] ไอคอน lucide named import; ไม่ผสม chart lib
