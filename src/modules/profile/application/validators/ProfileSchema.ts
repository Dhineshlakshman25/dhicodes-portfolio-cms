import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(2),

  title: z.string().optional(),

  bio: z.string().optional(),

  avatar_url: z.string().optional(),

  resume_url: z.string().optional(),

  location: z.string().optional(),

  email: z.string().email().optional(),

  phone: z.string().optional(),

  tagline: z.string().optional(),

  cover_image_url: z.string().optional(),

  years_experience: z.number().optional(),
});