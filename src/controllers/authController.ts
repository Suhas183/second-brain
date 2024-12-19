import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/User';
import dotenv from 'dotenv';
import { ZodError } from "zod";
import { signupSchema, SignupInput } from '../utils/validation';

dotenv.config();

export const signup =  async (req : Request,res : Response) : Promise<any> => {
    try {
      // Validate request body against schema
      const parsedInput: SignupInput = signupSchema.parse(req.body);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(parsedInput.password, 5);
  
      // Create the user
      const user : IUser = await UserModel.create({
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
}

export const signin =  async (req : Request,res : Response) : Promise<any> => {
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
}