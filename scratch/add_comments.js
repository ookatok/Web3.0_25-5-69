const fs = require('fs');
const path = require('path');

const fileDescriptions = {
  // Domain Entities
  "src/domain/entities/user.ts": "เอนทิตีผู้ใช้ (User Entity) ในระดับ Domain Layer กำหนดคุณลักษณะหลักของบัญชีผู้ดูแลระบบ (Admin)",
  "src/domain/entities/post.ts": "เอนทิตีบทความ (Post Entity) ในระดับ Domain Layer กำหนดข้อมูลและคุณลักษณะหลักของบทความบล็อก",
  "src/domain/entities/project.ts": "เอนทิตีโครงการผลงาน (Project Entity) ในระดับ Domain Layer กำหนดคุณลักษณะข้อมูลของผลงานของร้าน",
  "src/domain/entities/contact.ts": "เอนทิตีการติดต่อ (Contact Entity) ในระดับ Domain Layer กำหนดคุณลักษณะการส่งข้อความติดต่อและแบบประเมินราคาเสื้อของลูกค้า",

  // Application DTOs
  "src/application/dto/auth.dto.ts": "Data Transfer Object (DTO) สำหรับขั้นตอนการล็อกอินเข้าสู่ระบบ พร้อมใช้ Zod Schema ในการตรวจสอบข้อมูลขาเข้า",
  "src/application/dto/contact.dto.ts": "Data Transfer Object (DTO) สำหรับการส่งข้อความติดต่อและการประมาณราคา พร้อมเงื่อนไขตรวจสอบเบอร์โทรศัพท์ที่ยืดหยุ่นและปลอดภัย",
  "src/application/dto/post.dto.ts": "Data Transfer Object (DTO) สำหรับขั้นตอนการสร้างและอัปเดตบทความบล็อก",
  "src/application/dto/project.dto.ts": "Data Transfer Object (DTO) สำหรับขั้นตอนการสร้างและอัปเดตข้อมูลผลงานโครงการ",

  // Application Ports
  "src/application/ports/user-repository.ts": "อินเตอร์เฟสพอร์ต (Port Interface) สำหรับจัดการข้อมูลผู้ใช้ (User) ในระดับ Application Layer เพื่อให้ Repository นำไปสืบทอด",
  "src/application/ports/post-repository.ts": "อินเตอร์เฟสพอร์ต (Port Interface) สำหรับกระบวนการเข้าถึงฐานข้อมูลบทความบล็อก (Post)",
  "src/application/ports/project-repository.ts": "อินเตอร์เฟสพอร์ต (Port Interface) สำหรับกระบวนการเข้าถึงฐานข้อมูลของผลงานโครงการ (Project)",
  "src/application/ports/contact-repository.ts": "อินเตอร์เฟสพอร์ต (Port Interface) สำหรับกระบวนการบันทึกและแสดงข้อมูลการติดต่อจากลูกค้า (Contact)",
  "src/application/ports/password-hasher.ts": "อินเตอร์เฟสพอร์ต (Port Interface) สำหรับระบบแฮชและเปรียบเทียบรหัสผ่าน (Password Hashing)",

  // Application Use Cases - Auth
  "src/application/use-cases/auth/verify-credentials.ts": "ยูสเคส (Use Case) ตรวจสอบความถูกต้องของบัญชีผู้ใช้เมื่อล็อกอินเข้าสู่ระบบ",
  // Application Use Cases - Blog
  "src/application/use-cases/blog/create-post.ts": "ยูสเคส (Use Case) สำหรับสร้างบทความบล็อกใหม่ในระบบ และตรวจสอบความซ้ำกันของ URL Slug",
  "src/application/use-cases/blog/delete-post.ts": "ยูสเคส (Use Case) สำหรับลบบทความบล็อกออกจากฐานข้อมูลด้วยไอดี",
  "src/application/use-cases/blog/get-post-by-slug.ts": "ยูสเคส (Use Case) สำหรับดึงข้อมูลบล็อกบทความผ่าน Slug และสั่งบันทึกจำนวนครั้งที่เข้าชม (View Count)",
  "src/application/use-cases/blog/list-posts.ts": "ยูสเคส (Use Case) สำหรับดึงรายการบทความบล็อกทั้งหมด รองรับการแบ่งหน้า (Pagination) ค้นหาชื่อบทความ และการกรองสถานะ",
  "src/application/use-cases/blog/update-post.ts": "ยูสเคส (Use Case) สำหรับอัปเดตแก้ไขข้อมูลรายละเอียดต่างๆ ของบทความบล็อกที่มีอยู่แล้ว",
  // Application Use Cases - Contact
  "src/application/use-cases/contact/create-contact.ts": "ยูสเคส (Use Case) บันทึกข้อมูลการติดต่อประเมินราคาเสื้อของลูกค้าลงในระบบฐานข้อมูล",
  "src/application/use-cases/contact/list-contacts.ts": "ยูสเคส (Use Case) ดึงข้อความติดต่อทั้งหมดเรียงลำดับตามวันที่สร้างล่าสุดสำหรับแอดมิน",
  // Application Use Cases - Portfolio
  "src/application/use-cases/portfolio/create-project.ts": "ยูสเคส (Use Case) สำหรับเพิ่มบันทึกผลงานโครงการใหม่เข้าสู่ระบบฐานข้อมูล",
  "src/application/use-cases/portfolio/delete-project.ts": "ยูสเคส (Use Case) สำหรับลบข้อมูลโครงการผลงานออกจากระบบด้วยไอดี",
  "src/application/use-cases/portfolio/get-project-by-slug.ts": "ยูสเคส (Use Case) ดึงรายละเอียดของผลงานโครงการใดโครงการหนึ่งผ่าน URL Slug",
  "src/application/use-cases/portfolio/list-projects.ts": "ยูสเคส (Use Case) แสดงรายการผลงานโครงการทั้งหมด สามารถกรองแยกประเภทหมวดหมู่ได้",
  "src/application/use-cases/portfolio/update-project.ts": "ยูสเคส (Use Case) อัปเดตรายละเอียดของโครงการผลงานที่มีอยู่ในฐานข้อมูล",

  // Infrastructure DB & Schemas
  "src/infrastructure/db/client.ts": "ไฟล์กำหนดค่าการเชื่อมต่อ MySQL Database Client ผ่าน Drizzle ORM และจัดการ Connection Pool",
  "src/infrastructure/db/seed.ts": "สคริปต์สำหรับการ Seed ข้อมูลแอดมินเริ่มต้นลงในฐานข้อมูล และเข้ารหัสผ่านด้วย bcrypt",
  "src/infrastructure/db/schema/index.ts": "ไฟล์รวบรวมและส่งออก (Export) ตาราง Schema ทั้งหมดของระบบฐานข้อมูลเพื่อให้ง่ายต่อการอ้างอิง",
  "src/infrastructure/db/schema/users.ts": "กำหนดโครงสร้างตาราง users (id, email, passwordHash, name, role) สำหรับสิทธิ์ผู้ดูแลระบบ",
  "src/infrastructure/db/schema/posts.ts": "กำหนดโครงสร้างตาราง posts (id, title, slug, content, coverImage, status, views, publishedAt) สำหรับเก็บบล็อกบทความ",
  "src/infrastructure/db/schema/projects.ts": "กำหนดโครงสร้างตาราง projects (id, title, slug, description, category, images, status, createdAt) สำหรับเก็บผลงาน",
  "src/infrastructure/db/schema/contacts.ts": "กำหนดโครงสร้างตาราง contacts (id, name, email, phone, message, createdAt) สำหรับเก็บข้อมูลการติดต่อของลูกค้า",

  // Infrastructure Repositories
  "src/infrastructure/repositories/drizzle-user-repository.ts": "การพัฒนา UserRepository ด้วย Drizzle ORM เพื่อเข้าถึงข้อมูลของผู้ดูแลระบบในตาราง users",
  "src/infrastructure/repositories/drizzle-post-repository.ts": "การพัฒนา PostRepository ด้วย Drizzle ORM เพื่อสร้าง อ่าน แก้ไข ลบ ข้อมูลบทความในฐานข้อมูล",
  "src/infrastructure/repositories/drizzle-project-repository.ts": "การพัฒนา ProjectRepository ด้วย Drizzle ORM เพื่อจัดการข้อมูลบันทึกและแก้ไขโครงการผลงาน",
  "src/infrastructure/repositories/drizzle-contact-repository.ts": "การพัฒนา ContactRepository ด้วย Drizzle ORM เพื่อจัดการบันทึกและดึงข้อมูลกล่องจดหมายสอบถามของลูกค้า",

  // Infrastructure Auth & Services & DI
  "src/infrastructure/auth/auth.config.ts": "กำหนดตัวเลือกการทำงานของ NextAuth ที่ปลอดภัยในสภาพแวดล้อมแบบ Edge (Edge-compatible NextAuth Options) เช่น การเช็คสิทธิ์ล็อกอินใน Middleware",
  "src/infrastructure/auth/auth.ts": "ตัวกำหนดค่า NextAuth หลักที่รันบนสภาพแวดล้อม Node.js เพื่อประมวลผลการตรวจสอบสิทธิ์ผู้ใช้ด้วยรหัสผ่านผ่าน bcrypt และฐานข้อมูล",
  "src/infrastructure/auth/require-admin.ts": "ฟังก์ชันผู้ช่วย (Helper function) ตรวจสอบเซสชันความถูกต้องของ Admin บน Server Component และ Server Action",
  "src/infrastructure/auth/bcrypt-password-hasher.ts": "การเขียน implementation ของ PasswordHasher สำหรับการเข้ารหัสรหัสผ่านที่เสถียรผ่านไลบรารี bcrypt",
  "src/infrastructure/services/upload-service.ts": "บริการตรวจเช็คความปลอดภัยของภาพอัปโหลด ป้องกันการอัปโหลดไฟล์ไม่พึงประสงค์ (เช็ค Magic Bytes, ขนาด, นามสกุลจริง และเปลี่ยนชื่อไฟล์เป็นแบบสุ่ม)",
  "src/infrastructure/di/container.ts": "Dependency Injection Container (DI) ทำหน้าที่จดจำและลงทะเบียนอินสแตนซ์ของ Repositories และ Use Cases ทั้งหมดในระบบ",

  // Presentation Actions
  "src/presentation/actions/auth.actions.ts": "Server Actions สำหรับควบคุมพฤติกรรม Login และ Logout ฝั่งผู้ดูแลระบบ",
  "src/presentation/actions/blog.actions.ts": "Server Actions สำหรับจัดการ CRUD บล็อกบทความ ป้องกัน XSS โดยใช้ sanitize-html และตรวจสอบสิทธิ์แอดมินก่อนทำงาน",
  "src/presentation/actions/portfolio.actions.ts": "Server Actions สำหรับจัดการ CRUD ผลงานโครงการ รวมถึงการอัปโหลดภาพประกอบผลงาน",
  "src/presentation/actions/contact.actions.ts": "Server Actions สำหรับการส่งข้อมูลติดต่อของฝั่งผู้ใช้ทั่วไป และลบข้อความกล่องจดหมายของฝั่งผู้ดูแลระบบ",
  "src/presentation/actions/lang.actions.ts": "Server Action สำหรับสลับภาษา (TH/EN) บันทึกตัวเลือกผ่านคุกกี้ และสั่งเคลียร์แคชรีเฟรชหน้าเว็บอัตโนมัติ",

  // Presentation Components
  "src/presentation/components/admin/AdminNavigation.tsx": "ส่วนเมนูนำทางและควบคุมของระบบแอดมิน รองรับการแสดงผลบนอุปกรณ์พกพา (Drawer) และปุ่มสลับภาษาในตัว",
  "src/presentation/components/blog/PostForm.tsx": "ส่วนติดต่อผู้ใช้ (Component Form) สำหรับสร้างและแก้ไขเนื้อหาบทความบล็อกข่าวสาร",
  "src/presentation/components/blog/TiptapEditor.tsx": "กล่องเครื่องมือแก้ไขข้อความและเนื้อหา HTML (Rich Text Editor) ขับเคลื่อนด้วย Tiptap Editor",
  "src/presentation/components/portfolio/Gallery.tsx": "แกลเลอรีภาพผลงาน รองรับการสลับดูภาพปก และปรับแต่งแถบเลื่อนแนวขวางที่สมูทบนหน้าจอมือถือ",
  "src/presentation/components/portfolio/ImageUploader.tsx": "ส่วนการอัปโหลดภาพแบบลากวางไฟล์ (Drag and Drop Uploader) มีปุ่มลบรูปภาพและตั้งรูปภาพหลัก (Cover)",
  "src/presentation/components/portfolio/ProjectForm.tsx": "ส่วนติดต่อผู้ใช้ (Component Form) สำหรับการสร้างและแก้ไขผลงานโครงการ",
  "src/presentation/components/shared/Navbar.tsx": "แถบหัวเว็บนำทางหลัก (Navbar) ของผู้ใช้ทั่วไป พร้อมดีไซน์ Flat Plate มินิมอล เมนูมือถือ และปุ่มสลับภาษา TH|EN",
  "src/presentation/components/shared/Footer.tsx": "ส่วนท้ายเว็บหลัก (Footer) แสดงที่อยู่ ช่องทางการติดต่อ ลิงก์ด่วน และระบบนำไปสู่แผงแอดมิน รองรับระบบสองภาษา",
  "src/presentation/components/shared/ContactForm.tsx": "แบบฟอร์มการติดต่อผู้ใช้ทั่วไป พร้อมแถบโปรแกรมคำนวณประเมินราคาเสื้อยืด/เสื้อโปโลแบบโต้ตอบ คำนวณส่วนลดตามจำนวนทันที",
  "src/presentation/components/shared/CookieConsent.tsx": "แบนเนอร์ขอความยินยอมใช้งานคุกกี้ (Cookie Consent Banner) ให้ตรงตามข้อกำหนดกฎหมาย PDPA ของไทย",
  "src/presentation/components/ui/accordion.tsx": "Shadcn UI Primitive - ส่วนประกอบ Accordion แสดงรายการข้อมูลเปิด-ปิดหัวข้อ",
  "src/presentation/components/ui/button.tsx": "Shadcn UI Primitive - ปุ่มกดแบบโมโนโครมรองรับขนาดและลักษณะต่างๆ ของแอปพลิเคชัน",
  "src/presentation/components/ui/card.tsx": "Shadcn UI Primitive - การ์ดแสดงผลข้อมูลที่มีกรอบและหัวข้อที่จัดเรียงเรียบร้อย",
  "src/presentation/components/ui/input.tsx": "Shadcn UI Primitive - กล่องรับข้อมูลข้อความ (Text Input)",
  "src/presentation/components/ui/label.tsx": "Shadcn UI Primitive - เลเบลข้อความสำหรับฟิลด์รับข้อมูลของแบบฟอร์ม",

  // App Routing (Pages & Layouts)
  "src/app/(admin)/admin/layout.tsx": "หน้าโครงสร้างหลัก (Layout) ฝั่งแอดมิน ตรวจสอบสิทธิ์ผู้ดูแลระบบ ดึงคุกกี้ภาษา และแสดงแผงควบคุมระบบ",
  "src/app/(admin)/admin/page.tsx": "หน้าแรกคอนโซลแอดมิน แสดงยอดสถิติตัวเลขสรุปของบล็อก ผลงาน และข้อความติดต่อที่เข้ามา",
  "src/app/(admin)/admin/blog/page.tsx": "ตารางจัดการข้อมูลบล็อกบทความฝั่งแอดมิน มีปุ่มเพิ่ม แก้ไข ลบ และรองรับการแสดงผลแบบ Responsive ในมือถือ",
  "src/app/(admin)/admin/blog/new/page.tsx": "หน้าสำหรับแอดมินเขียนและเพิ่มบทความบล็อกข่าวสารอันใหม่เข้าสู่ระบบ",
  "src/app/(admin)/admin/blog/[id]/edit/page.tsx": "หน้าสำหรับโหลดข้อมูลบทความเดิมมาเพื่อแก้ไขและบันทึกการเปลี่ยนแปลงใหม่",
  "src/app/(admin)/admin/portfolio/page.tsx": "ตารางจัดการข้อมูลผลงานแกลเลอรีฝั่งแอดมิน สามารถดู ค้นหา เพิ่ม ลบ และอัปเดตผลงานโครงการได้",
  "src/app/(admin)/admin/portfolio/new/page.tsx": "หน้าสร้างและบันทึกข้อมูลผลงานโครงการอันใหม่เข้าสู่ตารางฐานข้อมูล",
  "src/app/(admin)/admin/portfolio/[id]/edit/page.tsx": "หน้าโหลดข้อมูลผลงานโครงการเก่าขึ้นมาแสดงผลเพื่ออัปเดตรายละเอียดใหม่",
  "src/app/(admin)/admin/contacts/page.tsx": "ตารางจัดการดูรายการข้อความติดต่อประเมินราคาที่ลูกค้าส่งเข้ามา พร้อมปุ่มลบข้อความ",
  "src/app/(admin)/login/page.tsx": "หน้าระบบล็อกอินสำหรับผู้ดูแลระบบ (Admin Login) ออกแบบสไตล์มินิมอลโมโนโครม",
  "src/app/(public)/layout.tsx": "หน้าโครงสร้างหลัก (Layout) สาธารณะ ตรวจจับคุกกี้ภาษาเพื่อส่งต่อไปยัง Navbar/Footer",
  "src/app/(public)/page.tsx": "หน้าหลักแรกสุด (Home Page) ของเว็บไซต์ รวมสไลเดอร์ผลงาน แคตตาล็อกสินค้า และบทความล่าสุด",
  "src/app/(public)/about/page.tsx": "หน้าแสดงประวัติความเป็นมา วิสัยทัศน์ พันธกิจ และเป้าหมายการดำเนินธุรกิจของบริษัท",
  "src/app/(public)/contact/page.tsx": "หน้าติดต่อเรา แสดงรายละเอียดการติดต่อ ลิงก์โซเชียล แผนที่ Google Maps และฟอร์มกรอกข้อความ",
  "src/app/(public)/faq/page.tsx": "หน้ารวบรวมคำถามที่ลูกค้าสอบถามบ่อย (Frequently Asked Questions)",
  "src/app/(public)/privacy-policy/page.tsx": "หน้าข้อมูลนโยบายความเป็นส่วนตัว (PDPA Policy) สำหรับควบคุมข้อมูลลูกค้าตามกฎหมาย",
  "src/app/(public)/services/page.tsx": "หน้ารวมประเภทบริการรับผลิตเสื้อประเภทต่างๆ (เสื้อยืด, โปโล, หมวก, ยูนิฟอร์ม)",
  "src/app/(public)/services/[slug]/page.tsx": "หน้าแสดงคุณสมบัติเฉพาะของเสื้อแต่ละประเภท เช่น เนื้อผ้าที่แนะนำ ขั้นตอนการสั่งผลิต และปุ่มสั่งจอง",
  "src/app/(public)/portfolio/page.tsx": "หน้ารวมภาพโครงการผลงานทั้งหมดของบริษัท แยกตามหมวดหมู่ประเภทสินค้าเพื่อดูแนวทางงานผลิต",
  "src/app/(public)/portfolio/[slug]/page.tsx": "หน้าแสดงผลงานโครงการเจาะลึก รวมรูปภาพสไลเดอร์แบบละเอียดและคำบรรยายแนวคิดงานผลิต",
  "src/app/(public)/blog/page.tsx": "หน้ารวมบทความสาระน่ารู้เกี่ยวกับวงการตัดเย็บเสื้อผ้า แนะนำแฟชั่น และข่าวกิจกรรมต่างๆ",
  "src/app/(public)/blog/[slug]/page.tsx": "หน้าแสดงรายละเอียดบทความฉับเต็ม พร้อมรูปหน้าปก ระบบนับยอดอ่าน และโครงสร้างข้อมูล SEO JSON-LD",
  "src/app/api/auth/[...nextauth]/route.ts": "API Handler ของระบบล็อกอิน NextAuth สำหรับรองรับความปลอดภัยฝั่งเซิร์ฟเวอร์",
  "src/app/feed.xml/route.ts": "ระบบสร้างฟีดบทความข่าวสารอัตโนมัติ (Dynamic RSS Feed) ในรูปแบบ XML สำหรับ Search Engines",
  "src/app/globals.css": "ไฟล์กำหนดธีมและสไตล์กลางของเว็บ (Central Styling) ตั้งค่า Fonts และ Prose Custom Renderer",
  "src/app/layout.tsx": "โครงสร้างรากหลักสุดของ Next.js (Root Layout) เก็บ Metadata, Favicon และ CSS หลักของระบบ",
  "src/app/not-found.tsx": "หน้าแจ้งข้อผิดพลาดเมื่อไม่พบข้อมูล (Custom 404 Page) ออกแบบมินิมอลเท่ๆ ล้อไปกับธีมเว็บ",
  "src/app/robots.ts": "ไฟล์กำหนดสิทธิ์การสแกนและค้นหาข้อมูลของหุ่นยนต์กูเกิล (Robots.txt) เพื่อความปลอดภัยของแอดมิน",
  "src/app/sitemap.ts": "ไฟล์สังเคราะห์แผงลิกน์หน้าเว็บทั้งหมด (Sitemap.xml) อำนวยความสะดวกในการจัดอันดับบน Google",
  "src/proxy.ts": "ไฟล์ Middleware ระดับ Edge เพื่อตรวจสอบและคุมความปลอดภัยไม่ให้คนทั่วไปเข้าใช้งานหน้า `/admin/*`",
  "src/shared/config/env.ts": "ตัวช่วยโหลดตัวแปรสภาพแวดล้อมพร้อมตรวจจับข้อผิดพลาดหากขาดตัวแปรหลักไป",
  "src/shared/utils/cn.ts": "ฟังก์ชันจัดการและผสานรวมคลาสสไตล์ Tailwind (Tailwind Class Merger Utility)",
  "src/shared/i18n/translations.ts": "พจนานุกรมคำแปลภาษาไทยและอังกฤษแบบครบวงจรสำหรับทั้งระบบเว็บไซต์ (Central i18n Dictionary)"
};

