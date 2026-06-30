export interface Education {
  id: number;

  institution_name?: string | null;

  degree?: string | null;

  field_of_study?: string | null;

  start_date?: Date | null;

  end_date?: Date | null;

  grade?: string | null;

  description?: string | null;

  logo_url?: string | null;

  display_order?: number | null;
}