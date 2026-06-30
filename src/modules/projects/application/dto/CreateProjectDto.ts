export interface CreateProjectDto {
  id: string;

  title: string;

  slug: string;

  short_description?: string;

  full_description?: string;

  github_url?: string;

  live_url?: string;

  cover_image?: string;

  is_featured?: boolean;

  is_published?: boolean;

  project_type?: string;

  status?: string;

  start_date?: Date;

  end_date?: Date;

  display_order?: number;
}