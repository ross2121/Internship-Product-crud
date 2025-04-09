import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { LoginSchema, UserSchema } from "./type";
import bcrypt from "bcrypt";
const router=Router();
const prisma=new PrismaClient();
router.post("/register/user",async(req:any,res:any)=>{
    const {name,email,password}=req.body;
    console.log("Chekk");
    if(!name||!email||!password){
    console.log("No detail founf")
    return res.status(440).json({message:"auth fail"})
    }
    const verify=UserSchema.safeParse({name,email,password});
    if(!verify.success){
        return res.status(400).json({message:verify.error.message,});
    }
    const unique=await prisma.user.findUnique({
        where:{
            email
        }
    }) 
    if(unique){
        return res.status(400).json({message:"User alredy register"});
    } 
    const salt=await bcrypt.genSalt(10);
    const hashpassword=await bcrypt.hash(password,salt);
   
        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashpassword,
                Role:"User"
            }})
        const token=jwt.sign({id:user.id,role:"user"},"JWTTOKEN",);
        return res.status(200).json({token,user});
    })

router.post("/user/signin",async(req:any,res:any)=>{
    const {email,password}=req.body;
    const verify=LoginSchema.safeParse({email,password});
    if(!verify.success){
        return res.status(400).json({message:verify.error.message,});
    }
    const user=await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!user){
        res.status(200).json({message:"No user find kindly register",status:400});
        return;
    }
    const comparepassword=bcrypt.compareSync(password,user?.password);
    if(!comparepassword){
       res.json({message:"Password dont match"});
    }
    const token=jwt.sign({id:user.id,role:"user"},"JWTOKEN");
    return res.status(200).json({token,user});
})
router.post("/register/admin",async(req,res:any)=>{
    const {name,email,password}=req.body;
    const verify=UserSchema.safeParse({name,email,password});
    if(!verify.success){
        return res.status(400).json({message:verify.error.message,});
    }
    const unique=await prisma.user.findUnique({
        where:{
            email
        }
    }) 
    if(unique){
        return res.status(400).json({message:"User alredy register"});
    } 
    const salt=await bcrypt.genSalt(10);
    const hashpassword=await bcrypt.hash(password,salt);
        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashpassword,
                
            }})
        const token=jwt.sign({id:user.id,role:"admin"},"JWTTOKEN");
        return res.status(200).json({token,user});
    })
    router.post("/admin/signin",async(req:any,res:any)=>{
        const {email,password}=req.body;
        const verify=LoginSchema.safeParse({email,password});
        if(!verify.success){
            return res.status(400).json({message:verify.error.message,});
        }
        const user=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            res.status(200).json({message:"No user find kindly register",status:400});
            return;
        }
        const comparepassword=bcrypt.compareSync(password,user?.password);
        if(!comparepassword){
           res.json({message:"Password dont match"});
        }
        const token=jwt.sign({id:user.id,role:"admin"},"JWTOKEN");
        return res.status(200).json({token,user});
    })
    router.get("/all/product" , async (req:any, res:any) => {
        try {
            const products = await prisma.product.findMany();
            res.status(200).json(products);
        } catch (error:any) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    })

export const userrouter=router;
