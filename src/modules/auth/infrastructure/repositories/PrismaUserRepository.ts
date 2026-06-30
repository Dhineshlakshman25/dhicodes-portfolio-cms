import { prisma } from "@/infrastructure/database/prisma";

import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserMapper } from "../mappers/UserMapper";

export class PrismaUserRepository
  implements IUserRepository
{
  async findByEmail(
    email: string
  ): Promise<User | null> {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findById(
    id: string
  ): Promise<User | null> {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async updateLastLogin(
    id: string
  ): Promise<void> {
    await prisma.users.update({
      where: {
        id,
      },
      data: {
        last_login: new Date(),
      },
    });
  }
}