import { PrismaSiteSettingsRepository } from "../../infrastructure/repositories/PrismaSiteSettingsRepository";

export class GetSiteSettingsUseCase {
  private readonly repository =
    new PrismaSiteSettingsRepository();

  async execute() {
    return this.repository.get();
  }
}