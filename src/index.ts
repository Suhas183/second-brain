import {Request, Response} from "express";
import express from "express";
import { z, ZodError } from "zod";
import bcrypt from "bcryptjs";
import { UserModel } from "./db";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
dotenv.config();

async function connectDb(){
    if(!process.env.MONGODB_URI){
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to the database')
    }
    catch{
        throw new Error("Not able to connect to he database");
    }
}

const signupSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(8, "Password should contain atleast 8 characters")
                        .max(20,"Password can contain maximum of 20 characters")
                        .regex(/[A-Z]/,"Password should contain atleast one uppercase letter")
                        .regex(/[a-z]/,"Password should contain atleast one lowercase letter")
                        .regex(/\d/,"Password should contain atleast one number")
                        .regex(/[!@#$%^&*]/, "Password must have at least one special character")
});

type SignupInput = z.infer<typeof signupSchema>;

app.post("/api/v1/signup", async (req : Request,res : Response) : Promise<any> => {
    try {
      // Validate request body against schema
      const parsedInput: SignupInput = signupSchema.parse(req.body);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(parsedInput.password, 5);
  
      // Create the user
      const user = await UserModel.create({
        username: parsedInput.username,
        password: hashedPassword
      });
  
      if (user) {
        return res.status(201).json({
          message: "User has been created successfully"
        });
      }

    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.errors });
      }

      else {
        return res.status(400).json({
            message: "User is already present"
        })
      }
    }
});

connectDb().then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }).catch((err) => {
    console.error("Error starting the server:", err);
    process.exit(1);
});
  