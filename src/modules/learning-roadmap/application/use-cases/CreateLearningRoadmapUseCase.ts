import { CreateLearningRoadmapDto } from "../dto/CreateLearningRoadmapDto";
import { PrismaLearningRoadmapRepository } from "../../infrastructure/repositories/PrismaLearningRoadmapRepository";

export class CreateLearningRoadmapUseCase {
  private readonly repository =
    new PrismaLearningRoadmapRepository();

  async execute(
    data: CreateLearningRoadmapDto
  ) {
    return this.repository.create({
      ...data,
      target_date: data.target_date
        ? new Date(data.target_date)
        : undefined,
    });
  }
}