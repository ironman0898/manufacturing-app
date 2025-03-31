"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SalesOrder {
  id: string;
  order_number: string;
  current_stage: string;
  stage_status: string;
}

const stages = [
  "Production",
  "Quilting",
  "Pasting",
  "QC",
  "Packing",
  "Dispatch",
];

export default function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/sales-orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateStage = async (id: string, currentStage: string, currentStatus: string) => {
    let newStage = currentStage;
    let newStatus = currentStatus === 'Pending' ? 'Processing' : 'Completed';

    if (currentStage !== 'Dispatch' && newStatus === 'Completed') {
      newStage = getNextStage(currentStage);
      newStatus = 'Pending';
    }

    await fetch('/api/sales-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, newStage, newStatus }),
    });

    alert('Order updated successfully!');
    fetchOrders();
  };

  const getNextStage = (stage: string) => {
    const index = stages.indexOf(stage);
    return stages[Math.min(index + 1, stages.length - 1)];
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {stages.map(stage => (
        <div key={stage} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-3 text-gray-700">{stage}</h2>
          {orders.filter(order => order.current_stage === stage).map(order => (
            <div key={order.id} className="p-3 mb-2 bg-gray-100 rounded-md">
              <Link href={`/salesorder/${order.id}`}>
              <h3 className="text-lg font-semibold">SO #: {order.order_number}</h3>
              </Link>
              <p className="text-gray-600">Status: <strong className={`text-${order.stage_status === 'Pending' ? 'red' : order.stage_status === 'Processing' ? 'yellow' : 'green'}-600`}>{order.stage_status}</strong></p>
              <div className="mt-2 flex gap-2">
                <button
                  className="py-1 px-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
                  onClick={() => updateStage(order.id, order.current_stage, order.stage_status)}
                  disabled={order.stage_status === 'Completed'}
                >
                  {order.stage_status === 'Pending' ? 'Process' : 'Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

