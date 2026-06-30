import { PrismaLearningRoadmapRepository } from "../../infrastructure/repositories/PrismaLearningRoadmapRepository";

export class DeleteLearningRoadmapUseCase {
  private readonly repository =
    new PrismaLearningRoadmapRepository();

  async execute(
    id: number
  ) {
    await this.repository.delete(
      id
    );
  }
}