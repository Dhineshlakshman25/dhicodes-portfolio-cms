import { comparePassword } from "@/infrastructure/auth/password";
import { generateToken } from "@/infrastructure/auth/jwt";
import { prisma } from "@/infrastructure/database/prisma";
import { LoginResponseDto } from "../dto/LoginResponseDto";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

export class LoginUseCase {
  private readonly repository = new PrismaUserRepository();

  async execute(
    email: string,
    password: string
  ): Promise<LoginResponseDto> {
    const cleanEmail = email.trim().toLowerCase();

    let userRecord = await prisma.users.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: "insensitive",
        },
      },
    });

    if (!userRecord) {
      // Handle possible variations between lakshman / lakshmanan
      const alias = cleanEmail.includes("lakshmanan")
        ? cleanEmail.replace("lakshmanan", "lakshman")
        : cleanEmail.includes("lakshman")
        ? cleanEmail.replace("lakshman", "lakshmanan")
        : null;

      if (alias) {
        userRecord = await prisma.users.findFirst({
          where: {
            email: {
              equals: alias,
              mode: "insensitive",
            },
          },
        });
      }
    }

    if (!userRecord || userRecord.is_active === false) {
      throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(
      password,
      userRecord.password
    );

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    await this.repository.updateLastLogin(
      userRecord.id
    );

    const token = generateToken({
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
    });

    return {
      token,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        role: userRecord.role ?? "USER",
      },
    };
  }
}