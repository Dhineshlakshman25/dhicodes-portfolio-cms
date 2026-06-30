import { prisma } from "@/infrastructure/database/prisma";

import { Certification } from "../../domain/entities/Certification";
import { ICertificationRepository } from "../../domain/repositories/ICertificationRepository";

export class PrismaCertificationRepository
  implements ICertificationRepository
{
  async getAll(): Promise<
    Certification[]
  > {
    return prisma.certifications.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  async create(
    data: Partial<Certification>
  ): Promise<Certification> {
    return prisma.certifications.create({
      data: {
        title: data.title!,

        issuer: data.issuer,

        issue_date:
          data.issue_date
            ? new Date(
                data.issue_date
              )
            : null,

        credential_id:
          data.credential_id,

        credential_url:
          data.credential_url,

        certificate_image:
          data.certificate_image,
      },
    });
  }

  async update(
    id: number,
    data: Partial<Certification>
  ): Promise<Certification> {
    return prisma.certifications.update({
      where: {
        id,
      },
      data: {
        ...data,

        issue_date:
          data.issue_date
            ? new Date(
                data.issue_date
              )
            : undefined,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.certifications.delete({
      where: {
        id,
      },
    });
  }
}