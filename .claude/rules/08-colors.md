---
name: rule-colors
description: ใช้สีจาก CSS variables ของ shadcn ใน globals.css เป็น single source of truth เท่านั้น
---

# 8. Color Palette — CSS variables ใน `globals.css` เท่านั้น

## หลักการ
**`src/app/globals.css`** (ชุด CSS variable ของ shadcn) คือ **single source of truth** ของสีในโปรเจกต์นี้

- ห้าม hardcode hex/rgb/hsl ใน component, page, inline style
- ห้ามใช้ Tailwind default palette (`bg-red-500`, `text-blue-600`, ฯลฯ) — สีไม่ตรง brand
- ห้าม arbitrary value (`bg-[#31fb4c]`, `text-[#222]`)
- ห้าม "สร้างสีใหม่" จากการผสม/ปรับ shade เองในไฟล์อื่น
- อ้างอิงสีผ่าน Tailwind utility ที่ผูกกับ CSS variable เท่านั้น

## โครงสร้าง token (shadcn convention)
นิยามใน `globals.css` ทั้ง light/dark — semantic token ไม่ใช่ชื่อสีดิบ:
```css
:root {
  --background: ...;  --foreground: ...;
  --primary: ...;     --primary-foreground: ...;
  --secondary: ...;   --secondary-foreground: ...;
  --muted: ...;       --muted-foreground: ...;
  --accent: ...;      --accent-foreground: ...;
  --destructive: ...; --destructive-foreground: ...;
  --border: ...; --input: ...; --ring: ...;
  --card: ...; --card-foreground: ...;
}
.dark { /* ค่าชุด dark ทุกตัวข้างบน */ }
```
> ใช้ token ตามความหมาย (semantic) ไม่ใช่ตามสี — ปุ่มอันตรายใช้ `destructive` ไม่ใช่ "แดง"

## วิธีใช้
```tsx
// ✅ utility ที่ผูกกับ token
<button className="bg-primary text-primary-foreground hover:bg-primary/90" />
<div className="border-border bg-card text-card-foreground" />
<span className="text-muted-foreground" />

// ❌ ห้าม
<button className="bg-green-500" />
<button className="bg-[#31fb4c]" />
<div style={{ color: '#2f2f2f' }} />
```

## การเพิ่ม/เปลี่ยนสี brand
- เปลี่ยนค่าที่ **`globals.css` แห่งเดียว** — ห้ามไป hardcode ที่ component
- ต้องการ token ใหม่ที่ยังไม่มี (เช่น `--success`, `--warning`) → **คุยกับผู้ใช้ก่อน** แล้วเพิ่มทั้ง light + dark + map ใน Tailwind config

## State color
- ปุ่ม/ข้อความอันตราย (ลบ) → `destructive`
- focus ring → `ring`
- success/warning ถ้ายังไม่มี token → แจ้งผู้ใช้และเพิ่มใน `globals.css` ก่อน ห้าม `bg-red-500`/hardcode

## ที่ใช้ได้ / ห้ามใช้
- ✅ utility ผูก token: `bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`
- ✅ opacity modifier ของ token: `bg-primary/50`
- ✅ neutral utility ที่ไม่ใช่สี: spacing, layout, typography size
- ❌ default palette / arbitrary hex / inline gradient ที่มี hex hardcode (ใช้ CSS variable ใน gradient)

## เจอโค้ดเก่าผิดกฏ
- เมื่อแตะไฟล์นั้น → เปลี่ยน hardcode เป็น token; ห้ามเพิ่มของใหม่ที่ผิดกฏ
