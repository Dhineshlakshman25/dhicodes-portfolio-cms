import { Project } from "../entities/Project";

export interface IProjectRepository {
  getAll(): Promise<Project[]>;

  getBySlug(
    slug: string
  ): Promise<Project | null>;

  create(
    data: Partial<Project>
  ): Promise<Project>;

  update(
    id: string,
    data: Partial<Project>
  ): Promise<Project>;

  delete(
    id: string
  ): Promise<void>;
}