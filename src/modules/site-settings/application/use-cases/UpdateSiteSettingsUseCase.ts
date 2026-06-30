import { UpdateSiteSettingsDto } from "../dto/UpdateSiteSettingsDto";
import { PrismaSiteSettingsRepository } from "../../infrastructure/repositories/PrismaSiteSettingsRepository";

export class UpdateSiteSettingsUseCase {
  private readonly repository =
    new PrismaSiteSettingsRepository();

  async execute(
    data: UpdateSiteSettingsDto
  ) {
    return this.repository.update(
      data
    );
  }
}