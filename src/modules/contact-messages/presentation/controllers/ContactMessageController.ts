import { NextResponse } from "next/server";

import { GetContactMessagesUseCase } from "../../application/use-cases/GetContactMessagesUseCase";
import { CreateContactMessageUseCase } from "../../application/use-cases/CreateContactMessageUseCase";
import { UpdateContactMessageUseCase } from "../../application/use-cases/UpdateContactMessageUseCase";
import { DeleteContactMessageUseCase } from "../../application/use-cases/DeleteContactMessageUseCase";

import { UpdateContactMessageDto } from "../../application/dto/UpdateContactMessageDto";

export class ContactMessageController {
  async get() {
    const data =
      await new GetContactMessagesUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateContactMessageUseCase().execute(
        body as never
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully.",
        data,
      },
      {
        status: 201,
      }
    );
  }

  async update(
    body: UpdateContactMessageDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateContactMessageUseCase().execute(
        Number(id),
        payload
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async delete(
    id: number
  ) {
    await new DeleteContactMessageUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Contact message deleted successfully.",
    });
  }
}