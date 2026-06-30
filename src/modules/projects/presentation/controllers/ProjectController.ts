import { NextResponse } from "next/server";

import { GetProjectsUseCase } from "../../application/use-cases/GetProjectsUseCase";
import { GetProjectBySlugUseCase } from "../../application/use-cases/GetProjectBySlugUseCase";
import { CreateProjectUseCase } from "../../application/use-cases/CreateProjectUseCase";
import { UpdateProjectUseCase } from "../../application/use-cases/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../application/use-cases/DeleteProjectUseCase";

import { UpdateProjectDto } from "../../application/dto/UpdateProjectDto";

export class ProjectController {
  async get() {
    const data =
      await new GetProjectsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async getBySlug(
    slug: string
  ) {
    const data =
      await new GetProjectBySlugUseCase().execute(
        slug
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateProjectUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateProjectDto & {
      id: string;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateProjectUseCase().execute(
        id,
        payload
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async delete(
    id: string
  ) {
    await new DeleteProjectUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Project deleted successfully",
    });
  }
}