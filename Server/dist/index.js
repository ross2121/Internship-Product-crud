"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth/auth");
const role_1 = require("./middleware/role");
const Product_1 = require("./Product/Product");
const app = (0, express_1.default)();
app.listen(3001);
app.use(express_1.default.json());
app.use("/api/v1", auth_1.userrouter);
app.use("/api/v1", role_1.adminmanager, Product_1.productRouter);
app.get("/tes", role_1.adminmanager, (req, res) => {
    return res.send("Test route accessed successfully!");
});
