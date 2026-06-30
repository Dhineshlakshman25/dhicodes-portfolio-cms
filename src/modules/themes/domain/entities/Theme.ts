export interface Theme {
  id: string;

  name: string;

  slug: string;

  description?: string | null;

  primary_color?: string | null;

  secondary_color?: string | null;

  accent_color?: string | null;

  background_color?: string | null;

  surface_color?: string | null;

  text_color?: string | null;

  font_family?: string | null;

  preview_image?: string | null;

  is_default?: boolean | null;

  is_active?: boolean | null;
}