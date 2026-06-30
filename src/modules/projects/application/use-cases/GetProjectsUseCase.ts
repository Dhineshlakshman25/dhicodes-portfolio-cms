import { PrismaProjectRepository } from "../../infrastructure/repositories/PrismaProjectRepository";

export class GetProjectsUseCase {
  private readonly repository =
    new PrismaProjectRepository();

  async execute() {
    return this.repository.getAll();
  }
}