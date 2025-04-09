import express from "express";
import { Router } from "express";
import { userrouter } from "./auth/auth";
import { adminmanager, auth } from "./middleware/role";
import { productRouter } from "./Product/Product";
import cors from "cors"
const app=express();
app.use(cors());
app.listen(3003);
app.use(express.json());
app.use("/api/v1",userrouter)
app.use("/api/v1",adminmanager,productRouter)
app.get("/tes",adminmanager, (req:any, res:any) => {
   return res.send("Test route accessed successfully!");
});

