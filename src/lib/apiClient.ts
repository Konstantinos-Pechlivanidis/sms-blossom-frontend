import { apiClient, ApiError, RateLimitError } from '../sdk';
import { emitApiError } from './events';
import { ZodSchema } from 'zod';
import { getErrorInfo, isRetryableError, getRetryDelay } from './errorTaxonomy';
import { measureApiCall } from './performance';
import { logApiCall, logApiError } from './log';

// Error taxonomy mapping from Integration Guide
const ERROR_TAXONOMY = {
  // Authentication errors
  'invalid_token': 'Authentication failed. Please refresh the page.',
  'token_expired': 'Your session has expired. Please refresh the page.',
  'shop_not_installed': 'App is not installed for this shop. Please install the app.',
  'unauthorized': 'You do not have permission to perform this action.',
  
  // Shop errors
  'unknown_shop': 'Shop is not recognized. Please reinstall the app.',
  'shop_suspended': 'This shop has been suspended. Please contact support.',
  'shop_not_found': 'Shop not found. Please check your configuration.',
  
  // Rate limiting
  'rate_limited': 'Too many requests. Please wait a moment and try again.',
  'quota_exceeded': 'API quota exceeded. Please try again later.',
  
  // Validation errors
  'validation_error': 'Please check your input and try again.',
  'invalid_phone': 'Please enter a valid phone number.',
  'invalid_discount': 'Please check your discount configuration.',
  'invalid_template': 'Please check your template syntax.',
  'invalid_campaign': 'Please check your campaign configuration.',
  
  // Business logic errors
  'campaign_not_found': 'Campaign not found.',
  'discount_conflict': 'This discount conflicts with existing discounts.',
  'insufficient_credits': 'Insufficient SMS credits. Please upgrade your plan.',
  'campaign_already_sent': 'This campaign has already been sent.',
  'discount_expired': 'This discount has expired.',
  'segment_empty': 'The selected segment has no contacts.',
  
  // System errors
  'internal_error': 'An internal error occurred. Please try again.',
  'service_unavailable': 'Service temporarily unavailable. Please try again later.',
  'database_error': 'Database error. Please try again.',
  'queue_error': 'Message queue error. Please try again.',
  'external_service_error': 'External service error. Please try again.',
  
  // Network errors
  'network_error': 'Network error. Please check your connection.',
  'timeout': 'Request timed out. Please try again.',
  'connection_failed': 'Connection failed. Please try again.',
} as const;

type ErrorCode = keyof typeof ERROR_TAXONOMY;

// Helper function for parsing JSON responses with optional schema validation
export async function parseJson<T>(res: Response, schema?: ZodSchema<T>): Promise<T> {
  const json = await res.json();
  if (schema) {
    return schema.parse(json);
  }
  return json as T;
}

