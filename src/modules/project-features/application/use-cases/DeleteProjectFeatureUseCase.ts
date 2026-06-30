import { PrismaProjectFeatureRepository } from "../../infrastructure/repositories/PrismaProjectFeatureRepository";

export class DeleteProjectFeatureUseCase {
  private readonly repository =
    new PrismaProjectFeatureRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}