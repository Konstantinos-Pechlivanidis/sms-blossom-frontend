import { z } from 'zod';

// Environment schema validation
export const envSchema = z.object({
  // Required environment variables
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL must be a valid URL'),
  VITE_SHOPIFY_API_KEY: z.string().min(1, 'VITE_SHOPIFY_API_KEY is required'),
  
  // Optional feature flags
  VITE_ENABLE_ANALYTICS: z.string().optional().transform(val => val === 'true'),
  VITE_ENABLE_DEBUG: z.string().optional().transform(val => val === 'true'),
  VITE_ENABLE_MOCK_DATA: z.string().optional().transform(val => val === 'true'),
  
  // Development settings
  DEV: z.string().optional().transform(val => val === 'true'),
  PROD: z.string().optional().transform(val => val === 'true'),
});

export type EnvConfig = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      
      console.error('❌ Environment validation failed:');
      console.error(errorMessages);
      console.error('\nPlease check your .env file and ensure all required variables are set.');
      
      throw new Error(`Environment validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

// Feature flags schema
export const featureFlagsSchema = z.object({
  analytics: z.boolean().default(false),
  debug: z.boolean().default(false),
  mockData: z.boolean().default(false),
  experimentalFeatures: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof featureFlagsSchema>;

// Get feature flags from environment
export function getFeatureFlags(env: EnvConfig): FeatureFlags {
  return {
    analytics: env.VITE_ENABLE_ANALYTICS || false,
    debug: env.VITE_ENABLE_DEBUG || false,
    mockData: env.VITE_ENABLE_MOCK_DATA || false,
    experimentalFeatures: false, // Hardcoded for now
  };
}

// API configuration schema
export const apiConfigSchema = z.object({
  baseUrl: z.string().url(),
  timeout: z.number().min(1000).max(30000).default(10000),
  retryAttempts: z.number().min(0).max(5).default(3),
  retryDelay: z.number().min(100).max(5000).default(1000),
});

export type ApiConfig = z.infer<typeof apiConfigSchema>;

// Get API configuration
export function getApiConfig(env: EnvConfig): ApiConfig {
  return {
    baseUrl: env.VITE_API_BASE_URL,
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  };
}
