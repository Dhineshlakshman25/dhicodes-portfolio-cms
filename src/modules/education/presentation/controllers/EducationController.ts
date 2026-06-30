import { NextResponse } from "next/server";

import { GetEducationsUseCase } from "../../application/use-cases/GetEducationsUseCase";
import { CreateEducationUseCase } from "../../application/use-cases/CreateEducationUseCase";
import { UpdateEducationUseCase } from "../../application/use-cases/UpdateEducationUseCase";
import { DeleteEducationUseCase } from "../../application/use-cases/DeleteEducationUseCase";

import { UpdateEducationDto } from "../../application/dto/UpdateEducationDto";

export class EducationController {
  async get() {
    const data =
      await new GetEducationsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<
      string,
      unknown
    >
  ) {
    const data =
      await new CreateEducationUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateEducationDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateEducationUseCase().execute(
        id,
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
    await new DeleteEducationUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Education deleted successfully",
    });
  }
}