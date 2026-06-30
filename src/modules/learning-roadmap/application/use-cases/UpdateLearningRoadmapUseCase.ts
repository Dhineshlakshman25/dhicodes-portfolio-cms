import { UpdateLearningRoadmapDto } from "../dto/UpdateLearningRoadmapDto";
import { PrismaLearningRoadmapRepository } from "../../infrastructure/repositories/PrismaLearningRoadmapRepository";

export class UpdateLearningRoadmapUseCase {
  private readonly repository =
    new PrismaLearningRoadmapRepository();

  async execute(
    id: number,
    data: UpdateLearningRoadmapDto
  ) {
    return this.repository.update(id, {
      ...data,
      target_date: data.target_date
        ? new Date(data.target_date)
        : undefined,
    });
  }
}