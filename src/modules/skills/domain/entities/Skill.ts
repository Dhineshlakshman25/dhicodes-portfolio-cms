export interface Skill {
  id: number;

  name: string;

  category_id?: number | null;

  proficiency?: number | null;

  icon_url?: string | null;

  display_order?: number | null;

  is_featured?: boolean | null;
}