"use client";
import React, { useEffect, useState } from "react";

interface Product {
  name: string;
  id: number;
}
interface MaterialList {
  material: string;
  id: number;
  unit:string
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [listOfMaterials, setListOfMaterials] = useState<MaterialList[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  // Fetch products (Mattress Types)
  const fetchData = async () => {
    try {
      const apiCall = await fetch("/api/product");
      const data = await apiCall.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch list of materials based on selected mattress type
  const getListOfMaterials = async (value: string) => {
    try {
      const apiCall = await fetch(`/api/product/rawmaterial?material=${value}`);
      const data = await apiCall.json();
      setListOfMaterials(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to update available quantity in EcoBondMaster
  const handleUpdateQuantity = async () => {
    if (!selectedMaterialId) {
      alert("Please select a material.");
      return;
    }
    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    try {
      const response = await fetch("/api/product/rawmaterial", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          material_id: selectedMaterialId,
          quantity: quantity,
          materialTable : selectedProduct
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Quantity updated successfully!");
        setQuantity(0); // Reset quantity field after update
      } else {
        alert(result.error || "Failed to update quantity.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Add Inventory</h1>
        <div className="bg-white p-6 mt-4 shadow rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            {/* Select Mattress Type */}
            <div>
              <label>Mattress Type</label>
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
            </div>

            {/* Select Material */}
            <div>
              <label>Material</label>
              <select
                className="border p-2 rounded w-full"
                onChange={(e) => setSelectedMaterialId(Number(e.target.value))}
              >
                <option value="">Select Material</option>
                {listOfMaterials.length > 0 ? (
                  listOfMaterials?.map((item: MaterialList) => (
                    <option key={item.id} value={item.id}>
                      {item.material}
                    </option>
                  ))
                ) : (
                  <option>No Material Available</option>
                )}
              </select>
            </div>

            {/* Quantity Input */}
            <div>
              <label>Quantity</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                className="border p-2 rounded w-full"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              /> 
              {selectedMaterialId && 'in ' +
                listOfMaterials.find((item:MaterialList)=> item.id === selectedMaterialId)?.unit
              }
            </div>
          </div>

          {/* Save Changes Button */}
          <button
            className="mt-6 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            onClick={handleUpdateQuantity}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
