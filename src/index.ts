import {Request, Response} from "express";
import express from "express";
import { z, ZodError } from "zod";
import bcrypt from "bcryptjs";
import { ContentModel, UserModel } from "./db";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";

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

const ContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title can be at most 100 characters long"),
  
  link: z.string()
    .url("Link must be a valid URL"),
});

type ContentInput = z.infer<typeof ContentSchema>;
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

app.post("/api/v1/signin", async (req : Request,res : Response) : Promise<any> => {
    try {
      // Validate request body against schema
      const parsedInput: SignupInput = signupSchema.parse(req.body);
      const user = await UserModel.findOne({
        username: parsedInput.username});
        
        if(user){
            const isMatch = await bcrypt.compare(parsedInput.password, user.password);
            if(isMatch){
                const token = jwt.sign({
                    id: user._id
                }, process.env.JWT_SECRET);

                return res.status(200).json({
                    token : token
                });
            }

            else{
                res.status(401).json({
                    message: "Invalid credentials"
                })
            }
        }
        else{
            return res.status(400).json({
                message: "User not found"
            })
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

app.post("/api/v1/content", authMiddleware, async (req : Request,res : Response) : Promise<any> => {
  try{
    const parsedInput : ContentInput = ContentSchema.parse(req.body);
    
    const content = await ContentModel.create({
      title: parsedInput.title,
      link: parsedInput.link,
      tags: [],
      userId: req.userId
    });

    return res.status(201).json({
      message: "Content successfully created"
    });
  }
  catch(err){
    res.status(400).json({
      message: "Failed to create content"
    })
  }
});

app.get("/api/v1/content", authMiddleware, async (req : Request,res : Response) : Promise<any> => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId
  }).populate('userId', "username");
  return res.status(200).json({
    content: content
  });
});


app.delete("/api/v1/content/:id", authMiddleware, async (req : Request,res : Response) : Promise<any> => {
  const userId = req.userId;
  const {id} = req.params;
  const content = await ContentModel.findOne({
    _id : id,
    userId: userId
  })

  if(content){
    await ContentModel.deleteOne({
      _id : id,
    })

    return res.status(200).json({
      message :"Content successfully deleted"
    })
  }
  else{
    return res.status(404).json({
      message: "Content not found"
    });
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
  