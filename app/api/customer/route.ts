import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const customers = await prisma.customers.findMany({
      select: {
        email: true,
        name: true,
        id: true,
        phone_number: true,
      },
    });
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Displaying customers:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, gstin_no } = body;
    await prisma.customers.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        phone_number: phone,
        gstin_no,
      },
    });
    return NextResponse.json(
      { success: true, message: "Customer created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error);
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
      return NextResponse.json(
        { error: "Duplicate value detected for a unique field." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
