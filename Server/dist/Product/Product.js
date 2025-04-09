"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const type_1 = require("../auth/type");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.post("/create/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category, Price, rating, userid } = req.body;
    if (!name || !description || !category || !userid) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = yield prisma.user.findUnique({
        where: {
            id: userid
        }
    });
    if (!user) {
        return res.status(440).json({ message: "No user found" });
    }
    const verify = type_1.Product.safeParse({ name, description, category, Price, rating });
    if (!verify.success) {
        return res.status(400).json({ message: verify.error.message, });
    }
    try {
        const product = yield prisma.product.create({
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));
router.get("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id
            }, include: {
                Product: true
            }
        });
        if (!user) {
            return res.status(440).json({ message: "No user found" });
        }
        res.status(200).json(user.Product);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));
router.get("/product/admin/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(440).json({ message: "No id fount" });
    }
    const product = yield prisma.product.findUnique({
        where: {
            id: id
        }
    });
    return res.status(200).json({ product });
}));
router.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, category, Price, rating } = req.body;
    if (!name || !description || !category || !Price || !rating) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const product = yield prisma.product.update({
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield prisma.product.delete({
            where: { id },
        });
        res.status(200).json({ message: "Product deleted successfully", product });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));
exports.productRouter = router;
