import { NextResponse } from "next/server";

import { GetProjectsUseCase } from "../../application/use-cases/GetProjectsUseCase";
import { GetPublishedProjectsUseCase } from "../../application/use-cases/GetPublishedProjectsUseCase";
import { GetProjectBySlugUseCase } from "../../application/use-cases/GetProjectBySlugUseCase";
import { GetPublishedProjectBySlugUseCase } from "../../application/use-cases/GetPublishedProjectBySlugUseCase";
import { CreateProjectUseCase } from "../../application/use-cases/CreateProjectUseCase";
import { UpdateProjectUseCase } from "../../application/use-cases/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../application/use-cases/DeleteProjectUseCase";

import { UpdateProjectDto } from "../../application/dto/UpdateProjectDto";

export class ProjectController {
  async get() {
    const data = await new GetProjectsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async getPublished() {
    const data = await new GetPublishedProjectsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async getBySlug(slug: string) {
    const data = await new GetProjectBySlugUseCase().execute(slug);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async getPublishedBySlug(slug: string) {
    const data = await new GetPublishedProjectBySlugUseCase().execute(slug);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(body: Record<string, unknown>) {
    try {
      if (!body || !body.title) {
        return NextResponse.json(
          {
            success: false,
            message: "Project title is required",
          },
          {
            status: 400,
          }
        );
      }

      const data = await new CreateProjectUseCase().execute(body as never);

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "A project with this slug already exists. Please choose a different slug.",
          },
          {
            status: 409,
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: err?.message || "Failed to create project",
        },
        {
          status: 500,
        }
      );
    }
  }

  async update(
    body: UpdateProjectDto & {
      id: string;
    }
  ) {
    try {
      const { id, ...payload } = body;

      const data = await new UpdateProjectUseCase().execute(id, payload);

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "A project with this slug already exists. Please choose a different slug.",
          },
          {
            status: 409,
          }
        );
      }
      if (err?.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            message: "Project not found",
          },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: err?.message || "Failed to update project",
        },
        {
          status: 500,
        }
      );
    }
  }

  async delete(id: string) {
    try {
      await new DeleteProjectUseCase().execute(id);

      return NextResponse.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (err: any) {
      if (err?.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            message: "Project not found",
          },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: err?.message || "Failed to delete project",
        },
        {
          status: 500,
        }
      );
    }
  }
}