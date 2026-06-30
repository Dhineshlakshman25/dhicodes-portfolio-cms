import { NextResponse } from "next/server";

import { UploadFileUseCase } from "../../application/use-cases/UploadFileUseCase";

export class UploadController {
  async upload(request: Request) {

    const formData = await request.formData();

    console.log("========== FORM DATA ==========");

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log("===============================");

    const file = formData.get("file") as File | null;

    console.log("FILE =>", file);

    const folder =
      (formData.get("folder") as string) ??
      "others";

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required.",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const data =
      await new UploadFileUseCase().execute(
        buffer,
        file.name.split(".")[0],
        folder,
        file.type
      );

    return NextResponse.json({
      success: true,
      data,
    });
  }
}