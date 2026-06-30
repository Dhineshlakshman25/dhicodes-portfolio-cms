export interface SocialLink {
  id: number;

  platform: string;
  url: string;

  icon?: string | null;

  display_order?: number | null;
  is_active?: boolean | null;

  created_at?: Date | null;
  updated_at?: Date | null;
}