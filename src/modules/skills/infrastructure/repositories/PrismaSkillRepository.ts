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
          data.category_id,
        proficiency:
          data.proficiency,
        icon_url:
          data.icon_url,
        display_order:
          data.display_order,
        is_featured:
          data.is_featured,
      },
    });
  }

  async update(
    id: number,
    data: Partial<Skill>
  ): Promise<Skill> {
    return prisma.skills.update({
      where: {
        id,
      },
      data,
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