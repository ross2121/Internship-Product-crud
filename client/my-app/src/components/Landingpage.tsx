"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Landingpage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Product Management System
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px] mb-8">
            A complete solution for managing products with role-based access control
          </p>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Customer Access</CardTitle>
              <CardDescription>
                Browse and shop our product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• View product listings</li>
                <li>• Search and filter products</li>
               
               
              </ul>
            </CardContent>
            <div className="px-6 pb-6">
              <Link href="/User" className="w-full">
                <Button variant="outline" className="w-full">
                  Continue as Customer
                </Button>
              </Link>
            </div>
          </Card>
          <Card className="hover:shadow-lg transition-shadow border-blue-100 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>
                Manage the product catalog and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Create and edit products</li>
                <li>• Manage inventory levels</li>
                <li>• Manage user permissions</li>
              </ul>
            </CardContent>
            <div className="px-6 pb-6">
              <Link href="/Admin" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Admin Login
                </Button>
              </Link>
            </div>
          </Card>
        </div>

     
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
              <p className="text-muted-foreground">
                Role-based authentication ensures proper data access for all users
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Intuitive Interface</h3>
              <p className="text-muted-foreground">
                Designed for both technical and non-technical users
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Changes reflect immediately across all platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}