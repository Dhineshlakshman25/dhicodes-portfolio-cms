import { CreateProjectFeatureDto } from "../dto/CreateProjectFeatureDto";
import { PrismaProjectFeatureRepository } from "../../infrastructure/repositories/PrismaProjectFeatureRepository";

export class CreateProjectFeatureUseCase {
  private readonly repository =
    new PrismaProjectFeatureRepository();

  async execute(
    data: CreateProjectFeatureDto
  ) {
    return this.repository.create(
      data
    );
  }
}