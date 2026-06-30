export interface CreateProjectImageDto {
  project_id?: string;

  image_url: string;

  title?: string;

  display_order?: number;
}