import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.");
    console.error("Credentials must not be hardcoded in source files.");
    process.exit(1);
  }

  console.log("Removing all existing admin users...");
  await prisma.users.deleteMany({});

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.users.create({
    data: {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      role: "ADMIN",
      is_active: true,
    },
  });

  console.log(`✅ Single admin successfully created:`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Active: ${admin.is_active}`);

  const totalUsers = await prisma.users.count();
  console.log(`Total users in DB: ${totalUsers}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
