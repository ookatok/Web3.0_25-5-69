/**
 * @file user-repository.ts
 * @path src/application/ports/user-repository.ts
 * @description อินเตอร์เฟสพอร์ต (Port Interface) สำหรับจัดการข้อมูลผู้ใช้ (User) ในระดับ Application Layer เพื่อให้ Repository นำไปสืบทอด
 */

import { User } from "@/domain/entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
