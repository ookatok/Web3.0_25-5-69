/**
 * @file contact-repository.ts
 * @path src/application/ports/contact-repository.ts
 * @description อินเตอร์เฟสพอร์ต (Port Interface) สำหรับกระบวนการบันทึกและแสดงข้อมูลการติดต่อจากลูกค้า (Contact)
 */

import { Contact } from "@/domain/entities/contact";

export interface ContactRepository {
  findById(id: string): Promise<Contact | null>;
  save(contact: Contact): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Contact[]>;
}
