import { PrismaProjectRepository } from "../../infrastructure/repositories/PrismaProjectRepository";

export class GetPublishedProjectsUseCase {
  private readonly repository = new PrismaProjectRepository();

  async execute() {
    return this.repository.getAllPublished();
  }
}
