// src/app/api/test/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";

export async function GET() {
  const count = await prisma.users.count();

  return NextResponse.json({
    success: true,
    count,
  });
}