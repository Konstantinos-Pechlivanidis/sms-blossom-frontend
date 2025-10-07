// Environment configuration and validation
import { z } from 'zod';

const envSchema = z.object({
  VITE_BACKEND_URL: z.string().url().default('https://api.sms-blossom.com'),
  VITE_SHOPIFY_API_KEY: z.string().min(1),
  VITE_PORT: z.string().transform(Number).default(5173),
  VITE_HOST: z.string().default('0.0.0.0'),
  VITE_ENABLE_PERFORMANCE: z.string().transform(val => val === 'true').default(false),
  VITE_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default(false),
  VITE_ANALYTICS_ENDPOINT: z.string().url().optional(),
  VITE_DEBUG: z.string().transform(val => val === 'true').default(false),
});

export const env = envSchema.parse(import.meta.env);

// Environment validation function
export function validateEnvironment() {
  try {
    envSchema.parse(import.meta.env);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      valid: false,
      errors: [{ path: 'unknown', message: 'Unknown validation error' }],
    };
  }
}

// Environment info for debugging
export function getEnvironmentInfo() {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    backendUrl: env.VITE_BACKEND_URL,
    performanceEnabled: env.VITE_ENABLE_PERFORMANCE,
    analyticsEnabled: env.VITE_ENABLE_ANALYTICS,
    debug: env.VITE_DEBUG,
  };
}
