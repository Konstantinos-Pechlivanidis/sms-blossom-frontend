// Comprehensive error taxonomy for SMS Blossom frontend
export interface ErrorInfo {
  title: string;
  message: string;
  action: string;
  tone: 'critical' | 'warning' | 'info' | 'success';
  retryable: boolean;
  retryDelay?: number;
  helpUrl?: string;
}

export const ERROR_TAXONOMY: Record<string, ErrorInfo> = {
  // Authentication & Authorization
  '401': {
    title: 'Authentication Required',
    message: 'Please log in to continue using the app.',
    action: 'Login',
    tone: 'critical',
    retryable: false,
    helpUrl: '/help/authentication',
  },
  '403': {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.',
    action: 'Contact Support',
    tone: 'critical',
    retryable: false,
    helpUrl: '/help/permissions',
  },
  '409': {
    title: 'Shop Not Installed',
    message: 'Please install the SMS Blossom app in your Shopify admin.',
    action: 'Install App',
    tone: 'warning',
    retryable: false,
    helpUrl: '/help/installation',
  },

  // Rate Limiting
  '429': {
    title: 'Rate Limited',
    message: 'Too many requests. Please wait a moment and try again.',
    action: 'Retry',
    tone: 'warning',
    retryable: true,
    retryDelay: 60000, // 1 minute
    helpUrl: '/help/rate-limits',
  },

  // Validation Errors
  '422': {
    title: 'Validation Error',
    message: 'Please check your input and try again.',
    action: 'Fix',
    tone: 'warning',
    retryable: false,
    helpUrl: '/help/validation',
  },

  // Not Found
  '404': {
    title: 'Not Found',
    message: 'The requested resource was not found.',
    action: 'Go Back',
    tone: 'warning',
    retryable: false,
    helpUrl: '/help/not-found',
  },

  // Server Errors
  '500': {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    action: 'Retry',
    tone: 'critical',
    retryable: true,
    retryDelay: 5000,
    helpUrl: '/help/server-errors',
  },
  '502': {
    title: 'Bad Gateway',
    message: 'The server is temporarily unavailable. Please try again.',
    action: 'Retry',
    tone: 'critical',
    retryable: true,
    retryDelay: 10000,
    helpUrl: '/help/bad-gateway',
  },
  '503': {
    title: 'Service Unavailable',
    message: 'The service is temporarily down for maintenance.',
    action: 'Retry',
    tone: 'critical',
    retryable: true,
    retryDelay: 30000, // 30 seconds
    helpUrl: '/help/service-unavailable',
  },

  // Business Logic Errors
  'shop_required': {
    title: 'Shop Required',
    message: 'Shop information is missing. Please refresh the page.',
    action: 'Refresh',
    tone: 'warning',
    retryable: true,
    retryDelay: 1000,
  },
  'invalid_token': {
    title: 'Invalid Token',
    message: 'Your session has expired. Please log in again.',
    action: 'Login',
    tone: 'critical',
    retryable: false,
    helpUrl: '/help/session-expired',
  },
  'shop_not_found': {
    title: 'Shop Not Found',
    message: 'The shop could not be found. Please check your setup.',
    action: 'Check Setup',
    tone: 'critical',
    retryable: false,
    helpUrl: '/help/shop-setup',
  },

  // Campaign Errors
  'campaign_not_found': {
    title: 'Campaign Not Found',
    message: 'The campaign you are looking for does not exist.',
    action: 'Go Back',
    tone: 'warning',
    retryable: false,
  },
  'campaign_validation_error': {
    title: 'Campaign Error',
    message: 'Please check your campaign settings and try again.',
    action: 'Fix Settings',
    tone: 'warning',
    retryable: false,
  },
  'campaign_send_failed': {
    title: 'Send Failed',
    message: 'Failed to send the campaign. Please try again.',
    action: 'Retry Send',
    tone: 'critical',
    retryable: true,
    retryDelay: 5000,
  },

  // Discount Errors
  'discount_conflict': {
    title: 'Discount Code Conflict',
    message: 'This discount code already exists. Please choose a different one.',
    action: 'Change Code',
    tone: 'warning',
    retryable: false,
  },
  'discount_validation_error': {
    title: 'Discount Error',
    message: 'Please check your discount settings and try again.',
    action: 'Fix Settings',
    tone: 'warning',
    retryable: false,
  },

  // Contact Errors
  'contact_not_found': {
    title: 'Contact Not Found',
    message: 'The contact you are looking for does not exist.',
    action: 'Go Back',
    tone: 'warning',
    retryable: false,
  },
  'contact_validation_error': {
    title: 'Contact Error',
    message: 'Please check the contact information and try again.',
    action: 'Fix Information',
    tone: 'warning',
    retryable: false,
  },
  'phone_already_exists': {
    title: 'Phone Already Exists',
    message: 'A contact with this phone number already exists.',
    action: 'Use Different Phone',
    tone: 'warning',
    retryable: false,
  },

  // Automation Errors
  'automation_not_found': {
    title: 'Automation Not Found',
    message: 'The automation you are looking for does not exist.',
    action: 'Go Back',
    tone: 'warning',
    retryable: false,
  },
  'automation_validation_error': {
    title: 'Automation Error',
    message: 'Please check your automation settings and try again.',
    action: 'Fix Settings',
    tone: 'warning',
    retryable: false,
  },
  'template_validation_error': {
    title: 'Template Error',
    message: 'Please check your template syntax and try again.',
    action: 'Fix Template',
    tone: 'warning',
    retryable: false,
  },

  // Network Errors
  'network_error': {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    action: 'Retry',
    tone: 'critical',
    retryable: true,
    retryDelay: 3000,
    helpUrl: '/help/network-issues',
  },
  'timeout': {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    action: 'Retry',
    tone: 'warning',
    retryable: true,
    retryDelay: 5000,
  },

  // Generic Errors
  'unknown_error': {
    title: 'Unexpected Error',
    message: 'Something unexpected happened. Please try again.',
    action: 'Retry',
    tone: 'critical',
    retryable: true,
    retryDelay: 5000,
    helpUrl: '/help/contact-support',
  },
  'maintenance_mode': {
    title: 'Maintenance Mode',
    message: 'The app is currently under maintenance. Please try again later.',
    action: 'Try Later',
    tone: 'info',
    retryable: true,
    retryDelay: 300000, // 5 minutes
    helpUrl: '/help/maintenance',
  },
};

