import { prisma } from "@/infrastructure/database/prisma";

import { Skill } from "../../domain/entities/Skill";
import { ISkillRepository } from "../../domain/repositories/ISkillRepository";

export class PrismaSkillRepository
  implements ISkillRepository
{
  async getAll(): Promise<Skill[]> {
    return prisma.skills.findMany({
      include: {
        skill_categories: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async create(
    data: Partial<Skill>
  ): Promise<Skill> {
    return prisma.skills.create({
      data: {
        name: data.name!,
        category_id:
          data.category_id ? Number(data.category_id) : null,
        proficiency:
          data.proficiency !== undefined ? Number(data.proficiency) : 80,
        icon_url:
          data.icon_url,
        display_order:
          data.display_order !== undefined ? Number(data.display_order) : 0,
        is_featured:
          Boolean(data.is_featured),
      },
    });
  }

  async update(
    id: number,
    data: Partial<Skill>
  ): Promise<Skill> {
    const {
      id: _id,
      skill_categories: _sc,
      project_skills: _ps,
      ...cleanData
    } = data as any;

    return prisma.skills.update({
      where: {
        id,
      },
      data: {
        ...cleanData,
        category_id:
          cleanData.category_id !== undefined
            ? cleanData.category_id
              ? Number(cleanData.category_id)
              : null
            : undefined,
        proficiency:
          cleanData.proficiency !== undefined
            ? Number(cleanData.proficiency)
            : undefined,
        display_order:
          cleanData.display_order !== undefined
            ? Number(cleanData.display_order)
            : undefined,
        is_featured:
          cleanData.is_featured !== undefined
            ? Boolean(cleanData.is_featured)
            : undefined,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.skills.delete({
      where: {
        id,
      },
    });
  }
}