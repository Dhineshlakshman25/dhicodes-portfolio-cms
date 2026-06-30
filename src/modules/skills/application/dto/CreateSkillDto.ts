export interface CreateSkillDto {
  name: string;

  category_id?: number;

  proficiency?: number;

  icon_url?: string;

  display_order?: number;

  is_featured?: boolean;
}