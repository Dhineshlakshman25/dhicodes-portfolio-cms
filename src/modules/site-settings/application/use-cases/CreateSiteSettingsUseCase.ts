import { CreateSiteSettingsDto } from "../dto/CreateSiteSettingsDto";
import { PrismaSiteSettingsRepository } from "../../infrastructure/repositories/PrismaSiteSettingsRepository";

export class CreateSiteSettingsUseCase {
  private readonly repository =
    new PrismaSiteSettingsRepository();

  async execute(
    data: CreateSiteSettingsDto
  ) {
    return this.repository.create(
      data
    );
  }
}