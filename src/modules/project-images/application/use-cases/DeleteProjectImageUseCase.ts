import { PrismaProjectImageRepository } from "../../infrastructure/repositories/PrismaProjectImageRepository";

export class DeleteProjectImageUseCase {
  private readonly repository =
    new PrismaProjectImageRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}