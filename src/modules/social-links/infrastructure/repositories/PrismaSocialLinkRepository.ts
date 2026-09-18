import { prisma } from "@/infrastructure/database/prisma";

import { SocialLink } from "../../domain/entities/SocialLink";
import { ISocialLinkRepository } from "../../domain/repositories/ISocialLinkRepository";

export class PrismaSocialLinkRepository
  implements ISocialLinkRepository
{
  async getAll(): Promise<
    SocialLink[]
  > {
    return prisma.social_links.findMany({
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async getAllActive(): Promise<
    SocialLink[]
  > {
    return prisma.social_links.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async create(
    data: Partial<SocialLink>
  ): Promise<SocialLink> {
    return prisma.social_links.create({
      data: {
        platform: data.platform!,
        url: data.url!,
        icon: data.icon,
        display_order:
          data.display_order,
        is_active:
          data.is_active,
      },
    });
  }

  async update(
    id: number,
    data: Partial<SocialLink>
  ): Promise<SocialLink> {
    const {
      id: _id,
      created_at: _cat,
      updated_at: _uat,
      ...cleanData
    } = data as any;

    return prisma.social_links.update({
      where: {
        id,
      },
      data: {
        ...cleanData,
        display_order:
          cleanData.display_order !== undefined
            ? Number(cleanData.display_order)
            : undefined,
        is_active:
          cleanData.is_active !== undefined
            ? Boolean(cleanData.is_active)
            : undefined,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.social_links.delete({
      where: {
        id,
      },
    });
  }
}