import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends jwt.JwtPayload {
    id: string;
}  

export const authMiddleware = (req : Request, res : Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if(token){
        try{
            const isMatch = jwt.verify(token as string,process.env.JWT_SECRET) as TokenPayload;
            req.userId = isMatch.id;
            next();
        }

        catch{
            res.status(401).json({
                message: "Please login"
            })
            return;
        }
    }
    else{
        res.status(401).json({
            message: "Please login"
        })
        return;
    }
}