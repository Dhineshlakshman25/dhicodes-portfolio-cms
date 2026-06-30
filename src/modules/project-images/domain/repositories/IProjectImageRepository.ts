import { ProjectImage } from "../entities/ProjectImage";

export interface IProjectImageRepository {
  getAll(): Promise<ProjectImage[]>;

  create(
    data: Partial<ProjectImage>
  ): Promise<ProjectImage>;

  update(
    id: number,
    data: Partial<ProjectImage>
  ): Promise<ProjectImage>;

  delete(
    id: number
  ): Promise<void>;
}