export interface ProjectImage {
  id: number;

  project_id?: string | null;

  image_url: string;

  title?: string | null;

  display_order?: number | null;
}