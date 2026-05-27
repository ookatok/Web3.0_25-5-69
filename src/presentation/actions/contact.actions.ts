"use server";

/**
 * @file contact.actions.ts
 * @path src/presentation/actions/contact.actions.ts
 * @description Server Actions สำหรับการส่งข้อมูลติดต่อของฝั่งผู้ใช้ทั่วไป และลบข้อความกล่องจดหมายของฝั่งผู้ดูแลระบบ
 */


import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { createContactSchema } from "@/application/dto/contact.dto";
import { container } from "@/infrastructure/di/container";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { headers } from "next/headers";
import crypto from "crypto";

// Anti-Spam Rate Limit Memory Store
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const ipCache = new Map<string, RateLimitEntry>();
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const SECURITY_SECRET_KEY = "web3.0-custom-spam-cryptographic-salt-key-12345";

export async function getFormTokenAction() {
  const timestamp = Date.now();
  const hmac = crypto.createHmac("sha256", SECURITY_SECRET_KEY).update(timestamp.toString()).digest("hex");
  return `${timestamp}.${hmac}`;
}

export async function createContactAction(input: unknown) {
  try {
    const rawInput = input as any;

    // 1. Honeypot check (Bots fill this hidden input field)
    if (rawInput && rawInput.phone_secondary) {
      console.warn("Spam bot blocked by Honeypot check");
      return { success: false, error: "ขออภัย ระบบไม่สามารถดำเนินการส่งข้อมูลได้ในขณะนี้" };
    }

    // 2. IP-based Rate Limiting
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || headerList.get("x-real-ip") || "127.0.0.1";
    const now = Date.now();
    const rateLimit = ipCache.get(ip);

    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= RATE_LIMIT_COUNT) {
          return {
            success: false,
            error: "คุณส่งข้อความบ่อยเกินไป กรุณารอ 15 นาทีแล้วลองใหม่อีกครั้ง (Rate limit reached)",
          };
        }
        rateLimit.count += 1;
      } else {
        ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      }
    } else {
      ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // 3. Cryptographic Timestamp Token Verification (Blocks instant submit bots)
    const token = rawInput?.formToken;
    if (!token) {
      return { success: false, error: "ระบบตรวจสอบความปลอดภัยล้มเหลว (Security token missing)" };
    }

    const [timestampStr, clientHmac] = token.split(".");
    const timestamp = parseInt(timestampStr, 10);

    const expectedHmac = crypto.createHmac("sha256", SECURITY_SECRET_KEY).update(timestampStr).digest("hex");
    if (clientHmac !== expectedHmac) {
      return { success: false, error: "ระบบตรวจสอบความปลอดภัยล้มเหลว (Invalid security signature)" };
    }

    const elapsed = now - timestamp;
    if (elapsed < 3000) { // Under 3 seconds -> Bot behavior
      return { success: false, error: "กรุณารออย่างน้อย 3 วินาทีก่อนกดส่งข้อมูลเพื่อความปลอดภัย" };
    }

    if (elapsed > 2 * 60 * 60 * 1000) { // Token expires in 2 hours
      return { success: false, error: "แบบฟอร์มหมดอายุการใช้งาน กรุณารีเฟรชหน้าเว็บและลองใหม่อีกครั้ง" };
    }

    // 4. Validate inputs via Zod
    const data = createContactSchema.parse(input);

    // 5. Execute usecase
    const contact = await container.createContact.execute(data);

    // 6. Revalidate admin messages list
    revalidatePath("/admin/contacts");

    return { success: true, data: contact.toJSON() };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง" };
    }
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งข้อความ";
    return { success: false, error: message };
  }
}

export async function deleteContactAction(id: string) {
  // 1. Auth check
  await requireAdmin();

  // 2. Execute repository delete
  await container.contactRepository.delete(id);

  // 3. Revalidate admin messages list
  revalidatePath("/admin/contacts");

  return { success: true };
}

export async function deleteContactFormAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await deleteContactAction(id);
}
