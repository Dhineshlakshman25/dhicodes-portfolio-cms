import { NextResponse } from "next/server";

import { GetCertificationsUseCase } from "../../application/use-cases/GetCertificationsUseCase";
import { CreateCertificationUseCase } from "../../application/use-cases/CreateCertificationUseCase";
import { UpdateCertificationUseCase } from "../../application/use-cases/UpdateCertificationUseCase";
import { DeleteCertificationUseCase } from "../../application/use-cases/DeleteCertificationUseCase";

import { UpdateCertificationDto } from "../../application/dto/UpdateCertificationDto";

export class CertificationController {
  async get() {
    const data =
      await new GetCertificationsUseCase().execute();

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
      await new CreateCertificationUseCase().execute(
        body as never
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }

  async update(
    body: UpdateCertificationDto & {
      id: number;
    }
  ) {
    const { id, ...payload } =
      body;

    const data =
      await new UpdateCertificationUseCase().execute(
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
    await new DeleteCertificationUseCase().execute(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Certification deleted successfully",
    });
  }
}