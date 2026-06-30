import { comparePassword } from "@/infrastructure/auth/password";
import { generateToken } from "@/infrastructure/auth/jwt";

import { LoginResponseDto } from "../dto/LoginResponseDto";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

export class LoginUseCase {
  private readonly repository =
    new PrismaUserRepository();

  async execute(
    email: string,
    password: string
  ): Promise<LoginResponseDto> {
    const dbUser =
      await this.repository.findByEmail(email);

    if (!dbUser) {
      throw new Error("Invalid credentials");
    }

    const prismaUser =
      await this.repository.findByEmail(email);

    if (!prismaUser) {
      throw new Error("Invalid credentials");
    }

    const userRecord = await (
      await import("@/infrastructure/database/prisma")
    ).prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!userRecord) {
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