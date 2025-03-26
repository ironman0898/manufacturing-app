import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    

    if (!orderId || isNaN(Number(orderId))) {
      return NextResponse.json({ error: 'Invalid or missing order ID' }, { status: 400 });
    }

    const order = await prisma.sales_orders.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        customers: true,
        sales_order_items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Serialize BigInt safely
    const serializedOrder = JSON.parse(
      JSON.stringify(order, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json(serializedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
