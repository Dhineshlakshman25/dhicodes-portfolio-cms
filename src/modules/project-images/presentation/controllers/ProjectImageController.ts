import { NextResponse } from "next/server";

import { GetProjectImagesUseCase } from "../../application/use-cases/GetProjectImagesUseCase";
import { CreateProjectImageUseCase } from "../../application/use-cases/CreateProjectImageUseCase";
import { UpdateProjectImageUseCase } from "../../application/use-cases/UpdateProjectImageUseCase";
import { DeleteProjectImageUseCase } from "../../application/use-cases/DeleteProjectImageUseCase";

import { UpdateProjectImageDto } from "../../application/dto/UpdateProjectImageDto";

export class ProjectImageController {
  async get() {
    const data =
      await new GetProjectImagesUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateProjectImageUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateProjectImageDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateProjectImageUseCase().execute(
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
    await new DeleteProjectImageUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Project Image deleted successfully",
    });
  }
}