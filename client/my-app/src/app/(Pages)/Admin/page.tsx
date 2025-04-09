"use client"

import AdminDashboard from "@/components/Adminpage"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const AdminLogin=()=>{
    const router=useRouter();
    useEffect(()=>{
        const token=localStorage.getItem("token");
        const role=localStorage.getItem("role");
        if(!token||role=="User"){
             router.push("/Admin/Signup")
        }
    },[])
    return(
        <AdminDashboard/>
    )
}
export default AdminLogin