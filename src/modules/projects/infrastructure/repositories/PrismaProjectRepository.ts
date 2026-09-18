import { prisma } from "@/infrastructure/database/prisma";

import { Project } from "../../domain/entities/Project";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";

export class PrismaProjectRepository
  implements IProjectRepository
{
  async getAll(): Promise<Project[]> {
    return prisma.projects.findMany({
      include: {
        project_features: true,
        project_images: {
          orderBy: {
            display_order: "asc",
          },
        },
        project_skills: {
          include: {
            skills: true,
          },
        },
      },
      orderBy: {
        display_order: "asc",
      },
    }) as unknown as Promise<Project[]>;
  }

  async getBySlug(
    slug: string
  ): Promise<Project | null> {
    return prisma.projects.findUnique({
      where: {
        slug,
      },
      include: {
        project_features: true,
        project_images: {
          orderBy: {
            display_order: "asc",
          },
        },
        project_skills: {
          include: {
            skills: true,
          },
        },
      },
    }) as unknown as Promise<Project | null>;
  }

  async create(
    data: Partial<Project>
  ): Promise<Project> {
    const id = data.id || crypto.randomUUID();
    const slug =
      data.slug ||
      data.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      id;

    return prisma.projects.create({
      data: {
        id,
        title: data.title!,
        slug,

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
          Boolean(data.is_featured),

        is_published:
          Boolean(data.is_published ?? true),

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
          data.display_order !== undefined
            ? Number(data.display_order)
            : 0,
      },
    });
  }

  async update(
    id: string,
    data: Partial<Project>
  ): Promise<Project> {
    const {
      id: _id,
      created_at: _cat,
      updated_at: _uat,
      project_features: _pf,
      project_images: _pi,
      project_skills: _ps,
      ...cleanData
    } = data as any;

    return prisma.projects.update({
      where: {
        id,
      },
      data: {
        ...cleanData,

        is_featured:
          cleanData.is_featured !== undefined
            ? Boolean(cleanData.is_featured)
            : undefined,

        is_published:
          cleanData.is_published !== undefined
            ? Boolean(cleanData.is_published)
            : undefined,

        display_order:
          cleanData.display_order !== undefined
            ? Number(cleanData.display_order)
            : undefined,

        start_date:
          cleanData.start_date
            ? new Date(
                cleanData.start_date
              )
            : cleanData.start_date === null
            ? null
            : undefined,

        end_date:
          cleanData.end_date
            ? new Date(
                cleanData.end_date
              )
            : cleanData.end_date === null
            ? null
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