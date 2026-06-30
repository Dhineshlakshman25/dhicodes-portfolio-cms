export interface Blog {
  id: number;

  title: string;

  slug: string;

  excerpt?: string | null;

  content?: string | null;

  cover_image?: string | null;

  is_published?: boolean | null;

  published_at?: Date | null;

  created_at?: Date | null;

  updated_at?: Date | null;
}