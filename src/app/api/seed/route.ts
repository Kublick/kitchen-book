import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const category = await prisma.category.createMany({
    data: [
      { name: "Desayuno" },
      { name: "Comida" },
      { name: "Cena" },
      { name: "Postre" },
      { name: "Salsas" },
    ],
  });

  return NextResponse.json({ category });
}
