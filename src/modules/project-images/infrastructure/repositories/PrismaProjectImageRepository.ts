import { prisma } from "@/infrastructure/database/prisma";

import { ProjectImage } from "../../domain/entities/ProjectImage";
import { IProjectImageRepository } from "../../domain/repositories/IProjectImageRepository";

export class PrismaProjectImageRepository
  implements IProjectImageRepository
{
  async getAll(): Promise<
    ProjectImage[]
  > {
    return prisma.project_images.findMany({
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async create(
    data: Partial<ProjectImage>
  ): Promise<ProjectImage> {
    return prisma.project_images.create({
      data: {
        project_id:
          data.project_id,

        image_url:
          data.image_url!,

        title:
          data.title,

        display_order:
          data.display_order,
      },
    });
  }

  async update(
    id: number,
    data: Partial<ProjectImage>
  ): Promise<ProjectImage> {
    return prisma.project_images.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.project_images.delete({
      where: {
        id,
      },
    });
  }
}