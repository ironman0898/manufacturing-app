"use client";
import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface Product {
  name: string;
  id: number;
}

interface Customer{
  name:string
  id:number
}

const Page = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderReceiveVia, setOrderReceiveVia] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [items, setItems] = useState([
    { id: 1, product: 0, size: "", qty: "", rate: "", amount: 0 },
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [listOfCustomers, setListOfCustomers] = useState<Customer[]>([])

  const addRow = () => {
    setItems([
      ...items,
      { id: Date.now(), product: 0, size: "", qty: "", rate: "", amount: 0 },
    ]);
  };

  const removeRow = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleInputChange = (
    id: number,
    field: string,
    value: number | string
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        // Get latest values
        const updatedItem = { ...item, [field]: value };
        updatedItem.amount =
          Number(updatedItem.qty || 0) * Number(updatedItem.rate || 0);

        return updatedItem;
      })
    );
  };

  const handleSubmit = async () => {
    if (!orderNumber || !orderReceiveVia || !selectedCustomer) {
      alert("Please fill all order details before submitting.");
      return;
    }

    const data = {
      order_number: orderNumber,
      order_receive_via: orderReceiveVia,
      customer_id: selectedCustomer,
      items: items.map((item) => {
        const selectedProduct = products.find(
          (p) => p.id === Number(item.product)
        );
        return {
          product_id: Number(item.product),
          product_name: selectedProduct ? selectedProduct.name : "",
          size: item.size,
          quantity: Number(item.qty),
          rate: Number(item.rate),
          amount: Number(item.amount),
        };
      }),
    };

    console.log("Submitting Order:", data); // Debugging log

    try {
      const response = await fetch("/api/sales-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create sales order");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Sales Order Created Successfully!");

      // Reset form after successful submission
      setOrderNumber("");
      setOrderReceiveVia("");
      setSelectedCustomer(null);
      setItems([{ id: 1, product: 0, size: "", qty: "", rate: "", amount: 0 }]);
    } catch (error) {
      console.error("Error creating sales order:", error);
      alert("Failed to create Sales Order");
    }
  };

  useEffect(() => {
    const fethcData = async () => {
      try {
        const apiCall = await fetch("/api/product");
        const data = await apiCall.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fethcCustomer = async () => {
      try {
        const apiCall = await fetch("/api/customer");
        const data = await apiCall.json();
        setListOfCustomers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fethcData();
    fethcCustomer()
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Sales Order</h1>
        <div className="bg-white p-6 mt-4 shadow rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Order Type</label>
              <select
                className="border p-2 rounded w-full"
                value={orderReceiveVia}
                onChange={(e) => setOrderReceiveVia(e.target.value)}
              >
                <option value="">Select Order Type</option>
                <option value="Email">Email</option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div>
              <label>Order Id</label>
              <input
                type="text"
                placeholder="Order #"
                className="border p-2 rounded w-full"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>

            <div>
              <label>Customer</label>
              <select
                className="border p-2 rounded w-full"
                value={selectedCustomer || ""}
                onChange={(e) => setSelectedCustomer(Number(e.target.value))}
              >
                <option value="">Choose Customer</option>
                {
                  listOfCustomers.map((item:Customer)=> <option key={item.id} value={item.id}>{item.name}</option>)
                }
              </select>
            </div>
          </div>

          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-200 to-purple-200 p-3 font-bold grid grid-cols-5">
              <span>Product</span>
              <span>Sizes</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Amount</span>
            </div>
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-5 gap-2 p-2 items-center border-b"
              >
                <select
                  className="border p-2 rounded w-full"
                  value={item.product}
                  onChange={(e) =>
                    handleInputChange(item.id, "product", e.target.value)
                  }
                >
                  {products.map((val: Product) => (
                    <option key={val.id} value={val.id}>
                      {val.name}
                    </option>
                  ))}
                </select>

                <select
                  className="border p-2 rounded w-full"
                  value={item.size}
                  onChange={(e) =>
                    handleInputChange(item.id, "size", e.target.value)
                  }
                >
                  <option value="">Select Size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                </select>

                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    handleInputChange(item.id, "qty", Number(e.target.value))
                  }
                  className="border p-2 rounded w-full"
                />

                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) =>
                    handleInputChange(item.id, "rate", Number(e.target.value))
                  }
                  className="border p-2 rounded w-full"
                />

                <input
                  type="number"
                  value={item.amount}
                  readOnly
                  className="border p-2 rounded w-full"
                />

                {index !== 0 && (
                  <button
                    onClick={() => removeRow(item.id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={addRow}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Add Row
            </button>
          </div>

          <button
            className="mt-6 bg-purple-600 text-white px-6 py-2 rounded"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
