import { LearningRoadmap } from "../entities/LearningRoadmap";

export interface ILearningRoadmapRepository {
  getAll(): Promise<LearningRoadmap[]>;

  create(
    data: Partial<LearningRoadmap>
  ): Promise<LearningRoadmap>;

  update(
    id: number,
    data: Partial<LearningRoadmap>
  ): Promise<LearningRoadmap>;

  delete(
    id: number
  ): Promise<void>;
}