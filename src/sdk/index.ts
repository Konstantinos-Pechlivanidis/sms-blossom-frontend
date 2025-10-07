import { getBearerToken } from '../lib/shopify';
import { useShop } from '../lib/shopContext';
import type { paths } from './types.generated';
import type { 
  Campaign,
  CampaignCreateRequest,
  CampaignUpdateRequest,
  CampaignResponse,
  CampaignsResponse,
  CampaignEstimateResponse,
  CampaignTestSendRequest,
  CampaignTestSendResponse,
  CampaignSendResponse,
  Discount,
  DiscountCreateRequest,
  DiscountUpdateRequest,
  DiscountResponse,
  DiscountsResponse,
  DiscountConflictCheckRequest,
  DiscountConflictResponse,
  Segment,
  SegmentCreateRequest,
  SegmentUpdateRequest,
  SegmentResponse,
  SegmentsResponse,
  ReportMessagingResponse,
  ReportCampaignsResponse,
  ReportAutomationsResponse,
  ReportAttributionResponse,
  Settings,
  SettingsUpdateRequest,
  WhoAmIResponse,
  ReportOverviewResponse,
  DiscountCreateResponse,
  ApplyUrlResponse,
  SettingsGetResponse,
  SettingsPutRequest,
  AutomationsResponse,
  AutomationsUpdateRequest
} from './type-augment';

// Base API configuration
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://api.sms-blossom.com';

// Request ID generator
function generateRequestId(): string {
  return crypto.randomUUID();
}

// Error types
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public requestId: string,
    public response?: any
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export class RateLimitError extends ApiError {
  constructor(
    public retryAfter: number,
    requestId: string,
    response?: any
  ) {
    super(429, 'Rate Limited', requestId, response);
    this.name = 'RateLimitError';
  }
}

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

// HTTP client with retry logic
class HttpClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<T> {
    const requestId = generateRequestId();
    const token = await getBearerToken();
    
    // Get shop domain from context or URL
    const shopDomain = this.getShopDomain();
    
    const headers = new Headers({
      'Authorization': `Bearer ${token}`,
      'X-Shop-Domain': shopDomain,
      'X-Request-ID': requestId,
      'Content-Type': 'application/json',
      ...options.headers,
    });

    const url = `${API_BASE}${endpoint}`;
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryConfig.baseDelay * Math.pow(2, attempt);
          
          if (attempt < retryConfig.maxRetries) {
            await this.delay(Math.min(delay, retryConfig.maxDelay));
            continue;
          }
          
