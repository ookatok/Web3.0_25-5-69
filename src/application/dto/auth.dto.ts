/**
 * @file auth.dto.ts
 * @path src/application/dto/auth.dto.ts
 * @description Data Transfer Object (DTO) สำหรับขั้นตอนการล็อกอินเข้าสู่ระบบ พร้อมใช้ Zod Schema ในการตรวจสอบข้อมูลขาเข้า
 */

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;
