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
    return prisma.profiles.update({
      where: {
        id,
      },
      data,
    });
  }
}