export interface CreateThemeDto {
  id: string;

  name: string;

  slug: string;

  description?: string;

  primary_color?: string;

  secondary_color?: string;

  accent_color?: string;

  background_color?: string;

  surface_color?: string;

  text_color?: string;

  font_family?: string;

  preview_image?: string;

  is_default?: boolean;

  is_active?: boolean;
}