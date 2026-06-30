import { UpdateEducationDto } from "../dto/UpdateEducationDto";
import { PrismaEducationRepository } from "../../infrastructure/repositories/PrismaEducationRepository";

export class UpdateEducationUseCase {
  private readonly repository =
    new PrismaEducationRepository();

  async execute(
    id: number,
    data: UpdateEducationDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}