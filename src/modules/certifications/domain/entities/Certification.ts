export interface Certification {
  id: number;

  title: string;

  issuer?: string | null;

  issue_date?: Date | null;

  credential_id?: string | null;

  credential_url?: string | null;

  certificate_image?: string | null;
}