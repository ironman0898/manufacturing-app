"use client";
import React, { useEffect, useState } from "react";

interface SalesOrder {
  id: number;
  order_number: string;
  customers: any;
  amount: number;
  current_stage: string;
  created_at: string;
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Production Pending":
    case "QC in Pending":
      return "text-yellow-600";
    case "Dispatch Completed":
      return "text-green-600";
    default:
      return "text-gray-800";
  }
};

const page = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/sales-orders");
        const data = await response.json();
        console.log(data)
        setOrders(data);
      } catch (error) {
        console.error("Error fetching sales orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Sales Order List</h1>
      <div className="bg-white p-6 mt-4 shadow rounded-lg">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-purple-200">
              <th className="p-3 border">Created On</th>
              <th className="p-3 border">Order #</th>
              <th className="p-3 border">Customer Name</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Current Stage</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border">
                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 border">{order.order_number}</td>
                <td className="p-3 border">{order.customers.name}</td>
                <td className="p-3 border">₹{order.amount.toFixed(2)}</td>
                <td className={`p-3 border ${getStageColor(order.current_stage)}`}>
                  {order.current_stage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
