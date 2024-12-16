declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      MONGODB_URI: string;
      JWT_SECRET: string;
      PORT?: string;
    }
}

declare namespace Express {
  export interface Request {
    userId?: string | JwtPayload;
  }
}