'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderDetails {
  id: number;
  order_number: string;
  order_receive_via: string;
  amount: number;
  current_stage: string;
  stage_status: string;
  customers: {
    id: number;
    name: string;
  };
  sales_order_items: {
    id: number;
    product_name: string;
    size: string;
    quantity: number;
    rate: number | string;
    amount: number | string;
  }[];
}

export default function Page() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/sales-orders/orderdetails?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) alert(data.error);
          else setOrder(data);
        })
        .catch((err) => console.error('Error fetching order details:', err));
    }
  }, [id]);

  if (!order) return <p className="text-center mt-10">Loading order details...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Order Details</h1>

        {/* Order Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Order Information</h2>
          <p><strong>Order Number:</strong> {order.order_number}</p>
          <p><strong>Received Via:</strong> {order.order_receive_via}</p>
          <p><strong>Order Amount:</strong> ₹{order.amount}</p>
          <p><strong>Current Stage:</strong> {order.current_stage}</p>
          <p>
            <strong>Stage Status:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-white ${
                order.stage_status === 'Pending'
                  ? 'bg-red-500'
                  : order.stage_status === 'Processing'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            >
              {order.stage_status}
            </span>
          </p>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Customer Information</h2>
          <p><strong>Customer Name:</strong> {order.customers.name}</p>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Order Items</h2>
          {order.sales_order_items.length > 0 ? (
            <table className="w-full bg-gray-50 border rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">Product Name</th>
                  <th className="p-3 border">Size</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Rate (₹)</th>
                  <th className="p-3 border">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {order.sales_order_items.map((item) => (
                  <tr key={item.id} className="text-center hover:bg-gray-100">
                    <td className="p-3 border">{item.product_name}</td>
                    <td className="p-3 border">{item.size || 'N/A'}</td>
                    <td className="p-3 border">{item.quantity}</td>
                    <td className="p-3 border">
                      {typeof item.rate === 'number' ? item.rate.toFixed(2) : parseFloat(item.rate).toFixed(2)}
                    </td>
                    <td className="p-3 border">
                      {typeof item.amount === 'number' ? item.amount.toFixed(2) : parseFloat(item.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items available for this order.</p>
          )}
        </div>
      </div>
    </div>
  );
}