          throw new RateLimitError(delay, requestId, await response.json().catch(() => ({})));
        }

        // Handle other errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(response.status, response.statusText, requestId, errorData);
        }

        // Success
        const data = await response.json();
        return data;
        
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) except 429
        if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === retryConfig.maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const delay = retryConfig.baseDelay * Math.pow(2, attempt);
        await this.delay(Math.min(delay, retryConfig.maxDelay));
      }
    }
    
    throw lastError || new Error('Request failed');
  }

  private getShopDomain(): string {
    // Try to get from context first
    try {
      const { shop } = useShop();
      if (shop) return shop;
    } catch {
      // Context not available, fall back to URL detection
    }
    
    // Fallback to URL detection
    const url = new URL(window.location.href);
    const shopParam = url.searchParams.get('shop');
    if (shopParam && shopParam.includes('.myshopify.com')) {
      return shopParam;
    }
    
    // Last resort: try to extract from host
    const hostParam = url.searchParams.get('host');
    if (hostParam) {
      try {
        const decoded = atob(hostParam);
        const urlObj = new URL(`https://${decoded}`);
        if (urlObj.hostname.endsWith('.myshopify.com')) {
          return urlObj.hostname;
        }
      } catch {
        // Ignore decode errors
      }
    }
    
    return '';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health endpoints
  async getHealth(): Promise<any> {
    return this.makeRequest('/health');
  }

  // Dashboard endpoints
  async getOverviewReport(params: { shop: string; window?: string }): Promise<ReportOverviewResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    if (params.window) searchParams.set('window', params.window);
    return this.makeRequest(`/reports/overview?${searchParams}`);
  }

  async getMessagingReport(params: { shop: string; window?: string }): Promise<ReportMessagingResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    if (params.window) searchParams.set('window', params.window);
    return this.makeRequest(`/reports/messaging?${searchParams}`);
  }

  // Campaign endpoints
  async getCampaigns(params: { shop: string }): Promise<CampaignsResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns?${searchParams}`);
  }

  async getCampaign(params: { id: string; shop: string }): Promise<CampaignResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns/${params.id}?${searchParams}`);
  }

  async createCampaign(params: { shop: string; data: CampaignCreateRequest }): Promise<CampaignResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async updateCampaign(params: { id: string; shop: string; data: CampaignUpdateRequest }): Promise<CampaignResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns/${params.id}?${searchParams}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  }

  async deleteCampaign(params: { id: string; shop: string }): Promise<void> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns/${params.id}?${searchParams}`, {
      method: 'DELETE',
    });
  }

  async estimateCampaign(params: { id: string; shop: string }): Promise<CampaignEstimateResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns/${params.id}/estimate?${searchParams}`, {
      method: 'POST',
    });
  }

  async testSendCampaign(params: { id: string; shop: string; data: CampaignTestSendRequest }): Promise<CampaignTestSendResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns/${params.id}/test-send?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async sendCampaign(params: { id: string; shop: string }): Promise<CampaignSendResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/campaigns/${params.id}/send?${searchParams}`, {
      method: 'POST',
    });
  }

  // Discount endpoints
  async getDiscounts(params: { shop: string }): Promise<DiscountsResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/discounts?${searchParams}`);
  }

  async getDiscount(params: { id: string; shop: string }): Promise<DiscountResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/discounts/${params.id}?${searchParams}`);
  }

  async createDiscount(params: { shop: string; data: DiscountCreateRequest }): Promise<DiscountCreateResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/discounts?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async updateDiscount(params: { id: string; shop: string; data: DiscountUpdateRequest }): Promise<DiscountResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/discounts/${params.id}?${searchParams}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  }

  async deleteDiscount(params: { id: string; shop: string }): Promise<void> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/discounts/${params.id}?${searchParams}`, {
      method: 'DELETE',
    });
  }

  async checkDiscountConflicts(params: { shop: string; data: DiscountConflictCheckRequest }): Promise<DiscountConflictResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/discounts/conflicts?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async getDiscountApplyUrl(params: { id: string; shop: string }): Promise<ApplyUrlResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/discounts/${params.id}/apply-url?${searchParams}`);
  }

  // Settings endpoints
  async getSettings(params: { shop: string }): Promise<SettingsGetResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/settings?${searchParams}`);
  }

  async updateSettings(params: { shop: string; data: SettingsPutRequest }): Promise<SettingsGetResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/settings?${searchParams}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  }

  // Segments endpoints
  async getSegments(params: { shop: string }): Promise<SegmentsResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/segments?${searchParams}`);
  }

  async getSegment(params: { id: string; shop: string }): Promise<SegmentResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/segments/${params.id}?${searchParams}`);
  }

  async createSegment(params: { shop: string; data: SegmentCreateRequest }): Promise<SegmentResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/segments?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async updateSegment(params: { id: string; shop: string; data: SegmentUpdateRequest }): Promise<SegmentResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/segments/${params.id}?${searchParams}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  }

  async deleteSegment(params: { id: string; shop: string }): Promise<void> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/segments/${params.id}?${searchParams}`, {
      method: 'DELETE',
    });
  }

  // Template endpoints
  async previewTemplate(params: { shop: string; data: any }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/templates/preview?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async validateTemplate(params: { shop: string; data: any }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/templates/validate?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async getTemplateVariables(params: { trigger: string; shop: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop, trigger: params.trigger });
    return this.makeRequest(`/templates/variables?${searchParams}`);
  }

  async getTemplateTriggers(params: { shop: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/templates/triggers?${searchParams}`);
  }

  // Automation methods
  async getAutomations(params: { shop: string }): Promise<AutomationsResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/automations?${searchParams}`);
  }

  async updateAutomations(params: { shop: string; payload: AutomationsUpdateRequest }): Promise<AutomationsResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/automations?${searchParams}`, {
      method: 'PUT',
      body: JSON.stringify(params.payload),
    });
  }

  // Contact methods
  async getContacts(params: { shop: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/contacts?${searchParams}`);
  }

  async createContact(params: { shop: string; data: any }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/contacts?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  async updateContact(params: { shop: string; id: string; data: any }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/contacts/${params.id}?${searchParams}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  }

  async deleteContact(params: { shop: string; id: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/contacts/${params.id}?${searchParams}`, {
      method: 'DELETE',
    });
  }

  async bulkContacts(params: { shop: string; data: any }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/contacts/bulk?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  // Reports endpoints
  async getCampaignsReport(params: { shop: string; window?: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    if (params.window) searchParams.set('window', params.window);
    return this.makeRequest(`/reports/campaigns?${searchParams}`);
  }

  async getAutomationsReport(params: { shop: string; window?: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    if (params.window) searchParams.set('window', params.window);
    return this.makeRequest(`/reports/automations?${searchParams}`);
  }

  async getAttributionReport(params: { shop: string; window?: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    if (params.window) searchParams.set('window', params.window);
    return this.makeRequest(`/reports/attribution?${searchParams}`);
  }

  async exportReport(params: { shop: string; type: string; format: string }): Promise<any> {
    const searchParams = new URLSearchParams({ shop: params.shop, type: params.type, format: params.format });
    return this.makeRequest(`/reports/export?${searchParams}`);
  }

  // Debug endpoint
  async getWhoAmI(params: { shop: string }): Promise<WhoAmIResponse> {
    const searchParams = new URLSearchParams({ shop: params.shop });
    return this.makeRequest(`/__debug/whoami?${searchParams}`);
  }
}

// Export singleton instance
export const apiClient = new HttpClient();

// Export types
export type { paths, components } from './types.generated';
