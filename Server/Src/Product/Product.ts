import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { Product } from "../auth/type";
const prisma = new PrismaClient();
const router=Router();
router.post("/create/product", async (req:any, res:any) => {
    const { name, description, category, Price, rating,userid } = req.body;
    if (!name || !description || !category || !Price || !rating) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user=await prisma.user.findUnique({
        where:{
            id:userid
        }

    })
    if(!user){
        return res.status(440).json({message:"No user found"});
    }
     const verify=Product.safeParse({name,description,category,Price,rating});
        if(!verify.success){
            return res.status(400).json({message:verify.error.message,});
        }
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                category,
                Price,
                rating,
                userid
            },
        });
        res.status(201).json(product);
    } catch (error:any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
router.get("/all/product" , async (req:any, res:any) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    } catch (error:any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
router.get("/product/:id", async (req:any, res:any) => {
    const { id } = req.params; 
    try {
        const user=await prisma.user.findUnique({
            where:{
                id
            },include:{
                Product:true
            }
        })
        if(!user){
            return res.status(440).json({message:"No user found"})
        }   
        res.status(200).json(user.Product);
    } catch (error:any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
router.put("/update/:id", async (req:any, res:any) => {
    const { id } = req.params;
    const { name, description, category, Price, rating } = req.body;
    if (!name || !description || !category || !Price || !rating) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                category,
                Price,
                rating,
            },
        });

        res.status(200).json(product);
    } catch (error:any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

router.delete("/delete/:id", async (req:any, res:any) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.delete({
            where: { id },
        });

        res.status(200).json({ message: "Product deleted successfully", product });
    } catch (error:any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})
export const productRouter=router;