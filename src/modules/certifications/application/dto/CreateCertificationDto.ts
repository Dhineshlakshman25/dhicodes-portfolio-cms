export interface CreateCertificationDto {
  title: string;

  issuer?: string;

  issue_date?: Date;

  credential_id?: string;

  credential_url?: string;

  certificate_image?: string;
}