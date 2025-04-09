import jwt from "jsonwebtoken";
export const auth = async (req:any, res:any) => {
    console.log(req.user);
    try {
        if (!req.headers.authorization) {
            throw new Error("Authentication error: Missing authorization header");
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("Authorization error: Missing token");
        }
        const decode = jwt.verify(token,"jwtoken");
        req.user = decode;
        console.log(req.user);
    } catch (error:any) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
};

export const  adminmanager = (req:any, res:any,next:any) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("token",token)
        const decode = jwt.verify(token,"JWTTOKEN");
        console.log("decode",decode);
        req.user = decode;
        if (req.user && req.user.role === "user") {
            console.log("Access denied. User role is not 'Customer'");
            return res.status(440).json({message:"user not authorized"})
            // throw new Error("Access denied: Insufficient permissions");
        }
        next();
    } catch (error:any) {
        console.log(error);
        res.status(403).json({ error: error.message });
    }
};

