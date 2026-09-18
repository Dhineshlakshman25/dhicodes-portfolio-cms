import { prisma } from "@/infrastructure/database/prisma";

import { Education } from "../../domain/entities/Education";
import { IEducationRepository } from "../../domain/repositories/IEducationRepository";

function parseDateSafely(val: unknown): Date | null {
  if (!val) return null;
  const d = new Date(val as any);
  return isNaN(d.getTime()) ? null : d;
}

export class PrismaEducationRepository
  implements IEducationRepository
{
  async getAll(): Promise<
    Education[]
  > {
    return prisma.education.findMany({
      orderBy: {
        display_order: "asc",
      },
    });
  }

  async create(
    data: Partial<Education>
  ): Promise<Education> {
    return prisma.education.create({
      data: {
        institution_name:
          data.institution_name,

        degree: data.degree,

        field_of_study:
          data.field_of_study,

        start_date: parseDateSafely(data.start_date),

        end_date: parseDateSafely(data.end_date),

        grade: data.grade,

        description:
          data.description,

        logo_url:
          data.logo_url,

        display_order:
          data.display_order,
      },
    });
  }

  async update(
    id: number,
    data: Partial<Education>
  ): Promise<Education> {
    const {
      id: _id,
      created_at: _cat,
      ...cleanData
    } = data as any;

    return prisma.education.update({
      where: {
        id,
      },
      data: {
        ...cleanData,

        display_order:
          cleanData.display_order !== undefined
            ? Number(cleanData.display_order)
            : undefined,

        start_date:
          cleanData.start_date !== undefined
            ? parseDateSafely(cleanData.start_date)
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
    await prisma.education.delete({
      where: {
        id,
      },
    });
  }
}