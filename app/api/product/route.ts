import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const materials = await prisma.mattresstype.findMany(); // Fetch all rows
    return NextResponse.json(materials, { status: 200 });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
