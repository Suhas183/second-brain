declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      MONGODB_URI: string;
      JWT_SECRET: string;
      PORT?: string;
    }
}
  