import { Skill } from "../entities/Skill";

export interface ISkillRepository {
  getAll(): Promise<Skill[]>;

  create(
    data: Partial<Skill>
  ): Promise<Skill>;

  update(
    id: number,
    data: Partial<Skill>
  ): Promise<Skill>;

  delete(
    id: number
  ): Promise<void>;
}