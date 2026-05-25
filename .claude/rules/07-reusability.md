---
name: rule-reusability
description: กฏการเขียนโค้ดให้ clean และ reusable — DRY, composition, abstraction ที่พอดี
---

# 7. Clean & Reusable Code

เป้าหมาย: เขียนครั้งเดียว ใช้ได้หลายที่ โดยไม่ over-engineer

## Rule of Three
- ซ้ำ **ครั้งที่ 1** → ปล่อยไว้
- ซ้ำ **ครั้งที่ 2** → จับตา
- ซ้ำ **ครั้งที่ 3** → extract เป็น function/hook/component/use case
- ห้าม extract ตั้งแต่ครั้งแรกเพราะเดาว่า "เดี๋ยวจะใช้อีก"

## ก่อน extract ใหม่ — ค้นของเดิมก่อน (Grep)
ลำดับการค้นตามชั้น:
1. `shared/utils/`, `shared/config/` — pure helper, env, result type
2. `application/use-cases/` — มี use case ที่ทำงานนี้อยู่แล้วไหม
3. `application/ports/` + `application/dto/` — interface/schema เดิม
4. `infrastructure/repositories/`, `infrastructure/services/` — adapter เดิม
5. `presentation/components/` (+ `ui/`) และ `presentation/hooks/` — UI/hook เดิม
6. `domain/` — entity/value object เดิม

ใช้ Grep หา keyword/ชื่อใกล้เคียงก่อนเขียนใหม่ ห้าม duplicate

## Helper / Function ที่ reusable ดี
- **Pure**: input เดิม → output เดิม ไม่มี side effect, ไม่อ่าน `Date.now()`/`Math.random()` ภายใน (รับเป็น argument)
- ทำหน้าที่เดียว — `formatDate(date, locale)` ดีกว่า `formatAndRenderDate(date)`
- ไม่ผูก framework: ของใน `shared/` ห้าม import React/Next/Drizzle
- Argument > 3 ตัว หรือ boolean flag หลายตัว → รวมเป็น object พร้อม type
- ระบุ return type explicit สำหรับ public function

## Custom Hook
- `useXxx` ทำหน้าที่เดียว, generic พอที่ไม่ผูกกับหน้าใดหน้าหนึ่ง
- Return object ที่ตั้งชื่อ field ชัด (`{ data, isLoading }`) ดีกว่า tuple ถ้า field > 2
- ห้าม side-effect ตอน mount โดยไม่จำเป็น (navigate/toast) — ให้ผู้เรียกตัดสินใจ

## Component
- **Composition > Configuration**: รับ `children`/slot แทน boolean prop เป็นโขยง
  ```tsx
  // ❌ over-configured
  <Card title="..." showHeader hasFooter footerActions={[...]} />
  // ✅ composable
  <Card><CardHeader>...</CardHeader><CardContent>...</CardContent></Card>
  ```
- Style ปรับได้ผ่าน `className` + `cn()` — ห้าม hardcode margin ที่ override ไม่ได้
- **อย่ายัด business logic ใน UI** — UI รับ data + callback; logic อยู่ใน use case/hook
- UI primitive อยู่ `components/ui/` (shadcn), composed component อยู่ `components/<feature>/`

## เลี่ยง Bad Abstraction
- ห้าม wrap library โดยไม่เพิ่มคุณค่า (`myButton = props => <Button {...props}/>`)
- ห้าม "god util" รวมฟังก์ชันไม่เกี่ยว 30 ตัว — แยกตามโดเมน (`date.ts`, `slug.ts`, `format.ts`)
- ห้าม config object ที่ branch logic เยอะ (`doStuff({mode:'A'|'B'|'C'})` ที่แต่ละ mode คนละเรื่อง = แยกฟังก์ชัน)
- ถ้า abstraction ทำให้ caller ต้องอ่าน implementation เพื่อใช้ = แย่ ลบทิ้งดีกว่า

## DRY แบบมีสติ
- DRY = single source of truth ของ business rule ไม่ใช่ "ไม่มีบรรทัดซ้ำ"
- โค้ดหน้าตาคล้ายแต่เปลี่ยนด้วยเหตุผลคนละอย่าง → ไม่ต้อง DRY
- ควร DRY: zod schema (dto), auth check, slug/date/currency format, error shape
- ไม่ควรรีบ DRY: layout JSX ที่จะ diverge ตาม feature

## Reusable Pattern เฉพาะโปรเจกต์นี้
- **Auth check** → `requireAdmin()` ตัวเดียว (ดู rule 1) ห้าม inline เช็ก session
- **Zod schema** → นิยามที่ `application/dto` ใช้ซ้ำทั้งฟอร์มและ Server Action
- **DB access** → ผ่าน port + Drizzle repository เท่านั้น (ดู rule 9) ห้ามเรียก `db` กระจาย
- **Upload** → `validateUploadFile`/`validateUploadBuffer` ทางเดียว
- **DI** → ดึง use case จาก `infrastructure/di/container.ts` ที่เดียว

## ห้ามทำ
- ❌ เขียน helper/component ใหม่โดยไม่ค้นของเดิม
- ❌ abstraction "เผื่ออนาคต" ที่มี caller เดียว
- ❌ wrapper บางเฉียบที่แค่ rename prop
- ❌ copy-paste โค้ด > 5 บรรทัดเป็นครั้งที่สาม
- ❌ ผูก util ใน `shared/` กับ React/Next/Drizzle
