export interface CreateEducationDto {
  institution_name?: string;

  degree?: string;

  field_of_study?: string;

  start_date?: Date;

  end_date?: Date;

  grade?: string;

  description?: string;

  logo_url?: string;

  display_order?: number;
}