import { PrismaProjectImageRepository } from "../../infrastructure/repositories/PrismaProjectImageRepository";

export class GetProjectImagesUseCase {
  private readonly repository =
    new PrismaProjectImageRepository();

  async execute() {
    return this.repository.getAll();
  }
}