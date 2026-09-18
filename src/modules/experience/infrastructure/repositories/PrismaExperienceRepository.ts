import { prisma } from "@/infrastructure/database/prisma";

import { Experience } from "../../domain/entities/Experience";
import { IExperienceRepository } from "../../domain/repositories/IExperienceRepository";

function parseDateSafely(val: unknown): Date | null {
  if (!val) return null;
  const d = new Date(val as any);
  return isNaN(d.getTime()) ? null : d;
}

export class PrismaExperienceRepository
  implements IExperienceRepository
{
  async getAll(): Promise<
    Experience[]
  > {
    return prisma.experience.findMany({
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async create(
    data: Partial<Experience>
  ): Promise<Experience> {
    return prisma.experience.create({
      data: {
        company_name:
          data.company_name!,
        role: data.role!,

        start_date: parseDateSafely(data.start_date) || new Date(),

        end_date: parseDateSafely(data.end_date),

        description:
          data.description,

        employment_type:
          data.employment_type,

        location:
          data.location,

        company_logo:
          data.company_logo,

        tech_stack:
          data.tech_stack,

        is_current:
          data.is_current,

        display_order:
          data.display_order,
      },
    });
  }

  async update(
    id: number,
    data: Partial<Experience>
  ): Promise<Experience> {
    const {
      id: _id,
      created_at: _cat,
      ...cleanData
    } = data as any;

    return prisma.experience.update({
      where: {
        id,
      },
      data: {
        ...cleanData,

        is_current:
          cleanData.is_current !== undefined
            ? Boolean(cleanData.is_current)
            : undefined,

        display_order:
          cleanData.display_order !== undefined
            ? Number(cleanData.display_order)
            : undefined,

        start_date:
          cleanData.start_date !== undefined
            ? parseDateSafely(cleanData.start_date) || undefined
            : undefined,

        end_date:
          cleanData.end_date !== undefined
            ? parseDateSafely(cleanData.end_date)
            : undefined,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.experience.delete({
      where: {
        id,
      },
    });
  }
}