import { ProjectSkill } from "../entities/ProjectSkill";

export interface IProjectSkillRepository {
  getAll(): Promise<ProjectSkill[]>;

  create(
    data: Partial<ProjectSkill>
  ): Promise<ProjectSkill>;

  update(
    project_id: string,
    skill_id: number,
    data: Partial<ProjectSkill>
  ): Promise<ProjectSkill>;

  delete(
    project_id: string,
    skill_id: number
  ): Promise<void>;
}