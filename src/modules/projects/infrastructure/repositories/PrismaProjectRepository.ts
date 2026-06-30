import { prisma } from "@/infrastructure/database/prisma";

import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";

export class PrismaProjectRepository
  implements IProjectRepository
{
  async getAll(): Promise<Project[]> {
    return prisma.projects.findMany({
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async getBySlug(
    slug: string
  ): Promise<Project | null> {
    return prisma.projects.findUnique({
      where: {
        slug,
      },
    });
  }

  async create(
    data: Partial<Project>
  ): Promise<Project> {
    return prisma.projects.create({
      data: {
        id: data.id!,
        title: data.title!,
        slug: data.slug!,

        short_description:
          data.short_description,

        full_description:
          data.full_description,

        github_url:
          data.github_url,

        live_url:
          data.live_url,

        cover_image:
          data.cover_image,

        is_featured:
          data.is_featured,

        is_published:
          data.is_published,

        project_type:
          data.project_type,

        status:
          data.status,

        start_date:
          data.start_date
            ? new Date(
                data.start_date
              )
            : null,

        end_date:
          data.end_date
            ? new Date(
                data.end_date
              )
            : null,

        display_order:
          data.display_order,
      },
    });
  }

  async update(
    id: string,
    data: Partial<Project>
  ): Promise<Project> {
    return prisma.projects.update({
      where: {
        id,
      },
      data: {
        ...data,

        start_date:
          data.start_date
            ? new Date(
                data.start_date
              )
            : undefined,

        end_date:
          data.end_date
            ? new Date(
                data.end_date
              )
            : undefined,
      },
    });
  }

  async delete(
    id: string
  ): Promise<void> {
    await prisma.projects.delete({
      where: {
        id,
      },
    });
  }
}