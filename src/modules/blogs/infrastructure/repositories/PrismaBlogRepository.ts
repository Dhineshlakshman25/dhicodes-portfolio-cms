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
    return prisma.blogs.update({
      where: {
        id,
      },
      data,
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