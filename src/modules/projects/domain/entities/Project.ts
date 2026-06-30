export interface Project {
  id: string;

  title: string;

  slug: string;

  short_description?: string | null;

  full_description?: string | null;

  github_url?: string | null;

  live_url?: string | null;

  cover_image?: string | null;

  is_featured?: boolean | null;

  is_published?: boolean | null;

  project_type?: string | null;

  status?: string | null;

  start_date?: Date | null;

  end_date?: Date | null;

  display_order?: number | null;
}