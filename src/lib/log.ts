/**
 * Logging utilities with PII redaction for production safety
 */

// PII patterns to redact
const PII_PATTERNS = [
  // Phone numbers (E.164 format)
  /\+[1-9]\d{1,14}/g,
  // Email addresses
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  // Credit card numbers (basic pattern)
  /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  // SSN (basic pattern)
  /\b\d{3}-\d{2}-\d{4}\b/g,
  // API tokens and keys
  /(?:token|key|secret|password|auth)[=:]\s*[a-zA-Z0-9+/=]{20,}/gi,
  // JWT tokens
  /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
  // Shopify tokens
  /shpat_[a-zA-Z0-9]{32,}/g,
  // App Bridge tokens
  /[a-zA-Z0-9]{40,}/g,
];

/**
 * Redacts PII from a string
 */
export function redactPII(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let redacted = text;
  
  PII_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  
  return redacted;
}

/**
 * Redacts PII from an object recursively
 */
export function redactPIIFromObject(obj: any, maxDepth = 5, currentDepth = 0): any {
  if (currentDepth >= maxDepth) {
    return '[MAX_DEPTH_REACHED]';
  }
  
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return redactPII(obj);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => redactPIIFromObject(item, maxDepth, currentDepth + 1));
  }
  
  if (typeof obj === 'object') {
    const redacted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Redact sensitive keys
      if (isSensitiveKey(key)) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactPIIFromObject(value, maxDepth, currentDepth + 1);
      }
    }
    return redacted;
  }
  
  return obj;
}

/**
 * Checks if a key is sensitive and should be redacted
 */
function isSensitiveKey(key: string): boolean {
  const sensitiveKeys = [
    'password', 'passwd', 'pwd',
    'token', 'key', 'secret', 'auth',
    'phone', 'email', 'ssn', 'credit',
    'payment', 'billing', 'shipping',
    'session', 'cookie', 'jwt',
    'api_key', 'access_token', 'refresh_token',
    'client_secret', 'private_key',
  ];
  
  const lowerKey = key.toLowerCase();
  return sensitiveKeys.some(sensitive => lowerKey.includes(sensitive));
}

/**
 * Safe logger that redacts PII before logging
 */
export class SafeLogger {
  private isDevelopment: boolean;
  
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }
  
  /**
   * Log with PII redaction
   */
  log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const redactedData = data ? redactPIIFromObject(data) : undefined;
    
    if (this.isDevelopment) {
      console[level](message, redactedData);
    } else {
      // In production, you might want to send to a logging service
      console[level](message, redactedData);
    }
  }
  
  /**
   * Log API requests with redacted headers and body
   */
  logApiRequest(method: string, url: string, headers?: Record<string, string>, body?: any): void {
    const redactedHeaders = headers ? redactPIIFromObject(headers) : undefined;
    const redactedBody = body ? redactPIIFromObject(body) : undefined;
    
    this.log('info', `API Request: ${method} ${url}`, {
      headers: redactedHeaders,
      body: redactedBody,
    });
  }
  
  /**
   * Log API responses with redacted data
   */
  logApiResponse(method: string, url: string, status: number, data?: any): void {
    const redactedData = data ? redactPIIFromObject(data) : undefined;
    
    this.log('info', `API Response: ${method} ${url} ${status}`, redactedData);
  }
  
  /**
   * Log errors with redacted context
   */
  logError(message: string, error: Error, context?: any): void {
    const redactedContext = context ? redactPIIFromObject(context) : undefined;
    
    this.log('error', message, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: redactedContext,
    });
  }
}

// Export a default logger instance
export const logger = new SafeLogger();

/**
 * Log API call with PII redaction
 */
export function logApiCall(status: 'success' | 'error', context: string, data?: any): void {
  const redactedData = data ? redactPIIFromObject(data) : undefined;
  
  if (import.meta.env.DEV) {
    console.log(`[API ${status.toUpperCase()}] ${context}`, redactedData);
  }
  
  // In production, you might want to send to a logging service
  logger.log(status === 'success' ? 'info' : 'error', `API ${status}: ${context}`, redactedData);
}

/**
 * Log API error with PII redaction
 */
export function logApiError(error: any, context: string): void {
  const redactedError = redactPIIFromObject(error);
  
  if (import.meta.env.DEV) {
    console.error(`[API ERROR] ${context}`, redactedError);
  }
  
  logger.logError(`API Error: ${context}`, error instanceof Error ? error : new Error(String(error)), {
    context,
    timestamp: new Date().toISOString(),
  });
}

// Utility functions are already exported above
