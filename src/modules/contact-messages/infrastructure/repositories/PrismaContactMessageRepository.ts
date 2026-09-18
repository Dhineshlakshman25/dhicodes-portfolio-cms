import { prisma } from "@/infrastructure/database/prisma";

import { ContactMessage } from "../../domain/entities/ContactMessage";
import { IContactMessageRepository } from "../../domain/repositories/IContactMessageRepository";

export class PrismaContactMessageRepository
  implements IContactMessageRepository
{
  async getAll(): Promise<ContactMessage[]> {
    return prisma.contact_messages.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async create(
    data: Partial<ContactMessage>
  ): Promise<ContactMessage> {
    return prisma.contact_messages.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });
  }

  async update(
    id: number,
    data: Partial<ContactMessage>
  ): Promise<ContactMessage> {
    const {
      id: _id,
      created_at: _cat,
      ...cleanData
    } = data as any;

    return prisma.contact_messages.update({
      where: {
        id,
      },
      data: {
        ...cleanData,
        is_read:
          cleanData.is_read !== undefined
            ? Boolean(cleanData.is_read)
            : undefined,
      },
    });
  }

  async delete(
    id: number
  ): Promise<void> {
    await prisma.contact_messages.delete({
      where: {
        id,
      },
    });
  }
}