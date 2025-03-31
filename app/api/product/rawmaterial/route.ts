import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const material = searchParams.get("material");
  if (material === undefined || material === null) {
    return NextResponse.json(
      { error: `Table is not supported.` },
      { status: 400 }
    );
  }
  try {
    let listOfRawMaterial;
    switch (material) {
      case "EcoBond":
        listOfRawMaterial = await prisma.ecoBondMaster.findMany({
          select: {
            material: true,
            id: true,
            unit: true,
            avilable_quantity: true,
          },
        });
        break;
      case "Velocity":
        listOfRawMaterial = await prisma.velocity.findMany({
          select: {
            material: true,
            id: true,
            unit: true,
            avilable_quantity: true,
          },
        });
        break;
      case "Velocity Plus":
        listOfRawMaterial = await prisma.velocity_plus.findMany({
          select: {
            material: true,
            id: true,
            unit: true,
            avilable_quantity: true,
          },
        });
        break;
      case "Delite":
        listOfRawMaterial = await prisma.delite.findMany({
          select: {
            material: true,
            id: true,
            unit: true,
            avilable_quantity: true,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: `Table is not supported.` },
          { status: 400 }
        );
    }

    return NextResponse.json(listOfRawMaterial, { status: 200 });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Parse request body
    const { material_id, quantity, materialTable } = await request.json();

    // Validate input
    if (
      !material_id ||
      typeof quantity !== "number" ||
      materialTable === null
    ) {
      return NextResponse.json(
        { error: "Invalid input. 'material_id' and 'quantity' are required." },
        { status: 400 }
      );
    }

    // Fetch the existing material
    let existingMaterial;
    switch (materialTable) {
      case "EcoBond":
        existingMaterial = await prisma.ecoBondMaster.findUnique({
          where: { id: material_id },
        });
        break;
      case "Velocity":
        existingMaterial = await prisma.velocity.findUnique({
          where: { id: material_id },
        });
        break;
      case "Velocity Plus":
        existingMaterial = await prisma.velocity_plus.findUnique({
          where: { id: material_id },
        });
        break;
      case "Delite":
        existingMaterial = await prisma.delite.findUnique({
          where: { id: material_id },
        });
        break;

      default:
        break;
    }

    if (!existingMaterial) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    // Update available_quantity field
    let updatedMaterial;
    switch (materialTable) {
      case 'EcoBond':
        updatedMaterial = await prisma.ecoBondMaster.update({
          where: { id: material_id },
          data: {
            avilable_quantity: (existingMaterial.avilable_quantity || 0) + quantity,
          },
        });
        break;
      case 'Velocity':
        updatedMaterial = await prisma.velocity.update({
          where: { id: material_id },
          data: {
            avilable_quantity: (existingMaterial.avilable_quantity || 0) + quantity,
          },
        });
        break;
      case 'Velocity Plus':
        updatedMaterial = await prisma.velocity_plus.update({
          where: { id: material_id },
          data: {
            avilable_quantity: (existingMaterial.avilable_quantity || 0) + quantity,
          },
        });
        break;
      case 'Delite':
        updatedMaterial = await prisma.delite.update({
          where: { id: material_id },
          data: {
            avilable_quantity: (existingMaterial.avilable_quantity || 0) + quantity,
          },
        });
        break;
    
      default:
        break;
    }

    return NextResponse.json({
      message: "Available quantity updated successfully",
      updatedMaterial,
    });
  } catch (error) {
    console.error("Error updating available quantity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
