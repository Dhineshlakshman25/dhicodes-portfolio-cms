import { PrismaProjectRepository } from "../../infrastructure/repositories/PrismaProjectRepository";

export class DeleteProjectUseCase {
  private readonly repository =
    new PrismaProjectRepository();

  async execute(
    id: string
  ) {
    await this.repository.delete(
      id
    );
  }
}