/**
 * @file password-hasher.ts
 * @path src/application/ports/password-hasher.ts
 * @description อินเตอร์เฟสพอร์ต (Port Interface) สำหรับระบบแฮชและเปรียบเทียบรหัสผ่าน (Password Hashing)
 */

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
