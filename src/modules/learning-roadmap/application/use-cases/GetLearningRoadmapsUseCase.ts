import { PrismaLearningRoadmapRepository } from "../../infrastructure/repositories/PrismaLearningRoadmapRepository";

export class GetLearningRoadmapsUseCase {
  private readonly repository =
    new PrismaLearningRoadmapRepository();

  async execute() {
    return this.repository.getAll();
  }
}