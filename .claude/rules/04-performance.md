---
name: rule-performance
description: กฏ runtime performance บน browser — render, re-render, memo, list, Tiptap
---

# 4. Browser Runtime Performance

## Rendering
- **Server Component เป็น default** — ย้ายเป็น Client Component เฉพาะส่วนที่ต้อง interactive จริง
- `"use client"` ใส่ที่ leaf ที่เล็กที่สุดที่ใช้ hook/state — อย่ายกขึ้น layout
- หลีกเลี่ยง waterfall: ใน Server Component ดึงข้อมูลที่ไม่ขึ้นต่อกันด้วย `Promise.all`

## Re-render Control
- `React.memo` กับ component ที่ render ถี่และรับ prop เดิมบ่อย (เช่นแถวในตารางหลังบ้าน)
- callback ที่ส่งลง memo child → `useCallback`; object/array literal ที่ส่งลง memo child → `useMemo`
- **อย่าใส่ `useMemo`/`useCallback` พร่ำเพรื่อ** — มี overhead ใช้เมื่อ child memoized หรือเป็น dependency ของ effect

## State Placement
- ยก state ขึ้นเท่าที่จำเป็น — state ใน component เดียวอย่ายกขึ้น global
- Server state ส่วนใหญ่มาจาก Server Component + Server Actions อยู่แล้ว → **ไม่ต้องมี client cache library ก็ได้**
- ถ้าหน้า admin ฝั่ง client ต้อง fetch/มี optimistic UI เยอะ ค่อยพิจารณา **TanStack Query** (เลือกใช้เท่าที่จำเป็น); **เลี่ยง Redux** เว้นแต่มี client-only state ที่ซับซ้อนจริง
- Context ที่ value เปลี่ยนบ่อยทำให้ consumer re-render ทั้งหมด — แยก context ตามความถี่

## List & Table
- ตารางหลังบ้านยาว (>100 rows) ที่ scroll ภายใน → virtualization (`@tanstack/react-virtual` หรือ shadcn data-table)
- ห้าม `.map().filter().sort()` ใน render บน list ใหญ่ — `useMemo` หรือ pre-compute (ดีกว่า: ทำที่ server/DB)
- Key ใช้ stable id

## Tiptap & Heavy Editors
- `TiptapEditor` เป็น client component ที่หนัก → โหลดด้วย `dynamic(() => import(...), { ssr: false })` เฉพาะหน้า admin ที่ใช้
- อย่า mount editor ในหน้า public/list — โหลดเฉพาะหน้า new/edit

## Event Handlers
- Input ที่ trigger query/heavy compute → debounce (~300ms)
- Scroll/resize listener → throttle + `passive: true` และ cleanup ใน `useEffect` return เสมอ

## Images
- ใช้ `next/image` เสมอ (รูป portfolio/blog/cover) — ระบุ `width`/`height` หรือ `fill` + `sizes` ลด CLS
- รูปที่ไม่ critical → lazy (default ของ next/image)

## Fonts
- `next/font` (เช่น `next/font/google`) เพื่อ self-host ลด FOUT — ห้าม `@import url(fonts.googleapis...)` ใน CSS

## Animation
- ใช้ CSS `transform`/`opacity` ไม่ใช่ layout property (top/left/width/height) เพื่อใช้ GPU

## Memory
- subscription/timer/listener ใน effect ต้อง cleanup เสมอ
- ห้ามผูก closure จับ state ใหญ่ค้างใน global

## ห้าม
- ห้าม `setInterval` polling แทน realtime ที่เหมาะกว่าเมื่อใช้ได้
- ห้าม block main thread > 50ms — งานหนักย้าย server (use case) หรือ Web Worker
