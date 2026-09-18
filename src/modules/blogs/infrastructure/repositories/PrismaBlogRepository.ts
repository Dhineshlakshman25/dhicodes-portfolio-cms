import { prisma } from "@/infrastructure/database/prisma";

import { Blog } from "../../domain/entities/Blog";
import { IBlogRepository } from "../../domain/repositories/IBlogRepository";

export class PrismaBlogRepository
  implements IBlogRepository
{
  async getAll(): Promise<Blog[]> {
    return prisma.blogs.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getAllPublished(): Promise<Blog[]> {
    return prisma.blogs.findMany({
      where: {
        is_published: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getBySlug(slug: string): Promise<Blog | null> {
    return prisma.blogs.findUnique({
      where: {
        slug,
      },
    });
  }

  async getBySlugPublished(slug: string): Promise<Blog | null> {
    return prisma.blogs.findFirst({
      where: {
        slug,
        is_published: true,
      },
    });
  }

  async create(
    data: Partial<Blog>
  ): Promise<Blog> {
    return prisma.blogs.create({
      data: {
        title: data.title!,
        slug: data.slug!,
        excerpt: data.excerpt,
        content: data.content,
        cover_image: data.cover_image,
        is_published: data.is_published,
        published_at: data.published_at,
      },
    });
  }

  async update(
    id: number,
    data: Partial<Blog>
  ): Promise<Blog> {
    const {
      id: _id,
      created_at: _cat,
      updated_at: _uat,
      ...cleanData
    } = data as any;

    return prisma.blogs.update({
      where: {
        id,
      },
      data: {
        ...cleanData,
        is_published:
          cleanData.is_published !== undefined
            ? Boolean(cleanData.is_published)
            : undefined,
        published_at:
          cleanData.published_at
            ? new Date(cleanData.published_at)
            : cleanData.published_at === null
            ? null
            : undefined,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.blogs.delete({
      where: {
        id,
      },
    });
  }
}