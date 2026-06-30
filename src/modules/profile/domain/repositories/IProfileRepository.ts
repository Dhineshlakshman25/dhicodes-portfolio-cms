import { Profile } from "../entities/Profile";

export interface IProfileRepository {
  findProfile(): Promise<Profile | null>;

  createProfile(
    data: Partial<Profile>
  ): Promise<Profile>;

  updateProfile(
    id: string,
    data: Partial<Profile>
  ): Promise<Profile>;
}