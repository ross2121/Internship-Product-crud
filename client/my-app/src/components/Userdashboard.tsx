"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, List, LogOut } from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">

      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xl font-semibold">User Dashboard</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white hover:bg-gray-700 flex items-center space-x-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Product Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Welcome to your User dashboard. Manage your products efficiently with
            our tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <List className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-3 text-center">
              View Products
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Browse and manage your existing product catalog.
            </p>
            <Link href="/User/List" className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Product Management System</p>
      </footer>
    </div>
  );
}