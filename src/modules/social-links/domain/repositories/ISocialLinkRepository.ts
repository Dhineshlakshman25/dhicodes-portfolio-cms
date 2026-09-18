import { SocialLink } from "../entities/SocialLink";

export interface ISocialLinkRepository {
  getAll(): Promise<SocialLink[]>;
  getAllActive(): Promise<SocialLink[]>;

  create(
    data: Partial<SocialLink>
  ): Promise<SocialLink>;

  update(
    id: number,
    data: Partial<SocialLink>
  ): Promise<SocialLink>;

  delete(
    id: number
  ): Promise<void>;
}