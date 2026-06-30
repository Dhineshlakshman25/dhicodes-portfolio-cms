import { NextResponse } from "next/server";

import { GetProjectFeaturesUseCase } from "../../application/use-cases/GetProjectFeaturesUseCase";
import { CreateProjectFeatureUseCase } from "../../application/use-cases/CreateProjectFeatureUseCase";
import { UpdateProjectFeatureUseCase } from "../../application/use-cases/UpdateProjectFeatureUseCase";
import { DeleteProjectFeatureUseCase } from "../../application/use-cases/DeleteProjectFeatureUseCase";

import { UpdateProjectFeatureDto } from "../../application/dto/UpdateProjectFeatureDto";

export class ProjectFeatureController {
  async get() {
    const data =
      await new GetProjectFeaturesUseCase().execute();

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
      await new CreateProjectFeatureUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateProjectFeatureDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateProjectFeatureUseCase().execute(
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
    await new DeleteProjectFeatureUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Project Feature deleted successfully",
    });
  }
}