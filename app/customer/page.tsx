"use client";
import React, { useEffect, useState } from "react";

interface Customers {
  id: number;
  name: string;
  email: string;
  phone_number: number;
}

const Page = () => {
  const [customers, setCustomers] = useState<Customers[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/customer");
        const data = await response.json();
        console.log(data);
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching sales orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">All Customers</h1>
      <div className="bg-white p-6 mt-4 shadow rounded-lg">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-purple-200">
              <th className="p-3 border">Customer Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((item: Customers) => (
              <tr key={item.id} className="border">
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.email}</td>
                <td className="p-3 border">{item.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
