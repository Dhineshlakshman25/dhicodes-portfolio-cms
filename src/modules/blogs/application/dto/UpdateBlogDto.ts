export interface UpdateBlogDto {
  title?: string;

  slug?: string;

  excerpt?: string;

  content?: string;

  cover_image?: string;

  is_published?: boolean;

  published_at?: Date;
}