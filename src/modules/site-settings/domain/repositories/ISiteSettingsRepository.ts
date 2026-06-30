import { SiteSettings } from "../entities/SiteSettings";

export interface ISiteSettingsRepository {
  get(): Promise<SiteSettings | null>;

  create(
    data: Partial<SiteSettings>
  ): Promise<SiteSettings>;

  update(
    data: Partial<SiteSettings>
  ): Promise<SiteSettings>;
}