export interface Profile {
  id: string;
  name: string;

  title?: string | null;
  bio?: string | null;

  avatar_url?: string | null;
  resume_url?: string | null;

  location?: string | null;

  email?: string | null;
  phone?: string | null;
  alternate_phone?: string | null;

  tagline?: string | null;
  cover_image_url?: string | null;

  years_experience?: number | null;

  created_at?: Date | null;
  updated_at?: Date | null;
}