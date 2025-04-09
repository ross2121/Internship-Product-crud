"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Backend_url } from "@/Backendurl";

interface ProductForm {
  name: string;
  category: string;
  description: string;
  Price: number;
  rating: number;
}

export const Createproduct = () => {
    useEffect(()=>{
        const role=localStorage.getItem("role")
        if(role=="User"){
            router.push("/User/dashboard");
        }
    })
  const [form, setForm] = useState<ProductForm>({
    name: "",
    category: "",
    description: "",
    Price: 0,
    rating: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const userid = localStorage.getItem('userid');
   console.log(userid) 
    try {
      const product = {
        ...form,
        Price: Number(form.Price),
        rating: Number(form.rating),
        userid:localStorage.getItem("userid")
        // createdby: email
      };
      await axios.post(
        `${Backend_url}/create/product`,
        product,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Product created successfully.");
      
      setForm({
        name: "",
        category: "",
        description: "",
        Price: 0,
        rating: 0,
      });
      setTimeout(() => {
        router.replace("/Admin/Dashboard");
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = "Failed to create product";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mt-5 flex justify-center flex-col sm:w-full gap-6 items-center">
          <div className="space-y-4">
            <h1 className="mb-5 text-4xl font-bold">Create Product</h1>
            
            <div>
              <Label htmlFor="name">NAME</Label>
              <Input
                id="name"
                placeholder="name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <div>
              <Label htmlFor="category">category</Label>
              <Input
                id="category"
                placeholder="category name"
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="description">DESCRIPTION</Label>
              <Input
                id="description"
                placeholder="description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="Price">PRICE</Label>
              <Input
                id="Price"
                placeholder="PRICE"
                type="number"
                name="Price"
                value={form.Price}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                // placeholder="0"
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center mt-6">
          <Button type="submit" disabled={loading || uploading} className="text-white">
            {loading || uploading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Createproduct;