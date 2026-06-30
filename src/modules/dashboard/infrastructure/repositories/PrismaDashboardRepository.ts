import { prisma } from "@/infrastructure/database/prisma";

import { Dashboard } from "../../domain/entities/Dashboard";
import { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";

export class PrismaDashboardRepository
  implements IDashboardRepository
{
  async getDashboard(): Promise<Dashboard> {
    const [
      totalProjects,
      featuredProjects,

      totalSkills,
      featuredSkills,

      totalBlogs,
      publishedBlogs,

      totalMessages,
      unreadMessages,

      totalCertifications,

      totalExperience,

      totalEducation,

      totalLearningRoadmaps,

      activeTheme,

      siteSettings,
    ] = await Promise.all([
      prisma.projects.count(),

      prisma.projects.count({
        where: {
          is_featured: true,
        },
      }),

      prisma.skills.count(),

      prisma.skills.count({
        where: {
          is_featured: true,
        },
      }),

      prisma.blogs.count(),

      prisma.blogs.count({
        where: {
          is_published: true,
        },
      }),

      prisma.contact_messages.count(),

      prisma.contact_messages.count({
        where: {
          is_read: false,
        },
      }),

      prisma.certifications.count(),

      prisma.experience.count(),

      prisma.education.count(),

      prisma.learning_roadmap.count(),

      prisma.themes.findFirst({
        where: {
          is_default: true,
        },
      }),

      prisma.site_settings.findFirst(),
    ]);

    return {
      totalProjects,
      featuredProjects,

      totalSkills,
      featuredSkills,

      totalBlogs,
      publishedBlogs,

      totalMessages,
      unreadMessages,

      totalCertifications,

      totalExperience,

      totalEducation,

      totalLearningRoadmaps,

      activeTheme:
        activeTheme?.name ?? null,

      maintenanceMode:
        siteSettings?.maintenance_mode ??
        false,
    };
  }
}