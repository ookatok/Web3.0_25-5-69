---
name: rules-index
description: ดัชนีกฏของโปรเจกต์ web3.0 — Claude ต้องอ่านและปฏิบัติตามทุกข้อก่อนแก้ไขโค้ด
---

# Project Rules — web3.0

เว็บธุรกิจบริการ + ระบบ Auth (admin), Blog, Portfolio
Stack: **Next.js 16 (App Router, React 19) · TypeScript · Drizzle ORM + MariaDB · NextAuth (Auth.js v5) · bcrypt · Tiptap · shadcn/ui + Radix · Tailwind v4 · Zod · Server Actions**

กฏเหล่านี้อ้างอิงหลัก Claude Code Best Practices (https://code.claude.com/docs/en/best-practices)
และต้องถูกบังคับใช้ทุกครั้งที่แก้ไขโค้ดในโปรเจกต์นี้

| # | หัวข้อ | ไฟล์ |
|---|---|---|
| 1 | Security | [01-security.md](01-security.md) |
| 2 | โครงสร้างไฟล์และโฟลเดอร์ | [02-structure.md](02-structure.md) |
| 3 | Clean Code | [03-clean-code.md](03-clean-code.md) |
| 4 | Browser Runtime Performance | [04-performance.md](04-performance.md) |
| 5 | Load Speed | [05-load-speed.md](05-load-speed.md) |
| 6 | UI Library (shadcn/ui + Radix) | [06-ui-library.md](06-ui-library.md) |
| 7 | Clean & Reusable Code | [07-reusability.md](07-reusability.md) |
| 8 | Color Palette (CSS variables only) | [08-colors.md](08-colors.md) |
| 9 | Clean Architecture (4-layer + ports) | [09-clean-architecture.md](09-clean-architecture.md) |
| 10 | Feature Change Protocol (BE + FE, no dead code) | [10-feature-change-protocol.md](10-feature-change-protocol.md) |

## หลักการใช้งาน
- ก่อนเขียนโค้ดใหม่ ตรวจสอบกฏที่เกี่ยวข้องก่อนเสมอ
- ถ้ากฏขัดกับคำขอของผู้ใช้ ให้แจ้งและขอคำยืนยันก่อนละเมิด ห้ามเงียบ ๆ ข้ามกฏ
- เมื่อพบโค้ดเก่าที่ละเมิดกฏ ไม่ต้อง refactor ทั้งหมด แต่ห้ามเพิ่มของใหม่ที่ละเมิด
- โครงสร้างชั้น (layer) อ้างอิง [../../ARCHITECTURE.md](../../ARCHITECTURE.md) เป็นหลัก — กฏ 09 ต้องสอดคล้องกับไฟล์นั้นเสมอ
