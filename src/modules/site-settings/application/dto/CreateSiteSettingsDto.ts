export interface CreateSiteSettingsDto {
  site_name?: string;

  site_description?: string;

  site_keywords?: string;

  logo_url?: string;

  favicon_url?: string;

  footer_text?: string;

  active_theme_id?: string;

  maintenance_mode?: boolean;
}