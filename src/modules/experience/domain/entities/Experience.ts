export interface Experience {
  id: number;

  company_name: string;
  role: string;

  start_date: Date;
  end_date?: Date | null;

  description?: string | null;

  employment_type?: string | null;

  location?: string | null;

  company_logo?: string | null;

  tech_stack?: string | null;

  is_current?: boolean | null;

  display_order?: number | null;
}