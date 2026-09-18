import { PrismaThemeRepository } from "../../infrastructure/repositories/PrismaThemeRepository";

export class GetActiveThemesUseCase {
  private readonly repository = new PrismaThemeRepository();

  async execute() {
    return this.repository.getAllActive();
  }
}
