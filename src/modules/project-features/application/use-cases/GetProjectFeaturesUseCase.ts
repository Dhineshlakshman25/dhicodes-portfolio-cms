import { PrismaProjectFeatureRepository } from "../../infrastructure/repositories/PrismaProjectFeatureRepository";

export class GetProjectFeaturesUseCase {
  private readonly repository =
    new PrismaProjectFeatureRepository();

  async execute() {
    return this.repository.getAll();
  }
}