// Error code mapping for HTTP status codes
export const HTTP_ERROR_MAPPING: Record<number, string> = {
  400: 'shop_required',
  401: '401',
  403: '403',
  404: '404',
  409: '409',
  422: '422',
  429: '429',
  500: '500',
  502: '502',
  503: '503',
};

// Helper function to get error info
export function getErrorInfo(error: any): ErrorInfo {
  // Check if it's an HTTP error with status code
  if (error?.status) {
    const mappedError = HTTP_ERROR_MAPPING[error.status];
    if (mappedError && ERROR_TAXONOMY[mappedError]) {
      return ERROR_TAXONOMY[mappedError];
    }
  }

  // Check if it's a specific error code
  if (error?.code && ERROR_TAXONOMY[error.code]) {
    return ERROR_TAXONOMY[error.code];
  }

  // Check if it's a network error
  if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
    return ERROR_TAXONOMY.network_error;
  }

  // Check if it's a timeout
  if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
    return ERROR_TAXONOMY.timeout;
  }

  // Default to unknown error
  return ERROR_TAXONOMY.unknown_error;
}

// Helper function to check if error is retryable
export function isRetryableError(error: any): boolean {
  const errorInfo = getErrorInfo(error);
  return errorInfo.retryable;
}

// Helper function to get retry delay
export function getRetryDelay(error: any): number {
  const errorInfo = getErrorInfo(error);
  return errorInfo.retryDelay || 5000; // Default 5 seconds
}

// Helper function to format error for display
export function formatError(error: any): {
  title: string;
  message: string;
  action: string;
  tone: 'critical' | 'warning' | 'info' | 'success';
  retryable: boolean;
  retryDelay?: number;
  helpUrl?: string;
} {
  return getErrorInfo(error);
}
