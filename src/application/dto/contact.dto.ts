import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อของคุณ").max(255, "ชื่อต้องมีความยาวไม่เกิน 255 ตัวอักษร"),
  phone: z.string()
    .max(50, "เบอร์โทรศัพท์ต้องมีความยาวไม่เกิน 50 ตัวอักษร")
    .refine((val) => {
      if (!val) return true;
      const regex = /^[0-9+\-\s()]*(\s*(ext|ext\.|ต่อ)\s*[0-9]+)?$/i;
      return regex.test(val);
    }, {
      message: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข และรองรับเบอร์ส่วนบุคคล/บริษัท/ต่างประเทศ)"
    })
    .optional()
    .nullable(),
  email: z.string().max(255, "อีเมลต้องมีความยาวไม่เกิน 255 ตัวอักษร").optional().nullable(),
  message: z.string().min(1, "กรุณากรอกข้อความ").max(2000, "ข้อความต้องมีความยาวไม่เกิน 2000 ตัวอักษร"),
}).refine((data) => {
  return data.phone || data.email;
}, {
  message: "กรุณากรอกเบอร์โทรศัพท์หรืออีเมลอย่างน้อยหนึ่งช่องทาง เพื่อการติดต่อกลับ",
  path: ["email"],
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
