import { NextResponse } from "next/server";

import { GetBlogsUseCase } from "../../application/use-cases/GetBlogsUseCase";
import { CreateBlogUseCase } from "../../application/use-cases/CreateBlogUseCase";
import { UpdateBlogUseCase } from "../../application/use-cases/UpdateBlogUseCase";
import { DeleteBlogUseCase } from "../../application/use-cases/DeleteBlogUseCase";

import { UpdateBlogDto } from "../../application/dto/UpdateBlogDto";

export class BlogController {
  async get() {
    const data =
      await new GetBlogsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateBlogUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateBlogDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateBlogUseCase().execute(
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
    await new DeleteBlogUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Blog deleted successfully",
    });
  }
}