import { NextResponse } from "next/server";

import { GetBlogsUseCase } from "../../application/use-cases/GetBlogsUseCase";
import { GetBlogBySlugUseCase } from "../../application/use-cases/GetBlogBySlugUseCase";
import { GetPublishedBlogsUseCase } from "../../application/use-cases/GetPublishedBlogsUseCase";
import { GetPublishedBlogBySlugUseCase } from "../../application/use-cases/GetPublishedBlogBySlugUseCase";
import { CreateBlogUseCase } from "../../application/use-cases/CreateBlogUseCase";
import { UpdateBlogUseCase } from "../../application/use-cases/UpdateBlogUseCase";
import { DeleteBlogUseCase } from "../../application/use-cases/DeleteBlogUseCase";

import { UpdateBlogDto } from "../../application/dto/UpdateBlogDto";

export class BlogController {
  async get() {
    const data = await new GetBlogsUseCase().execute();
    return NextResponse.json({
      success: true,
      data,
    });
  }

  async getPublished() {
    const data = await new GetPublishedBlogsUseCase().execute();
    return NextResponse.json({
      success: true,
      data,
    });
  }

  async getBySlug(slug: string) {
    const data = await new GetBlogBySlugUseCase().execute(slug);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
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
    const data = await new GetPublishedBlogBySlugUseCase().execute(slug);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
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
            message: "Title is required",
          },
          {
            status: 400,
          }
        );
      }

      const data = await new CreateBlogUseCase().execute(body as never);

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "A blog with this slug already exists. Please change the slug.",
          },
          {
            status: 409,
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: err?.message || "Failed to create blog",
        },
        {
          status: 500,
        }
      );
    }
  }

  async update(
    body: UpdateBlogDto & {
      id: number;
    }
  ) {
    try {
      const { id, ...payload } = body;

      const data = await new UpdateBlogUseCase().execute(
        Number(id),
        payload
      );

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            message: "A blog with this slug already exists. Please change the slug.",
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
            message: "Blog not found",
          },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: err?.message || "Failed to update blog",
        },
        {
          status: 500,
        }
      );
    }
  }

  async delete(id: number) {
    try {
      await new DeleteBlogUseCase().execute(id);

      return NextResponse.json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (err: any) {
      if (err?.code === "P2025") {
        return NextResponse.json(
          {
            success: false,
            message: "Blog not found",
          },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: err?.message || "Failed to delete blog",
        },
        {
          status: 500,
        }
      );
    }
  }
}