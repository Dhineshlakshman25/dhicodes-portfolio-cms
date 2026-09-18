import { prisma } from "@/infrastructure/database/prisma";

import { Theme } from "../../domain/entities/Theme";
import { IThemeRepository } from "../../domain/repositories/IThemeRepository";

export class PrismaThemeRepository
  implements IThemeRepository
{
  async getAll(): Promise<Theme[]> {
    return prisma.themes.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getAllActive(): Promise<Theme[]> {
    return prisma.themes.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async create(
    data: Partial<Theme>
  ): Promise<Theme> {
    const id = data.id || crypto.randomUUID();
    const slug =
      data.slug ||
      data.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      id;

    return prisma.themes.create({
      data: {
        id,
        name: data.name!,
        slug,

        description:
          data.description,

        primary_color:
          data.primary_color,

        secondary_color:
          data.secondary_color,

        accent_color:
          data.accent_color,

        background_color:
          data.background_color,

        surface_color:
          data.surface_color,

        text_color:
          data.text_color,

        font_family:
          data.font_family,

        preview_image:
          data.preview_image,

        is_default:
          data.is_default,

        is_active:
          data.is_active,
      },
    });
  }

  async update(
    id: string,
    data: Partial<Theme>
  ): Promise<Theme> {
    const {
      id: _id,
      created_at: _cat,
      updated_at: _uat,
      ...cleanData
    } = data as any;

    if (cleanData.is_default) {
      // Unset default on others
      await prisma.themes.updateMany({
        where: { id: { not: id } },
        data: { is_default: false },
      });

      // Synchronize with site_settings.active_theme_id
      const siteSettings = await prisma.site_settings.findFirst();
      if (siteSettings) {
        await prisma.site_settings.update({
          where: { id: siteSettings.id },
          data: { active_theme_id: id },
        });
      }
    }

    return prisma.themes.update({
      where: {
        id,
      },
      data: {
        ...cleanData,
        is_default:
          cleanData.is_default !== undefined
            ? Boolean(cleanData.is_default)
            : undefined,
        is_active:
          cleanData.is_active !== undefined
            ? Boolean(cleanData.is_active)
            : undefined,
      },
    });
  }

  async delete(
    id: string
  ): Promise<void> {
    await prisma.themes.delete({
      where: {
        id,
      },
    });
  }
}