import { prisma } from "@/infrastructure/database/prisma";

import { Education } from "../../domain/entities/Education";
import { IEducationRepository } from "../../domain/repositories/IEducationRepository";

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

        start_date:
          data.start_date
            ? new Date(
                data.start_date
              )
            : null,

        end_date:
          data.end_date
            ? new Date(
                data.end_date
              )
            : null,

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
    return prisma.education.update({
      where: {
        id,
      },
      data: {
        ...data,

        start_date:
          data.start_date
            ? new Date(
                data.start_date
              )
            : undefined,

        end_date:
          data.end_date
            ? new Date(
                data.end_date
              )
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