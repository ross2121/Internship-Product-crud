"use client"
import UserDashboard from "@/components/Userdashboard"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const Home=()=>{
    const router=useRouter();
    useEffect(()=>{
        const token=localStorage.getItem("token");
        const role=localStorage.getItem("role");
        if(!token||role=="Admin"){
            router.push("/User/Login")
        }
    })
    return(
        <UserDashboard/>
    )
}
export default Home