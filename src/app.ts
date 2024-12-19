import express from "express";
import { authMiddleware } from "./middlewares/middleware";
import { signin, signup } from "./controllers/authController";
import { createContent, deleteContent, getContent } from "./controllers/contentController";

const app = express();

app.use(express.json());

app.post("/api/v1/signup", signup);

app.post("/api/v1/signin", signin);

app.post("/api/v1/content", authMiddleware, createContent);

app.get("/api/v1/content", authMiddleware, getContent);

app.delete("/api/v1/content/:id", authMiddleware, deleteContent);

export default app;
  