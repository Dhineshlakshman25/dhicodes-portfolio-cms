import { prisma } from "@/infrastructure/database/prisma";

import { LearningRoadmap } from "../../domain/entities/LearningRoadmap";
import { ILearningRoadmapRepository } from "../../domain/repositories/ILearningRoadmapRepository";

function parseDateSafely(val: unknown): Date | null {
  if (!val) return null;
  const d = new Date(val as any);
  return isNaN(d.getTime()) ? null : d;
}

export class PrismaLearningRoadmapRepository
  implements ILearningRoadmapRepository
{
  async getAll(): Promise<LearningRoadmap[]> {
    return prisma.learning_roadmap.findMany({
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async create(
    data: Partial<LearningRoadmap>
  ): Promise<LearningRoadmap> {
    return prisma.learning_roadmap.create({
      data: {
        technology: data.technology!,
        status: data.status,
        description: data.description,
        target_date: parseDateSafely(data.target_date),
        display_order: data.display_order,
      },
    });
  }

  async update(
    id: number,
    data: Partial<LearningRoadmap>
  ): Promise<LearningRoadmap> {
    return prisma.learning_roadmap.update({
      where: {
        id,
      },
      data: {
        technology: data.technology,
        status: data.status,
        description: data.description,
        target_date:
          data.target_date !== undefined
            ? parseDateSafely(data.target_date)
            : undefined,
        display_order: data.display_order,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.learning_roadmap.delete({
      where: {
        id,
      },
    });
  }
}