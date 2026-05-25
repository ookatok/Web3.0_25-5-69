import { ContactRepository } from "@/application/ports/contact-repository";
import { Contact } from "@/domain/entities/contact";

export class ListContacts {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(): Promise<Contact[]> {
    return this.contactRepository.findAll();
  }
}
