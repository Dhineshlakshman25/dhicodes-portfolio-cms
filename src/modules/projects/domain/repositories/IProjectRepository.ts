import { Project } from "../entities/Project";

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getAllPublished(): Promise<Project[]>;

  getBySlug(
    slug: string
  ): Promise<Project | null>;

  getBySlugPublished(
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