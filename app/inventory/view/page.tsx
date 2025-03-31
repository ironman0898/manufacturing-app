"use client";
import React, { useEffect, useState } from "react";

interface Product {
  name: string;
  id: number;
}

interface MaterialList {
  material: string;
  unit: string;
  avilable_quantity: number;
  id: number;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [listOfMaterials, setListOfMaterials] = useState<MaterialList[]>([]);

  const fetchData = async () => {
    try {
      const apiCall = await fetch("/api/product");
      const data = await apiCall.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getListOfMaterials = async (value: string) => {
    try {
      const apiCall = await fetch(`/api/product/rawmaterial?material=${value}`);
      const data = await apiCall.json();
      setListOfMaterials(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">View Inventory</h1>
      <div className="bg-white p-6 mt-4 shadow rounded-lg">
        <label>Select Matteres</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            getListOfMaterials(e.target.value);
          }}
        >
          <option value="">Select Mattress Type</option>
          {products?.map((val: Product) => (
            <option key={val.id} value={val.name}>
              {val.name}
            </option>
          ))}
        </select>

        {listOfMaterials.length > 0 && (
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gradient-to-r from-blue-200 to-purple-200">
                <th className="p-3 border">Material</th>
                <th className="p-3 border">Unit</th>
                <th className="p-3 border">Avilable Quantity</th>
              </tr>
            </thead>
            <tbody>
              {listOfMaterials.length > 0 &&
                listOfMaterials.map((item: MaterialList) => (
                  <tr className="border" key={item.id}>
                    <td className="p-3 border">{item.material}</td>
                    <td className="p-3 border text-center">{item.unit}</td>
                    <td className="p-3 border">{item.avilable_quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
