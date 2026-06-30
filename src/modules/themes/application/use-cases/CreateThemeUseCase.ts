import { CreateThemeDto } from "../dto/CreateThemeDto";
import { PrismaThemeRepository } from "../../infrastructure/repositories/PrismaThemeRepository";

export class CreateThemeUseCase {
  private readonly repository =
    new PrismaThemeRepository();

  async execute(
    data: CreateThemeDto
  ) {
    return this.repository.create(
      data
    );
  }
}