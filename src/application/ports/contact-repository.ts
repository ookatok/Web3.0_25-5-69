import { Contact } from "@/domain/entities/contact";

export interface ContactRepository {
  findById(id: string): Promise<Contact | null>;
  save(contact: Contact): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Contact[]>;
}
