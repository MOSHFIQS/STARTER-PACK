import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url().default("https://api.enterprise.com/v1"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Safe parsing of environment variables
const parseEnv = () => {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    console.error("❌ Invalid environment variables configuration:", result.error.format());
    // In production, we might want to crash or provide defaults.
    // For local development / building, fallback safely so build doesn't break prematurely.
    return {
      NEXT_PUBLIC_BASE_URL: "https://api.enterprise.com/v1",
      NODE_ENV: "development" as const,
    };
  }

  return result.data;
};

export const env = parseEnv();
