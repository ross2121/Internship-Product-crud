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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminmanager = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    try {
        if (!req.headers.authorization) {
            throw new Error("Authentication error: Missing authorization header");
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("Authorization error: Missing token");
        }
        const decode = jsonwebtoken_1.default.verify(token, "jwtoken");
        req.user = decode;
        console.log(req.user);
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
});
exports.auth = auth;
const adminmanager = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("token", token);
        const decode = jsonwebtoken_1.default.verify(token, "JWTTOKEN");
        console.log("decode", decode);
        req.user = decode;
        if (req.user && req.user.role === "user") {
            console.log("Access denied. User role is not 'Customer'");
            return res.status(440).json({ message: "user not authorized" });
            // throw new Error("Access denied: Insufficient permissions");
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ error: error.message });
    }
};
exports.adminmanager = adminmanager;
