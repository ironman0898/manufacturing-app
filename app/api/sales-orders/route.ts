import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(){
  try {
    const salesOrder = await prisma.sales_orders.findMany({
      include: {
        customers : {
          select : {name : true}
        }
      }
    })
    return NextResponse.json(salesOrder, { status: 200 });
  } catch (error) {
    console.error("Error creating sales order:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_number, order_receive_via, customer_id, items } = body;

    // Step 1: Create the sales order
    const salesOrder = await prisma.sales_orders.create({
      data: {
        order_number,
        order_receive_via,
        customer_id,
        created_at: new Date(),
        amount: items.reduce((acc: number, item: any) => acc + item.amount, 0), // Total amount calculation
        current_stage: "Production Pending",
      },
    });

    // Step 2: Insert items into sales_order_items table
    const salesOrderItems = await prisma.sales_order_items.createMany({
      data: items.map((item: any) => ({
        sales_order_id: salesOrder.id, // Link items to sales order
        product_name: item.product_name,
        size: item.size,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
    });

    return NextResponse.json({ success: true, salesOrder, salesOrderItems }, { status: 201 });
  } catch (error) {
    console.error("Error creating sales order:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
