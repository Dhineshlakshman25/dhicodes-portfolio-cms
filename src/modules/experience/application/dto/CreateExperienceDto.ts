export interface CreateExperienceDto {
  company_name: string;

  role: string;

  start_date: Date;

  end_date?: Date;

  description?: string;

  employment_type?: string;

  location?: string;

  company_logo?: string;

  tech_stack?: string;

  is_current?: boolean;

  display_order?: number;
}