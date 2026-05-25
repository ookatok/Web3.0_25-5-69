---
name: rule-ui-library
description: ใช้ shadcn/ui + Radix เป็น component system, Tiptap สำหรับ rich text, lucide ไอคอน
---

# 6. UI Library — shadcn/ui + Radix

โปรเจกต์นี้เป็น greenfield — **เลือก shadcn/ui ตั้งแต่ต้น ไม่มี legacy MUI**

## หลักการสำคัญ
- **shadcn/ui = primary component library** (https://ui.shadcn.com/docs/components) build บน Radix + Tailwind
- **ห้ามเขียน UI primitive (Button/Input/Dialog/Select/Sheet/Toast/...) เองจาก `<div>` + Tailwind** ถ้า shadcn มีให้แล้ว
- **Rich text = Tiptap** (ข้อยกเว้นเดียวที่ไม่ใช่ shadcn) — ห่อเป็น client component ใน `presentation/components/blog/`
- **ไอคอน = `lucide-react`** named import ทีละตัว
- ห้ามเพิ่ม component library อื่น (MUI, Ant, Chakra, Mantine) — ถ้าคิดว่าจำเป็น ต้องปรึกษาก่อน

## ขั้นตอนก่อนเขียน UI ใด ๆ
1. เปิด https://ui.shadcn.com/docs/components ตรวจว่ามี component ที่ต้องการไหม
2. ถ้ามี → แจ้งคำสั่ง `npx shadcn@latest add <component>` (generate ลง `src/presentation/components/ui/`) ให้ผู้ใช้ยืนยัน
3. ใช้ตาม API ใน docs ตรง ๆ — อย่าเขียน wrapper ที่ไม่เพิ่มคุณค่า
4. ถ้าไม่มีจริง ๆ → สร้าง custom โดยอิง Radix primitive + Tailwind ตามแบบ shadcn

## Forms
- ฟอร์มทุกตัวใช้ **`react-hook-form` + `zod` + shadcn `Form`** (มี integration พร้อม)
- reuse zod schema จาก `application/dto` (ตัวเดียวกับที่ Server Action ใช้ validate)

## Component ที่น่าจะใช้บ่อยในโปรเจกต์นี้
| งาน | shadcn |
|---|---|
| ฟอร์ม blog/portfolio | `Form` + `Input` + `Textarea` + `Select` + `Label` |
| ตารางหลังบ้าน | `Table` + `@tanstack/react-table` (data-table block) |
| ยืนยันลบ | `AlertDialog` |
| สร้าง/แก้ใน modal | `Dialog` หรือ `Sheet` |
| toast แจ้งผล | `Sonner` |
| สถานะ draft/published | `Badge` |
| nav หลังบ้าน | `Sidebar` / `NavigationMenu` |
| โหลด | `Skeleton` |

## Charts (ถ้าจำเป็น เช่น dashboard นับจำนวน)
- ใช้ **shadcn charts** (https://ui.shadcn.com/charts, ห่อ recharts) — เลือก lib เดียวต่อโปรเจกต์ ห้ามผสมหลาย chart lib
- dataset ใหญ่ต้อง aggregate ก่อนป้อน

## Styling
- Tailwind v4 utility-first; ใช้ `cn()` helper (`shared/utils/cn.ts`) merge class แบบมี condition
- สีอ้างอิง CSS variable ของ shadcn เท่านั้น (ดู [08-colors.md](08-colors.md)) — ห้าม hardcode hex
- Dark mode (ถ้าเปิด) ผ่าน `next-themes` ตาม pattern shadcn

## ห้าม
- ❌ เขียน custom `Button`/`Input`/`Modal` เองถ้า shadcn มี
- ❌ wrapper บางเฉียบที่แค่ rename prop ของ shadcn
- ❌ ผสม chart library หลายตัว
- ❌ ใส่สี hardcode ใน component (ดู rule 8)
