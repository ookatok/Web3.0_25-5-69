/**
 * @file drizzle-user-repository.ts
 * @path src/infrastructure/repositories/drizzle-user-repository.ts
 * @description การพัฒนา UserRepository ด้วย Drizzle ORM เพื่อเข้าถึงข้อมูลของผู้ดูแลระบบในตาราง users
 */

import { UserRepository } from "@/application/ports/user-repository";
import { User } from "@/domain/entities/user";
import { DbType } from "@/infrastructure/db/client";
import { users } from "@/infrastructure/db/schema/users";
import { eq } from "drizzle-orm";

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: DbType) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return User.create({
      id: row.id,
      email: row.email,
      passwordHash: row.password,
      name: row.name,
      role: row.role as "ADMIN",
      createdAt: row.createdAt,
    });
  }

  async save(user: User): Promise<void> {
    await this.db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        password: user.passwordHash,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      })
      .onDuplicateKeyUpdate({
        set: {
          email: user.email,
          password: user.passwordHash,
          name: user.name,
          role: user.role,
        },
      });
  }
}
