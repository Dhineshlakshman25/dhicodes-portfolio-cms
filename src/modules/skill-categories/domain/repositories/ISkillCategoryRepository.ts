import { SkillCategory } from "../entities/SkillCategory";

export interface ISkillCategoryRepository {
  getAll(): Promise<SkillCategory[]>;

  create(
    data: Partial<SkillCategory>
  ): Promise<SkillCategory>;

  update(
    id: number,
    data: Partial<SkillCategory>
  ): Promise<SkillCategory>;

  delete(
    id: number
  ): Promise<void>;
}