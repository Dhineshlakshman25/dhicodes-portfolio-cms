import { UpdateProjectDto } from "../dto/UpdateProjectDto";
import { PrismaProjectRepository } from "../../infrastructure/repositories/PrismaProjectRepository";

export class UpdateProjectUseCase {
  private readonly repository =
    new PrismaProjectRepository();

  async execute(
    id: string,
    data: UpdateProjectDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}