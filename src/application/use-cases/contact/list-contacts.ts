/**
 * @file list-contacts.ts
 * @path src/application/use-cases/contact/list-contacts.ts
 * @description ยูสเคส (Use Case) ดึงข้อความติดต่อทั้งหมดเรียงลำดับตามวันที่สร้างล่าสุดสำหรับแอดมิน
 */

import { ContactRepository } from "@/application/ports/contact-repository";
import { Contact } from "@/domain/entities/contact";

export class ListContacts {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(): Promise<Contact[]> {
    return this.contactRepository.findAll();
  }
}
