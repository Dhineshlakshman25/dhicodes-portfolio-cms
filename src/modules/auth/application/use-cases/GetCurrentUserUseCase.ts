import { verifyToken } from "@/infrastructure/auth/jwt";

import { ITokenPayload } from "../interfaces/ITokenPayload";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

export class GetCurrentUserUseCase {
  private readonly repository =
    new PrismaUserRepository();

  async execute(token: string) {
    const payload = verifyToken(
      token
    ) as ITokenPayload;

    const user =
      await this.repository.findById(
        payload.id
      );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}