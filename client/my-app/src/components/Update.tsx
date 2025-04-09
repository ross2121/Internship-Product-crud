"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Backend_url } from "@/Backendurl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  Price: number;
  rating: number;
}

const initialProductData: ProductFormData = {
  name: "",
  category: "",
  description: "",
  Price: 0,
  rating: 0,
};

const EditProduct: React.FC<{ productId?: string }> = ({ productId }) => {
  const [formData, setFormData] = useState<ProductFormData>(initialProductData);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
            
          const response = await axios.get(
            `${Backend_url}/product/admin/${productId}`,{
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
          );
          console.log(response.data.product);
          setFormData(response.data.product);
        } catch (error) {
          console.error("Error fetching product details:", error);
          toast.error("Error fetching product details");
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files && files[0] ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const product = {
        ...formData,
        Price: Number(formData.Price),
        rating: Number(formData.rating),
      };

      if (productId) {
        await axios.put(
          `${Backend_url}/update/${productId}`,
          product,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Product updated successfully.");
      } else {
       
        toast.success("Product created successfully.");
      }

      router.push("/Admin");
    } catch (error) {
      console.error("Error saving product data:", error);
      setError(
        "An error occurred while saving product details. Please try again."
      );
      toast.error("An error occurred while saving product details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {productId ? "Edit Product" : "Create Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label title="Product Name">
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Label>
          </div>

          <div className="mb-4">
            <Label title="Category">
              <Input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </Label>
          </div>

          <div className="mb-4">
            <Label title="Description">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Label>
          </div>

          <div className="mb-4">
            <Label title="Price">
              <Input
                name="Price"
                type="number"
                value={formData.Price}
                onChange={handleInputChange}
                required
              />
            </Label>
          </div>

          <div className="mb-4">
            <Label title="Rating">
              <Input
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleInputChange}
                required
              />
            </Label>
          </div>
          <Button type="submit" disabled={loading}>
            {productId ? "Update Product" : "Create Product"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditProduct;