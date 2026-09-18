import { prisma } from "@/infrastructure/database/prisma";

import { Profile } from "../../domain/entities/Profile";
import { IProfileRepository } from "../../domain/repositories/IProfileRepository";

export class PrismaProfileRepository
  implements IProfileRepository
{
  async findProfile(): Promise<Profile | null> {
    return prisma.profiles.findFirst();
  }

  async createProfile(
    data: Partial<Profile>
  ): Promise<Profile> {
    return prisma.profiles.create({
      data: {
        id: data.id!,
        name: data.name!,

        title: data.title,
        bio: data.bio,

        avatar_url: data.avatar_url,
        resume_url: data.resume_url,

        location: data.location,

        email: data.email,
        phone: data.phone,
        alternate_phone:
          data.alternate_phone,

        tagline: data.tagline,

        cover_image_url:
          data.cover_image_url,

        years_experience:
          data.years_experience,
      },
    });
  }

  async updateProfile(
    id: string,
    data: Partial<Profile>
  ): Promise<Profile> {
    const existing = await prisma.profiles.findFirst();
    const targetId = existing?.id || id || "profile-1";
    const {
      id: _id,
      created_at: _cat,
      updated_at: _uat,
      ...cleanData
    } = data as any;

    const payload = {
      ...cleanData,
      years_experience:
        cleanData.years_experience !== undefined
          ? Number(cleanData.years_experience)
          : undefined,
    };

    return prisma.profiles.upsert({
      where: {
        id: targetId,
      },
      update: payload,
      create: {
        id: targetId,
        name: cleanData.name || "Portfolio Owner",
        ...payload,
      },
    });
  }
}