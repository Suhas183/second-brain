import { z, ZodError } from "zod";

export const signupSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(8, "Password should contain atleast 8 characters")
                        .max(20,"Password can contain maximum of 20 characters")
                        .regex(/[A-Z]/,"Password should contain atleast one uppercase letter")
                        .regex(/[a-z]/,"Password should contain atleast one lowercase letter")
                        .regex(/\d/,"Password should contain atleast one number")
                        .regex(/[!@#$%^&*]/, "Password must have at least one special character")
});

export const ContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title can be at most 100 characters long"),
  
  link: z.string()
    .url("Link must be a valid URL"),
});

export type ContentInput = z.infer<typeof ContentSchema>;
export type SignupInput = z.infer<typeof signupSchema>;