// Type helpers for OpenAPI generated types
export type ApiPaths = import('./types.generated').paths;
export type ApiSchemas = import('./types.generated').components['schemas'];

// Available types from the actual OpenAPI spec
export type HealthResponse = ApiSchemas['HealthResponse'];
export type ConsentRequest = ApiSchemas['ConsentRequest'];
export type ConsentResponse = ApiSchemas['ConsentResponse'];
export type ApplyUrlResponse = ApiSchemas['ApplyUrlResponse'];
export type AutomationConfig = ApiSchemas['AutomationConfig'];
export type AutomationRules = ApiSchemas['AutomationRules'];
export type AutomationsResponse = ApiSchemas['AutomationsResponse'];
export type AutomationsUpdateRequest = ApiSchemas['AutomationsUpdateRequest'];
export type DiscountCreateRequest = ApiSchemas['DiscountCreateRequest'];
export type DiscountCreateResponse = ApiSchemas['DiscountCreateResponse'];
export type ErrorResponse = ApiSchemas['ErrorResponse'];
export type ReportAttributionResponse = ApiSchemas['ReportAttributionResponse'];
export type ReportOverviewResponse = ApiSchemas['ReportOverviewResponse'];
export type SettingsGetResponse = ApiSchemas['SettingsGetResponse'];
export type SettingsPutRequest = ApiSchemas['SettingsPutRequest'];

// Mock types for missing schemas - these should be replaced with actual API types when available
export type Campaign = {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  message_count: number;
  sent_count: number;
  delivery_rate: number;
};

export type CampaignCreateRequest = {
  name: string;
  template_id: string;
  description?: string;
};

export type CampaignUpdateRequest = {
  name?: string;
  status?: 'draft' | 'active' | 'paused' | 'completed';
  description?: string;
};

export type CampaignResponse = Campaign;

export type CampaignsResponse = {
  campaigns: Campaign[];
  total: number;
  page: number;
  per_page: number;
};

export type CampaignEstimateResponse = {
  estimated_recipients: number;
  estimated_cost: number;
  cost_per_message: number;
  currency: string;
};

export type CampaignTestSendRequest = {
  phone: string;
  variables?: Record<string, string>;
};

export type CampaignTestSendResponse = {
  success: boolean;
  message_id?: string;
  error?: string;
};

export type CampaignSendResponse = {
  success: boolean;
  campaign_id: string;
  message_count: number;
};

export type Discount = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  status: 'active' | 'inactive' | 'expired';
  usage_count: number;
  usage_limit?: number;
  expires_at?: string;
  created_at: string;
};

export type DiscountUpdateRequest = {
  code?: string;
  type?: 'percentage' | 'fixed_amount';
  value?: number;
  status?: 'active' | 'inactive' | 'expired';
  usage_limit?: number;
  expires_at?: string;
};

export type DiscountResponse = Discount;

export type DiscountsResponse = {
  discounts: Discount[];
  total: number;
  page: number;
  per_page: number;
};

export type DiscountConflictCheckRequest = {
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
};

export type DiscountConflictResponse = {
  has_conflicts: boolean;
  conflicts: string[];
};

export type Template = {
  id: string;
  name: string;
  content: string;
  variables: string[];
  triggers: string[];
  created_at: string;
  updated_at: string;
};

export type TemplatePreviewRequest = {
  content: string;
  variables?: Record<string, string>;
};

export type TemplatePreviewResponse = {
  rendered: string;
  variables: string[];
};

export type TemplateValidationRequest = {
  content: string;
  trigger?: string;
};

export type TemplateValidationResponse = {
  is_valid: boolean;
  message: string;
  errors: string[];
  warnings: string[];
};

export type TemplateVariablesResponse = {
  variables: string[];
};

export type TemplateTriggersResponse = {
  triggers: string[];
};

export type Segment = {
  id: string;
  name: string;
  description?: string;
  criteria: Record<string, any>;
  contact_count: number;
  created_at: string;
  updated_at: string;
};

export type SegmentCreateRequest = {
  name: string;
  description?: string;
  criteria: Record<string, any>;
};

export type SegmentUpdateRequest = {
  name?: string;
  description?: string;
  criteria?: Record<string, any>;
};

export type SegmentResponse = Segment;

export type SegmentsResponse = {
  segments: Segment[];
  total: number;
  page: number;
  per_page: number;
};

export type ReportMessagingResponse = {
  series: Array<{
    date: string;
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked: number;
  }>;
};

export type ReportCampaignsResponse = {
  campaigns: Array<{
    id: string;
    name: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    revenue: number;
  }>;
};

export type ReportAutomationsResponse = {
  automations: Array<{
    id: string;
    name: string;
    trigger: string;
    active: boolean;
    sent_count: number;
    delivery_rate: number;
  }>;
};

export type Settings = {
  timezone: string;
  quietHours: {
    start: number;
    end: number;
  };
  cap: {
    windowHours: number;
    maxPerWindow: number;
  };
  abandoned: {
    delayMinutes?: number;
  };
  notifications?: {
    webhook?: {
      enabled: boolean;
      url?: string;
    };
  };
  analytics?: {
    totalCampaigns: number;
    totalDiscounts: number;
    totalMessages: number;
    totalRevenue: number;
    averageDeliveryRate: number;
    averageOpenRate: number;
    averageClickRate: number;
  };
};

export type SettingsUpdateRequest = Partial<Settings>;

export type WhoAmIResponse = {
  ok: boolean;
  shop?: string;
  settings?: Settings;
};

// Utility types
export type ApiError = ErrorResponse;
export type ApiSuccess<T> = { data: T };
export type ApiResult<T> = ApiSuccess<T> | ApiError;