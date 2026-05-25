import { ContactRepository } from "@/application/ports/contact-repository";
import { Contact } from "@/domain/entities/contact";
import { CreateContactInput } from "@/application/dto/contact.dto";
import crypto from "crypto";

export class CreateContact {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(input: CreateContactInput): Promise<Contact> {
    const contact = Contact.create({
      id: crypto.randomUUID(),
      name: input.name,
      phone: input.phone ?? null,
      email: input.email ?? null,
      message: input.message,
      createdAt: new Date(),
    });

    await this.contactRepository.save(contact);
    return contact;
  }
}
