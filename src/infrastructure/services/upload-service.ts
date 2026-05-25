import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  fileName: string;
  filePath: string; // Public URL path, e.g. /uploads/portfolio/filename.webp
}

export class UploadService {
  private readonly allowedMimes = ["image/jpeg", "image/png", "image/webp"];
  private readonly maxSizeBytes = 5 * 1024 * 1024; // 5MB
  private readonly uploadDir = path.join(process.cwd(), "public", "uploads", "portfolio");

  public async validateAndUpload(file: File): Promise<UploadResult> {
    // 1. Check file size
    if (file.size > this.maxSizeBytes) {
      throw new Error("ขนาดไฟล์ต้องไม่เกิน 5MB");
    }

    // 2. Check MIME type
    if (!this.allowedMimes.includes(file.type)) {
      throw new Error("รองรับเฉพาะไฟล์ภาพนามสกุล JPEG, PNG หรือ WEBP เท่านั้น");
    }

    // 3. Read buffer for magic bytes validation
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    this.validateMagicBytes(buffer, file.type);

    // 4. Create directory if not exists
    await fs.mkdir(this.uploadDir, { recursive: true });

    // 5. Generate secure random filename
    const ext = path.extname(file.name) || this.getExtensionFromMime(file.type);
    const safeName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    const destinationPath = path.join(this.uploadDir, safeName);

    // 6. Write file
    await fs.writeFile(destinationPath, buffer);

    return {
      fileName: safeName,
      filePath: `/uploads/portfolio/${safeName}`,
    };
  }

  private validateMagicBytes(buffer: Buffer, mimeType: string) {
    if (buffer.length < 4) {
      throw new Error("ไฟล์รูปภาพไม่ถูกต้อง");
    }

    const header = buffer.toString("hex", 0, 4).toUpperCase();

    if (mimeType === "image/jpeg") {
      // JPEG magic bytes: FF D8 FF
      if (!header.startsWith("FFD8FF")) {
        throw new Error("ไฟล์รูปภาพ JPEG ไม่ถูกต้อง");
      }
    } else if (mimeType === "image/png") {
      // PNG magic bytes: 89 50 4E 47
      if (header !== "89504E47") {
        throw new Error("ไฟล์รูปภาพ PNG ไม่ถูกต้อง");
      }
    } else if (mimeType === "image/webp") {
      // WebP magic bytes: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
      const riffHeader = buffer.toString("utf8", 0, 4);
      const webpHeader = buffer.toString("utf8", 8, 12);
      if (riffHeader !== "RIFF" || webpHeader !== "WEBP") {
        throw new Error("ไฟล์รูปภาพ WEBP ไม่ถูกต้อง");
      }
    } else {
      throw new Error("ประเภทไฟล์รูปภาพไม่รองรับ");
    }
  }

  private getExtensionFromMime(mimeType: string): string {
    switch (mimeType) {
      case "image/jpeg":
        return ".jpg";
      case "image/png":
        return ".png";
      case "image/webp":
        return ".webp";
      default:
        return "";
    }
  }
}
export const uploadService = new UploadService();
