import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@portfolio.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";

  const existing = await prisma.users.findUnique({
    where: { email },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (existing) {
    await prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: "ADMIN",
        is_active: true,
      },
    });
    console.log(`✅ Admin updated: ${email}`);
  } else {
    await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        role: "ADMIN",
        is_active: true,
      },
    });
    console.log(`✅ Admin created: ${email}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
