import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    // Aggregate order counts for each stage and status
    const stageStatusCounts = await prisma.sales_orders.groupBy({
      by: ['current_stage', 'stage_status'],
      _count: { _all: true },
    });

    // Total order amount
    const totalAmount = await prisma.sales_orders.aggregate({
      _sum: { amount: true },
    });

    // Overall status summary
    const overallStatusCounts = await prisma.sales_orders.groupBy({
      by: ['stage_status'],
      _count: { _all: true },
    });

    return NextResponse.json({
      stageStatusCounts,
      totalAmount: totalAmount._sum.amount || 0,
      overallStatusCounts,
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
  }
}
