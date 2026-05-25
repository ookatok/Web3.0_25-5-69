import { ContactRepository } from "@/application/ports/contact-repository";
import { Contact } from "@/domain/entities/contact";
import { DbType } from "@/infrastructure/db/client";
import { contacts } from "@/infrastructure/db/schema/contacts";
import { eq, desc } from "drizzle-orm";

export class DrizzleContactRepository implements ContactRepository {
  constructor(private readonly db: DbType) {}

  private mapToDomain(row: typeof contacts.$inferSelect): Contact {
    return Contact.create({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      message: row.message,
      createdAt: row.createdAt,
    });
  }

  async findById(id: string): Promise<Contact | null> {
    const result = await this.db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }
    return this.mapToDomain(result[0]);
  }

  async save(contact: Contact): Promise<void> {
    await this.db
      .insert(contacts)
      .values({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt,
      })
      .onDuplicateKeyUpdate({
        set: {
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          message: contact.message,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(contacts).where(eq(contacts.id, id));
  }

  async findAll(): Promise<Contact[]> {
    const rows = await this.db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));

    return rows.map((row) => this.mapToDomain(row));
  }
}
