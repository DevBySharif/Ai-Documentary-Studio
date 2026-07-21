export const config = {
  app: {
    name: "AI Documentary Studio",
    version: "1.0.0",
    description: "Production-grade AI-powered documentary video creation platform",
  },
  api: {
    port: parseInt(process.env.PORT || "3001", 10),
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-change-in-production",
    expiresIn: "7d",
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || "local",
    bucket: process.env.STORAGE_BUCKET || "uploads",
  },
} as const;
