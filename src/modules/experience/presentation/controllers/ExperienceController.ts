import { NextResponse } from "next/server";

import { GetExperiencesUseCase } from "../../application/use-cases/GetExperiencesUseCase";
import { CreateExperienceUseCase } from "../../application/use-cases/CreateExperienceUseCase";
import { UpdateExperienceUseCase } from "../../application/use-cases/UpdateExperienceUseCase";
import { DeleteExperienceUseCase } from "../../application/use-cases/DeleteExperienceUseCase";

import { UpdateExperienceDto } from "../../application/dto/UpdateExperienceDto";

export class ExperienceController {
  async get() {
    const data =
      await new GetExperiencesUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateExperienceUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateExperienceDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateExperienceUseCase().execute(
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
    await new DeleteExperienceUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Experience deleted successfully",
    });
  }
}