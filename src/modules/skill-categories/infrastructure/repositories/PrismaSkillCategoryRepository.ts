import { prisma } from "@/infrastructure/database/prisma";

import { SkillCategory } from "../../domain/entities/SkillCategory";
import { ISkillCategoryRepository } from "../../domain/repositories/ISkillCategoryRepository";

export class PrismaSkillCategoryRepository
  implements ISkillCategoryRepository
{
  async getAll(): Promise<
    SkillCategory[]
  > {
    return prisma.skill_categories.findMany({
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async create(
    data: Partial<SkillCategory>
  ): Promise<SkillCategory> {
    return prisma.skill_categories.create({
      data: {
        name: data.name!,
        display_order:
          data.display_order,
      },
    });
  }

  async update(
    id: number,
    data: Partial<SkillCategory>
  ): Promise<SkillCategory> {
    const {
      id: _id,
      skills: _s,
      ...cleanData
    } = data as any;

    return prisma.skill_categories.update({
      where: {
        id,
      },
      data: {
        ...cleanData,
        display_order:
          cleanData.display_order !== undefined
            ? Number(cleanData.display_order)
            : undefined,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.skill_categories.delete({
      where: {
        id,
      },
    });
  }
}