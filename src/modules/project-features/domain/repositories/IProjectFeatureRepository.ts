import { ProjectFeature } from "../entities/ProjectFeature";

export interface IProjectFeatureRepository {
  getAll(): Promise<ProjectFeature[]>;

  create(
    data: Partial<ProjectFeature>
  ): Promise<ProjectFeature>;

  update(
    id: number,
    data: Partial<ProjectFeature>
  ): Promise<ProjectFeature>;

  delete(
    id: number
  ): Promise<void>;
}