// Traverse directory recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

console.log('Starting commenting process for files in src/...');

walkDir(srcDir, (filePath) => {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const ext = path.extname(filePath);
  
  // Skip non-code/unsupported extensions
  if (!['.ts', '.tsx', '.css'].includes(ext)) {
    return;
  }

  // Get description for current file
  const desc = fileDescriptions[relPath];
  if (!desc) {
    console.log(`Skipping: ${relPath} (No description defined)`);
    return;
  }

  let fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Check if comment header is already present
  if (fileContent.includes('@path ' + relPath) || fileContent.includes(desc)) {
    console.log(`Already commented: ${relPath}`);
    return;
  }

  console.log(`Commenting: ${relPath}`);

  // Create the header comment block
  let headerComment = '';
  if (ext === '.css') {
    headerComment = `/*
 * @file ${path.basename(filePath)}
 * @path ${relPath}
 * @description ${desc}
 */\n\n`;
  } else {
    headerComment = `/**
 * @file ${path.basename(filePath)}
 * @path ${relPath}
 * @description ${desc}
 */\n\n`;
  }

  // Handle "use client"; or "use server"; directive (must remain at the absolute top)
  const directiveMatch = fileContent.match(/^(\s*['"]use client['"]\s*;?|\s*['"]use server['"]\s*;?)\r?\n/);
  if (directiveMatch) {
    const directive = directiveMatch[0];
    const rest = fileContent.slice(directive.length);
    fileContent = directive + '\n' + headerComment + rest;
  } else {
    fileContent = headerComment + fileContent;
  }

  fs.writeFileSync(filePath, fileContent, 'utf8');
});

console.log('Successfully completed adding comments to all files!');
