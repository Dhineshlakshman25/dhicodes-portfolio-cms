import { PrismaContactMessageRepository } from "../../infrastructure/repositories/PrismaContactMessageRepository";

export class DeleteContactMessageUseCase {
  private readonly repository =
    new PrismaContactMessageRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}