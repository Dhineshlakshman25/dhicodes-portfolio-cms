import { Experience } from "../entities/Experience";

export interface IExperienceRepository {
  getAll(): Promise<Experience[]>;

  create(
    data: Partial<Experience>
  ): Promise<Experience>;

  update(
    id: number,
    data: Partial<Experience>
  ): Promise<Experience>;

  delete(
    id: number
  ): Promise<void>;
}