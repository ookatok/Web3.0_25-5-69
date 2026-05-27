/**
 * @file seed.ts
 * @path src/infrastructure/db/seed.ts
 * @description สคริปต์สำหรับการ Seed ข้อมูลแอดมินเริ่มต้นลงในฐานข้อมูล และเข้ารหัสผ่านด้วย bcrypt
 */

import { container } from "../di/container";
import { User } from "@/domain/entities/user";
import crypto from "crypto";

async function main() {
  const email = process.argv[2] || process.env.SEED_ADMIN_EMAIL;
  const password = process.argv[3] || process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("❌ Usage: npm run seed <email> <password>");
    console.error("Or set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in environment.");
    process.exit(1);
  }

  console.log(`🌱 Seeding admin user: ${email}...`);

  try {
    // Check if user already exists
    const existingUser = await container.userRepository.findByEmail(email);
    if (existingUser) {
      console.log(`⚠️ User with email ${email} already exists!`);
      process.exit(0);
    }

    const passwordHash = await container.passwordHasher.hash(password);
    const adminUser = User.create({
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name: "Admin User",
      role: "ADMIN",
      createdAt: new Date(),
    });

    await container.userRepository.save(adminUser);
    console.log(`✅ Admin user seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
