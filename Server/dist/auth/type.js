"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.UserSchema = exports.Product = void 0;
const zod_1 = require("zod");
exports.Product = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().min(1, "description is required"),
    category: zod_1.z.string().min(1, "Category is required"),
    Price: zod_1.z.number(),
    rating: zod_1.z.number(),
});
exports.UserSchema = zod_1.z.object({
    // username: z.string().min(3, "Username must be at least 3 characters long"),
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
