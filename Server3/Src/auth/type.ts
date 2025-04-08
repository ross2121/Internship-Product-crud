import { z } from "zod";

export const Product = z.object({
  name:z.string().min(1,"Name is required"),
  description:z.string().min(1,"description is required"),
  category:z.string().min(1,"Category is required"),
  Price:z.number(),
  rating:z.string().min(1,"Rating is required"),
});
export const UserSchema = z.object({
    // username: z.string().min(3, "Username must be at least 3 characters long"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
  export const LoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
