# Component Map + Color Tokens — อ้างอิงเร็ว

> สรุปจาก [rule 06](../../../rules/06-ui-library.md) และ [rule 08](../../../rules/08-colors.md)

## งานที่พบบ่อยในโปรเจกต์นี้ → ใช้ shadcn ตัวไหน
| งาน | shadcn component | คำสั่ง add |
|-----|------------------|-----------|
| ฟอร์ม blog/portfolio | `Form` + `Input` + `Textarea` + `Select` + `Label` | `npx shadcn@latest add form input textarea select label` |
| ตารางหลังบ้าน | `Table` + `@tanstack/react-table` (data-table block) | `npx shadcn@latest add table` |
| ยืนยันลบ | `AlertDialog` | `npx shadcn@latest add alert-dialog` |
| สร้าง/แก้ใน modal | `Dialog` หรือ `Sheet` | `npx shadcn@latest add dialog sheet` |
| toast แจ้งผล | `Sonner` | `npx shadcn@latest add sonner` |
| สถานะ draft/published | `Badge` | `npx shadcn@latest add badge` |
| nav หลังบ้าน | `Sidebar` / `NavigationMenu` | `npx shadcn@latest add sidebar navigation-menu` |
| โหลด (skeleton) | `Skeleton` | `npx shadcn@latest add skeleton` |
| FAQ | `Accordion` | `npx shadcn@latest add accordion` |

> เสมอ: ตรวจชื่อ component ล่าสุดจาก https://ui.shadcn.com/docs/components ก่อนแจ้งคำสั่ง

## Color tokens (semantic — ใช้ตามความหมาย ไม่ใช่ตามสี)
นิยามใน `src/app/globals.css` ทั้ง `:root` (light) และ `.dark`:
```
--background / --foreground
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive / --destructive-foreground
--border  --input  --ring
--card / --card-foreground
```

## ใช้แบบนี้
```tsx
// ✅ ถูก — utility ผูก token
<button className="bg-primary text-primary-foreground hover:bg-primary/90" />
<div className="border-border bg-card text-card-foreground" />
<span className="text-muted-foreground" />
<button className="bg-destructive text-destructive-foreground" /> {/* ปุ่มลบ */}

// ❌ ผิด — hardcode / default palette / arbitrary
<button className="bg-green-500" />
<button className="bg-[#31fb4c]" />
<div style={{ color: '#2f2f2f' }} />
```

## state color
- ปุ่ม/ข้อความอันตราย (ลบ) → `destructive`
- focus ring → `ring`
- success/warning ถ้ายังไม่มี token → **แจ้งผู้ใช้** เพิ่มใน `globals.css` (light+dark) ก่อน — ห้าม `bg-red-500`/hardcode

## เจอโค้ดเก่าผิดกฏ
เมื่อแตะไฟล์นั้น → เปลี่ยน hardcode เป็น token; ห้ามเพิ่มของใหม่ที่ผิดกฏ