// Enhanced error handling
export function handleApiError(error: unknown): string {
  if (error instanceof RateLimitError) {
    const retryAfter = Math.ceil(error.retryAfter / 1000);
    return `Rate limited. Please wait ${retryAfter} seconds before trying again.`;
  }
  
  if (error instanceof ApiError) {
    const errorData = error.response;
    
    // Handle specific error codes
    if (errorData?.error && ERROR_TAXONOMY[errorData.error as ErrorCode]) {
      return ERROR_TAXONOMY[errorData.error as ErrorCode];
    }
    
    // Handle HTTP status codes
    switch (error.status) {
      case 401:
        return 'Authentication failed. Please refresh the page.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        if (errorData?.install_url) {
          // Redirect to install URL
          window.location.href = errorData.install_url;
          return 'Redirecting to install page...';
        }
        return 'Conflict. Please check your data and try again.';
      case 422:
        return errorData?.message || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return errorData?.message || `Request failed: ${error.statusText}`;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

// Enhanced API client with error handling
export class EnhancedApiClient {
  private async handleRequest<T>(
    requestFn: () => Promise<T>,
    context: string
  ): Promise<T> {
    // Extract endpoint and method from context for performance monitoring
    const endpoint = context.split(' ')[0] || 'unknown';
    const method = context.split(' ')[1] || 'GET';
    
    // Measure API call performance
    const endApiCall = measureApiCall(endpoint, method);
    
    try {
      const result = await requestFn();
      endApiCall();
      
      // Log successful API call with PII redaction
      logApiCall('success', context, result);
      
      return result;
    } catch (error) {
      endApiCall();
      
      // Get comprehensive error info
      const errorInfo = getErrorInfo(error);
      
      // Emit error event for global error handling with enhanced info
      const errorMessage = error instanceof Error ? error.message : String(error);
      emitApiError(errorMessage);
      
      // Log error details for debugging with PII redaction
      if (import.meta.env.DEV) {
        console.error(`[${context}] API Error:`, {
          error,
          errorInfo,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Log API error with PII redaction
      logApiError(error, context);

      throw error;
    }
  }

  // Health endpoints
  async getHealth() {
    return this.handleRequest(
      () => apiClient.getHealth(),
      'getHealth'
    );
  }

  // Dashboard endpoints
  async getOverviewReport(params: { shop: string; window?: string }) {
    return this.handleRequest(
      () => apiClient.getOverviewReport(params),
      'getOverviewReport'
    );
  }

  async getMessagingReport(params: { shop: string; window?: string }) {
    return this.handleRequest(
      () => apiClient.getMessagingReport(params),
      'getMessagingReport'
    );
  }

  // Campaign endpoints
  async getCampaigns(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getCampaigns(params),
      'getCampaigns'
    );
  }

  async getCampaign(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.getCampaign(params),
      'getCampaign'
    );
  }

  async createCampaign(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.createCampaign(params),
      'createCampaign'
    );
  }

  async updateCampaign(params: { id: string; shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.updateCampaign(params),
      'updateCampaign'
    );
  }

  async deleteCampaign(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.deleteCampaign(params),
      'deleteCampaign'
    );
  }

  async estimateCampaign(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.estimateCampaign(params),
      'estimateCampaign'
    );
  }

  async testSendCampaign(params: { id: string; shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.testSendCampaign(params),
      'testSendCampaign'
    );
  }

  async sendCampaign(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.sendCampaign(params),
      'sendCampaign'
    );
  }

  // Discount endpoints
  async getDiscounts(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getDiscounts(params),
      'getDiscounts'
    );
  }

  async getDiscount(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.getDiscount(params),
      'getDiscount'
    );
  }

  async createDiscount(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.createDiscount(params),
      'createDiscount'
    );
  }

  async updateDiscount(params: { id: string; shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.updateDiscount(params),
      'updateDiscount'
    );
  }

  async deleteDiscount(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.deleteDiscount(params),
      'deleteDiscount'
    );
  }

  async checkDiscountConflicts(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.checkDiscountConflicts(params),
      'checkDiscountConflicts'
    );
  }

  async getDiscountApplyUrl(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.getDiscountApplyUrl(params),
      'getDiscountApplyUrl'
    );
  }

  // Settings endpoints
  async getSettings(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getSettings(params),
      'getSettings'
    );
  }

  async updateSettings(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.updateSettings(params),
      'updateSettings'
    );
  }

  // Segments endpoints
  async getSegments(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getSegments(params),
      'getSegments'
    );
  }

  async getSegment(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.getSegment(params),
      'getSegment'
    );
  }

  async createSegment(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.createSegment(params),
      'createSegment'
    );
  }

  async updateSegment(params: { id: string; shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.updateSegment(params),
      'updateSegment'
    );
  }

  async deleteSegment(params: { id: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.deleteSegment(params),
      'deleteSegment'
    );
  }

  // Debug endpoint
  async getWhoAmI(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getWhoAmI(params),
      'getWhoAmI'
    );
  }

  // Automation methods
  async getAutomations(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getAutomations(params),
      'getAutomations'
    );
  }

  async updateAutomations(params: { shop: string; payload: any }) {
    return this.handleRequest(
      () => apiClient.updateAutomations(params),
      'updateAutomations'
    );
  }

  // Contact methods
  async getContacts(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getContacts(params),
      'getContacts'
    );
  }

  async createContact(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.createContact(params),
      'createContact'
    );
  }

  async updateContact(params: { shop: string; id: string; data: any }) {
    return this.handleRequest(
      () => apiClient.updateContact(params),
      'updateContact'
    );
  }

  async deleteContact(params: { shop: string; id: string }) {
    return this.handleRequest(
      () => apiClient.deleteContact(params),
      'deleteContact'
    );
  }

  async bulkContacts(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.bulkContacts(params),
      'bulkContacts'
    );
  }

  // Report methods
  async getCampaignsReport(params: { shop: string; window?: string }) {
    return this.handleRequest(
      () => apiClient.getCampaignsReport(params),
      'getCampaignsReport'
    );
  }

  async getAutomationsReport(params: { shop: string; window?: string }) {
    return this.handleRequest(
      () => apiClient.getAutomationsReport(params),
      'getAutomationsReport'
    );
  }

  async getAttributionReport(params: { shop: string; window?: string }) {
    return this.handleRequest(
      () => apiClient.getAttributionReport(params),
      'getAttributionReport'
    );
  }

  async exportReport(params: { shop: string; type: string; format: string }) {
    return this.handleRequest(
      () => apiClient.exportReport(params),
      'exportReport'
    );
  }

  // Template methods
  async previewTemplate(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.previewTemplate(params),
      'previewTemplate'
    );
  }

  async validateTemplate(params: { shop: string; data: any }) {
    return this.handleRequest(
      () => apiClient.validateTemplate(params),
      'validateTemplate'
    );
  }

  async getTemplateVariables(params: { trigger: string; shop: string }) {
    return this.handleRequest(
      () => apiClient.getTemplateVariables(params),
      'getTemplateVariables'
    );
  }

  async getTemplateTriggers(params: { shop: string }) {
    return this.handleRequest(
      () => apiClient.getTemplateTriggers(params),
      'getTemplateTriggers'
    );
  }
}

// Export singleton instance
export const enhancedApiClient = new EnhancedApiClient();

// Export error types
export { ApiError, RateLimitError } from '../sdk';
