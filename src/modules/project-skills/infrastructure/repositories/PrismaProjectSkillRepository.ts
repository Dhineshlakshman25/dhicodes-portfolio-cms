import { prisma } from "@/infrastructure/database/prisma";

import { ProjectSkill } from "../../domain/entities/ProjectSkill";
import { IProjectSkillRepository } from "../../domain/repositories/IProjectSkillRepository";

export class PrismaProjectSkillRepository
  implements IProjectSkillRepository
{
  async getAll(): Promise<
    ProjectSkill[]
  > {
    return prisma.project_skills.findMany({
      include: {
        projects: true,
        skills: true,
      },
    });
  }

  async create(
    data: Partial<ProjectSkill>
  ): Promise<ProjectSkill> {
    return prisma.project_skills.create({
      data: {
        project_id:
          data.project_id!,

        skill_id:
          data.skill_id!,

        usage_type:
          data.usage_type,
      },
    });
  }

  async update(
    project_id: string,
    skill_id: number,
    data: Partial<ProjectSkill>
  ): Promise<ProjectSkill> {
    return prisma.project_skills.update({
      where: {
        project_id_skill_id: {
          project_id,
          skill_id,
        },
      },
      data: {
        usage_type:
          data.usage_type,
      },
    });
  }

  async delete(
    project_id: string,
    skill_id: number
  ): Promise<void> {
    await prisma.project_skills.delete({
      where: {
        project_id_skill_id: {
          project_id,
          skill_id,
        },
      },
    });
  }
}