/**
 * @file verify-credentials.ts
 * @path src/application/use-cases/auth/verify-credentials.ts
 * @description ยูสเคส (Use Case) ตรวจสอบความถูกต้องของบัญชีผู้ใช้เมื่อล็อกอินเข้าสู่ระบบ
 */

import { UserRepository } from "@/application/ports/user-repository";
import { PasswordHasher } from "@/application/ports/password-hasher";
import { User } from "@/domain/entities/user";
import { LoginInput } from "@/application/dto/auth.dto";

export class VerifyCredentials {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(input: LoginInput): Promise<User | null> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      return null;
    }

    const isMatch = await this.passwordHasher.compare(
      input.password,
      user.passwordHash
    );

    if (!isMatch) {
      return null;
    }

    return user;
  }
}
