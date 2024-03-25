import { Recipe } from "@prisma/client";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();

  console.log("🚀 ~ POST ~ task:", data);

  // req.body should contain form data how to read it

  // Get the contents of form data

  return NextResponse.json({ message: data });
}
