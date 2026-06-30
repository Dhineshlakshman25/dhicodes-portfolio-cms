export interface UpdateProfileDto {
  name?: string;

  title?: string;
  bio?: string;

  avatar_url?: string;
  resume_url?: string;

  location?: string;

  email?: string;
  phone?: string;
  alternate_phone?: string;

  tagline?: string;
  cover_image_url?: string;

  years_experience?: number;
}