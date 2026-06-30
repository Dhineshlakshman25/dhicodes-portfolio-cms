export interface UpdateSocialLinkDto {
  platform?: string;

  url?: string;

  icon?: string;

  display_order?: number;

  is_active?: boolean;
}