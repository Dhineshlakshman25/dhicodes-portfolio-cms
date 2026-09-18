import { prisma } from "@/infrastructure/database/prisma";

import { SiteSettings } from "../../domain/entities/SiteSettings";
import { ISiteSettingsRepository } from "../../domain/repositories/ISiteSettingsRepository";

export class PrismaSiteSettingsRepository
  implements ISiteSettingsRepository
{
  async get(): Promise<SiteSettings | null> {
    return prisma.site_settings.findFirst();
  }

  async create(
    data: Partial<SiteSettings>
  ): Promise<SiteSettings> {
    return prisma.site_settings.create({
      data: {
        site_name: data.site_name,

        site_description:
          data.site_description,

        site_keywords:
          data.site_keywords,

        logo_url:
          data.logo_url,

        favicon_url:
          data.favicon_url,

        footer_text:
          data.footer_text,

        active_theme_id:
          data.active_theme_id,

        maintenance_mode:
          data.maintenance_mode,
      },
    });
  }

  async update(
    data: Partial<SiteSettings>
  ): Promise<SiteSettings> {
    const settings =
      await prisma.site_settings.findFirst();

    const cleanData = {
      site_name: data.site_name,
      site_description: data.site_description,
      site_keywords: data.site_keywords,
      logo_url: data.logo_url,
      favicon_url: data.favicon_url,
      footer_text: data.footer_text,
      active_theme_id: data.active_theme_id,
      maintenance_mode:
        data.maintenance_mode !== undefined
          ? Boolean(data.maintenance_mode)
          : undefined,
    };

    if (data.active_theme_id) {
      await prisma.themes.updateMany({
        data: { is_default: false },
      });
      await prisma.themes.updateMany({
        where: {
          OR: [
            { id: data.active_theme_id },
            { slug: data.active_theme_id },
          ],
        },
        data: { is_default: true, is_active: true },
      });
    }

    if (!settings) {
      return prisma.site_settings.create({
        data: cleanData,
      });
    }

    return prisma.site_settings.update({
      where: {
        id: settings.id,
      },
      data: cleanData,
    });
  }
}