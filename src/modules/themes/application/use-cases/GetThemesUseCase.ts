import { PrismaThemeRepository } from "../../infrastructure/repositories/PrismaThemeRepository";

export class GetThemesUseCase {
  private readonly repository =
    new PrismaThemeRepository();

  async execute() {
    return this.repository.getAll();
  }
}