import { Education } from "../entities/Education";

export interface IEducationRepository {
  getAll(): Promise<Education[]>;

  create(
    data: Partial<Education>
  ): Promise<Education>;

  update(
    id: number,
    data: Partial<Education>
  ): Promise<Education>;

  delete(
    id: number
  ): Promise<void>;
}