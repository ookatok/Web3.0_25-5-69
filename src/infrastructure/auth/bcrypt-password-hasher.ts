/**
 * @file bcrypt-password-hasher.ts
 * @path src/infrastructure/auth/bcrypt-password-hasher.ts
 * @description การเขียน implementation ของ PasswordHasher สำหรับการเข้ารหัสรหัสผ่านที่เสถียรผ่านไลบรารี bcrypt
 */

import { PasswordHasher } from "@/application/ports/password-hasher";
import bcrypt from "bcrypt";

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
