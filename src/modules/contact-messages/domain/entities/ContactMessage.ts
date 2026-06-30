export interface ContactMessage {
  id: number;

  name?: string | null;

  email?: string | null;

  phone?: string | null;

  subject?: string | null;

  message?: string | null;

  is_read?: boolean | null;

  created_at?: Date | null;
}