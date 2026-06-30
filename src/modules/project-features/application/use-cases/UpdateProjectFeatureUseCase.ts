import { UpdateProjectFeatureDto } from "../dto/UpdateProjectFeatureDto";
import { PrismaProjectFeatureRepository } from "../../infrastructure/repositories/PrismaProjectFeatureRepository";

export class UpdateProjectFeatureUseCase {
  private readonly repository =
    new PrismaProjectFeatureRepository();

  async execute(
    id: number,
    data: UpdateProjectFeatureDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}