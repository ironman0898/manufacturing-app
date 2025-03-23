"use client";
import React, { useState } from "react";
import { emailRegex, validString } from "../../constant/regex";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  gstin_no: number;
}

interface InputError {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gstin_no: string;
}

const Page = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: 0,
    gstin_no: 0,
  });

  const [error, setError] = useState<InputError>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gstin_no: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Check for validation errors
    const hasErrors = Object.values(error).some((err) => err !== "");

    // Check if all form fields are filled
    const hasEmptyFields = Object.values(formData).some(
      (value) => value === "" || value === 0
    );

    if (hasErrors || hasEmptyFields) {
      alert("Please fill all fields correctly before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Customer Created Successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: 0,
        gstin_no: 0,
      });
      setError({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gstin_no: "",
      });
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <div className="bg-white p-6 mt-4 shadow rounded-lg">
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <label>First Name</label>
              <input
                className="border p-2 rounded w-full"
                type="text"
                value={formData.firstName}
                name="firstName"
                onChange={(e) => handleChange(e)}
                onBlur={() => {
                  setError((prevError) => ({
                    ...prevError,
                    firstName:
                      !validString.test(formData.firstName) ||
                      formData.firstName === ""
                        ? "Please Enter a valid first name."
                        : "",
                  }));
                }}
              />
              {error.firstName && (
                <p className="text-red-500">{error.firstName}</p>
              )}
            </div>
            <div>
              <label>Last Name</label>
              <input
                className="border p-2 rounded w-full"
                type="text"
                value={formData.lastName}
                name="lastName"
                onChange={(e) => handleChange(e)}
                onBlur={() => {
                  setError((prevError) => ({
                    ...prevError,
                    lastName:
                      !validString.test(formData.lastName) ||
                      formData.lastName === ""
                        ? "Please Enter a valid last name."
                        : "",
                  }));
                }}
              />
              {error.lastName && (
                <p className="text-red-500">{error.lastName}</p>
              )}
            </div>
            <div>
              <label>Email</label>
              <input
                className="border p-2 rounded w-full"
                type="email"
                value={formData.email}
                name="email"
                onChange={(e) => handleChange(e)}
                onBlur={() => {
                  setError((prevError) => ({
                    ...prevError,
                    email:
                      !emailRegex.test(formData.email) || formData.email === ""
                        ? "Please Enter a valid email id."
                        : "",
                  }));
                }}
              />
              {error.email && <p className="text-red-500">{error.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label>Phone Number</label>
              <input
                className="border p-2 rounded w-full"
                type="number"
                value={formData.phone}
                name="phone"
                onChange={(e) => handleChange(e)}
                onBlur={() => {
                  setError((prevError) => ({
                    ...prevError,
                    phone:
                      formData.phone.toString().length !== 10
                        ? "Please Enter a valid phone number."
                        : "",
                  }));
                }}
              />
              {error.phone && <p className="text-red-500">{error.phone}</p>}
            </div>
            <div>
              <label>GSTIN Number</label>
              <input
                className="border p-2 rounded w-full"
                type="number"
                value={formData.gstin_no}
                name="gstin_no"
                onChange={(e) => handleChange(e)}
                onBlur={() => {
                    setError((prevError) => ({
                        ...prevError,
                        gstin_no:
                          formData.gstin_no.toString().length !== 15
                            ? "Please Enter a valid phone number."
                            : "",
                      }));
                }}
              />
              {error.gstin_no && (
                <p className="text-red-500">{error.gstin_no}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="mt-6 bg-purple-600 text-white px-6 py-2 rounded"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
