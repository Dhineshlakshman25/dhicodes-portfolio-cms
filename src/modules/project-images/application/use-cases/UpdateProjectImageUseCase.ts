import { UpdateProjectImageDto } from "../dto/UpdateProjectImageDto";
import { PrismaProjectImageRepository } from "../../infrastructure/repositories/PrismaProjectImageRepository";

export class UpdateProjectImageUseCase {
  private readonly repository =
    new PrismaProjectImageRepository();

  async execute(
    id: number,
    data: UpdateProjectImageDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}