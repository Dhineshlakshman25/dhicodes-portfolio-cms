import { prisma } from "@/infrastructure/database/prisma";

import { ProjectFeature } from "../../domain/entities/ProjectFeature";
import { IProjectFeatureRepository } from "../../domain/repositories/IProjectFeatureRepository";

export class PrismaProjectFeatureRepository
  implements IProjectFeatureRepository
{
  async getAll(): Promise<
    ProjectFeature[]
  > {
    return prisma.project_features.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async create(
    data: Partial<ProjectFeature>
  ): Promise<ProjectFeature> {
    return prisma.project_features.create({
      data: {
        project_id:
          data.project_id,

        feature:
          data.feature!,
      },
    });
  }

  async update(
    id: number,
    data: Partial<ProjectFeature>
  ): Promise<ProjectFeature> {
    return prisma.project_features.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.project_features.delete({
      where: {
        id,
      },
    });
  }
}