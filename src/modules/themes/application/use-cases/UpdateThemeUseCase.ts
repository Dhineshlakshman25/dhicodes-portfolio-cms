import { UpdateThemeDto } from "../dto/UpdateThemeDto";
import { PrismaThemeRepository } from "../../infrastructure/repositories/PrismaThemeRepository";

export class UpdateThemeUseCase {
  private readonly repository =
    new PrismaThemeRepository();

  async execute(
    id: string,
    data: UpdateThemeDto
  ) {
    return this.repository.update(
      id,
      data
    );
  }
}