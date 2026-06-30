import { NextResponse } from "next/server";

import { GetLearningRoadmapsUseCase } from "../../application/use-cases/GetLearningRoadmapsUseCase";
import { CreateLearningRoadmapUseCase } from "../../application/use-cases/CreateLearningRoadmapUseCase";
import { UpdateLearningRoadmapUseCase } from "../../application/use-cases/UpdateLearningRoadmapUseCase";
import { DeleteLearningRoadmapUseCase } from "../../application/use-cases/DeleteLearningRoadmapUseCase";

import { UpdateLearningRoadmapDto } from "../../application/dto/UpdateLearningRoadmapDto";

export class LearningRoadmapController {
  async get() {
    const data =
      await new GetLearningRoadmapsUseCase().execute();

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async create(
    body: Record<string, unknown>
  ) {
    const data =
      await new CreateLearningRoadmapUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateLearningRoadmapDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateLearningRoadmapUseCase().execute(
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
    await new DeleteLearningRoadmapUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Learning roadmap deleted successfully.",
    });
  }
}