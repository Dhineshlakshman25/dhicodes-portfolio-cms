export interface SiteSettings {
  id: number;

  site_name?: string | null;

  site_description?: string | null;

  site_keywords?: string | null;

  logo_url?: string | null;

  favicon_url?: string | null;

  footer_text?: string | null;

  active_theme_id?: string | null;

  maintenance_mode?: boolean | null;

  created_at?: Date | null;

  updated_at?: Date | null;
}