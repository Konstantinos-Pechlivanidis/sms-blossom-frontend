import { z } from 'zod';

// ============================================================================
// CORE RESPONSE SCHEMAS
// ============================================================================

export const HealthResponseSchema = z.object({
  status: z.string().optional(),
  version: z.string().optional(),
  db: z.object({
    ok: z.boolean(),
    latency_ms: z.number().optional(),
  }).optional(),
  redis: z.object({
    ok: z.boolean(),
    latency_ms: z.number().optional(),
  }).optional(),
  queues: z.object({
    ok: z.boolean(),
    workers: z.number().optional(),
  }).optional(),
  pii: z.object({
    phone_pct: z.number().optional(),
    email_pct: z.number().optional(),
  }).optional(),
  timestamp: z.string().optional(),
  request_id: z.string().optional(),
});

export const ConsentRequestSchema = z.object({
  phone: z.string(),
  email: z.string().optional(),
  optInLevel: z.enum(['SINGLE_OPT_IN', 'CONFIRMED_OPT_IN']).default('SINGLE_OPT_IN'),
});

export const ConsentResponseSchema = z.object({
  ok: z.boolean(),
  phoneE164: z.string().optional(),
  linkedToCustomer: z.boolean().optional(),
  shopifyPushPending: z.boolean().optional(),
  pcdApproved: z.boolean().optional(),
});

export const WhoAmIResponseSchema = z.object({
  shop: z.string(),
  user: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

// ============================================================================
// CAMPAIGN SCHEMAS
// ============================================================================

export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['draft', 'scheduled', 'sending', 'sent', 'failed', 'paused', 'completed']),
  message: z.string(),
  segmentId: z.string().optional(),
  segmentName: z.string().optional(),
  recipientCount: z.number().optional(),
  sentAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  discountId: z.string().optional(),
  discountCode: z.string().optional(),
  utm: z.record(z.string(), z.any()).optional(),
  // Additional properties from API docs
  scheduledAt: z.string().optional(),
  estimatedAt: z.string().optional(),
  template: z.string().optional(),
  analytics: z.record(z.string(), z.any()).optional(),
  audience: z.object({
    segment: z.string().optional(),
    count: z.number().optional(),
  }).optional(),
  created_at: z.string().optional(),
  scheduled_at: z.string().optional(),
});

export const CampaignCreateRequestSchema = z.object({
  name: z.string(),
  message: z.string(),
  segmentId: z.string().optional(),
  scheduledAt: z.string().optional(),
  discountId: z.string().optional(),
  utm: z.record(z.string(), z.any()).optional(),
});

export const CampaignUpdateRequestSchema = z.object({
  name: z.string().optional(),
  message: z.string().optional(),
  segmentId: z.string().optional(),
  scheduledAt: z.string().optional(),
  discountId: z.string().optional(),
  utm: z.record(z.string(), z.any()).optional(),
});

export const CampaignEstimateResponseSchema = z.object({
  ok: z.boolean(),
  recipients: z.number(),
  perMessageSegments: z.number(),
  totalSegments: z.number(),
  estCost: z.number(),
  audienceSize: z.number().optional(),
  estimatedCost: z.number().optional(),
  estimatedDeliveryTime: z.string().optional(),
  segments: z.array(z.object({
    name: z.string(),
    count: z.number(),
  })).optional(),
  details: z.record(z.string(), z.any()).optional(),
});

export const CampaignTestSendRequestSchema = z.object({
  phone: z.string(),
});

export const CampaignTestSendResponseSchema = z.object({
  ok: z.boolean(),
  result: z.record(z.string(), z.any()).optional(),
  message: z.string().optional(),
});

export const CampaignSendResponseSchema = z.object({
  ok: z.boolean(),
  sent: z.number(),
  failed: z.number(),
  skipped: z.number(),
  message: z.string().optional(),
});

export const CampaignsResponseSchema = z.object({
  items: z.array(CampaignSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// ============================================================================
// DISCOUNT SCHEMAS
// ============================================================================

export const DiscountSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string().optional(),
  kind: z.enum(['percentage', 'amount']),
  value: z.number(),
  currencyCode: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  appliesOncePerCustomer: z.boolean().optional(),
  usageLimit: z.number().optional(),
  redirect: z.string().optional(),
  segments: z.array(z.string()).optional(),
  minimumAmount: z.number().optional(),
  type: z.enum(['percentage', 'amount']).optional(),
  // Additional properties
  createdAt: z.string().optional(),
  status: z.enum(['active', 'inactive', 'expired', 'scheduled']).optional(),
  analytics: z.record(z.string(), z.any()).optional(),
});

export const DiscountCreateRequestSchema = z.object({
  code: z.string(),
  title: z.string().optional(),
  kind: z.enum(['percentage', 'amount']),
  value: z.number(),
  currencyCode: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  appliesOncePerCustomer: z.boolean().default(true),
  usageLimit: z.number().optional(),
  redirect: z.string().optional(),
  segments: z.array(z.string()).optional(),
});

export const DiscountCreateResponseSchema = z.object({
  ok: z.boolean(),
  code: z.string(),
  title: z.string().optional(),
  id: z.string(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  applyUrl: z.string().optional(),
});

export const DiscountUpdateRequestSchema = z.object({
  code: z.string().optional(),
  title: z.string().optional(),
  kind: z.enum(['percentage', 'amount']).optional(),
  value: z.number().optional(),
  currencyCode: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  appliesOncePerCustomer: z.boolean().optional(),
  usageLimit: z.number().optional(),
  redirect: z.string().optional(),
  segments: z.array(z.string()).optional(),
});

export const DiscountConflictCheckRequestSchema = z.object({
  code: z.string(),
});

export const DiscountConflictResponseSchema = z.object({
  conflicts: z.boolean(),
  message: z.string().optional(),
  automaticDiscounts: z.array(z.record(z.string(), z.any())).optional(),
});

export const DiscountsResponseSchema = z.object({
  items: z.array(DiscountSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const ApplyUrlResponseSchema = z.object({
  ok: z.boolean(),
  url: z.string(),
});

// ============================================================================
// TEMPLATE SCHEMAS
// ============================================================================

export const TemplatePreviewRequestSchema = z.object({
  template: z.string(),
  variables: z.record(z.string(), z.string()),
});

export const TemplatePreviewResponseSchema = z.object({
  rendered: z.string(),
  variables: z.array(z.string()).optional(),
});

export const TemplateValidationRequestSchema = z.object({
  template: z.string(),
  trigger: z.string(),
});

export const TemplateValidationResponseSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
});

export const TemplateVariablesResponseSchema = z.object({
  variables: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
});

export const TemplateTriggersResponseSchema = z.object({
  triggers: z.array(z.string()),
});

// ============================================================================
// SEGMENT SCHEMAS
// ============================================================================

export const SegmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  criteria: z.record(z.string(), z.any()),
  count: z.number(),
  filterJson: z.record(z.string(), z.any()).optional(),
});

export const SegmentCreateRequestSchema = z.object({
  name: z.string(),
  criteria: z.record(z.string(), z.any()),
  filterJson: z.record(z.string(), z.any()).optional(),
});

export const SegmentUpdateRequestSchema = z.object({
  name: z.string().optional(),
  criteria: z.record(z.string(), z.any()).optional(),
  filterJson: z.record(z.string(), z.any()).optional(),
});

export const SegmentsResponseSchema = z.object({
  items: z.array(SegmentSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// ============================================================================
// SETTINGS SCHEMAS
// ============================================================================

export const SettingsSchema = z.object({
  timezone: z.string(),
  quietHours: z.object({
    start: z.number(),
    end: z.number(),
  }),
  cap: z.object({
    windowHours: z.number(),
    maxPerWindow: z.number(),
  }).optional(),
  abandoned: z.object({
    delayMinutes: z.number().optional(),
  }).optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
  notifications: z.object({
    webhook: z.object({
      enabled: z.boolean(),
      url: z.string(),
    }).optional(),
  }).optional(),
  analytics: z.object({
    totalCampaigns: z.number(),
    totalDiscounts: z.number(),
    totalMessages: z.number(),
    totalRevenue: z.number(),
    averageDeliveryRate: z.number(),
    averageOpenRate: z.number(),
    averageClickRate: z.number(),
  }).optional(),
});

export const SettingsUpdateRequestSchema = z.object({
  timezone: z.string().optional(),
  quietHours: z.object({
    start: z.number(),
    end: z.number(),
  }).optional(),
  cap: z.object({
    windowHours: z.number(),
    maxPerWindow: z.number(),
  }).optional(),
  abandoned: z.object({
    delayMinutes: z.number().optional(),
  }).optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
  notifications: z.object({
    webhook: z.object({
      enabled: z.boolean(),
      url: z.string(),
    }).optional(),
  }).optional(),
});

export const SettingsGetResponseSchema = z.object({
  ok: z.boolean(),
  shop: z.string(),
  settings: SettingsSchema,
});

// ============================================================================
// REPORT SCHEMAS
// ============================================================================

export const ReportOverviewResponseSchema = z.object({
  ok: z.boolean(),
  range: z.string(),
  contacts: z.object({
    total: z.number(),
    optedIn: z.number(),
    optedOutRecent: z.number(),
  }),
  messages: z.object({
    sent: z.number(),
    delivered: z.number(),
    failed: z.number(),
    opened: z.number().optional(),
    clicked: z.number().optional(),
    deliveryRate: z.number().optional(),
  }),
  revenue: z.object({
    total: z.number().optional(),
    attributed: z.number().optional(),
  }),
  cost: z.number().optional(),
  // Additional properties from API docs
  period: z.object({
    start: z.string(),
    end: z.string(),
  }).optional(),
  metrics: z.object({
    total_campaigns: z.number().optional(),
    total_sent: z.number().optional(),
    total_delivered: z.number().optional(),
    delivery_rate: z.number().optional(),
    total_revenue: z.number().optional(),
  }).optional(),
  cached_at: z.string().optional(),
});

export const ReportMessagingResponseSchema = z.object({
  ok: z.boolean(),
  range: z.object({
    from: z.string(),
    to: z.string(),
  }),
  series: z.array(z.object({
    day: z.string(),
    sent: z.number(),
    delivered: z.number(),
    failed: z.number(),
    opened: z.number().optional(),
    clicked: z.number().optional(),
    cost: z.number().optional(),
  })),
});

export const ReportCampaignsResponseSchema = z.object({
  ok: z.boolean(),
  range: z.object({
    from: z.string(),
    to: z.string(),
  }),
  items: z.array(z.object({
    campaignId: z.string(),
    name: z.string(),
    revenue: z.number(),
    orders: z.number(),
    via: z.object({
      discount: z.number(),
      utm: z.number(),
    }),
    clicks_lifetime: z.number(),
    messaging: z.object({
      sent: z.number(),
      delivered: z.number(),
      failed: z.number(),
    }),
  })),
});

export const ReportAutomationsResponseSchema = z.object({
  ok: z.boolean(),
  range: z.object({
    from: z.string(),
    to: z.string(),
  }),
  items: z.array(z.object({
    automation: z.string(),
    orders: z.number(),
    revenue: z.number(),
  })),
});

export const ReportAttributionResponseSchema = z.object({
  ok: z.boolean(),
  range: z.string(),
  items: z.array(z.object({
    code: z.string(),
    orders: z.number(),
    revenue: z.number(),
  })),
});

// ============================================================================
// AUTOMATION SCHEMAS
// ============================================================================

export const AutomationRulesSchema = z.object({
  quietHours: z.object({
    enabled: z.boolean(),
    start: z.number(),
    end: z.number(),
    zone: z.string().nullable().optional(),
  }),
  frequencyCap: z.object({
    enabled: z.boolean(),
    per: z.enum(['hour', 'day', 'week']),
    max: z.number(),
  }),
  dedupeWindowMin: z.number(),
});

export const AutomationConfigSchema = z.object({
  enabled: z.boolean(),
  template: z.string().nullable().optional(),
  delayMinutes: z.number().optional(),
  rules: AutomationRulesSchema.optional(),
});

export const AutomationsResponseSchema = z.object({
  ok: z.boolean(),
  shop: z.string(),
  automations: z.object({
    orderPaid: AutomationConfigSchema,
    abandoned: AutomationConfigSchema,
    fulfillmentUpdate: AutomationConfigSchema,
    welcome: AutomationConfigSchema,
    backInStock: AutomationConfigSchema,
  }),
});

export const AutomationsUpdateRequestSchema = z.object({
  orderPaid: AutomationConfigSchema.optional(),
  abandoned: AutomationConfigSchema.optional(),
  fulfillmentUpdate: AutomationConfigSchema.optional(),
  welcome: AutomationConfigSchema.optional(),
  backInStock: AutomationConfigSchema.optional(),
});

// ============================================================================
// ERROR SCHEMAS
// ============================================================================

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ConsentRequest = z.infer<typeof ConsentRequestSchema>;
export type ConsentResponse = z.infer<typeof ConsentResponseSchema>;
export type WhoAmIResponse = z.infer<typeof WhoAmIResponseSchema>;

export type Campaign = z.infer<typeof CampaignSchema>;
export type CampaignCreateRequest = z.infer<typeof CampaignCreateRequestSchema>;
export type CampaignUpdateRequest = z.infer<typeof CampaignUpdateRequestSchema>;
export type CampaignEstimateResponse = z.infer<typeof CampaignEstimateResponseSchema>;
export type CampaignTestSendRequest = z.infer<typeof CampaignTestSendRequestSchema>;
export type CampaignTestSendResponse = z.infer<typeof CampaignTestSendResponseSchema>;
export type CampaignSendResponse = z.infer<typeof CampaignSendResponseSchema>;
export type CampaignsResponse = z.infer<typeof CampaignsResponseSchema>;
// Campaign aliases
export type CampaignResponse = Campaign;

export type Discount = z.infer<typeof DiscountSchema>;
export type DiscountCreateRequest = z.infer<typeof DiscountCreateRequestSchema>;
export type DiscountCreateResponse = z.infer<typeof DiscountCreateResponseSchema>;
export type DiscountUpdateRequest = z.infer<typeof DiscountUpdateRequestSchema>;
export type DiscountConflictCheckRequest = z.infer<typeof DiscountConflictCheckRequestSchema>;
export type DiscountConflictResponse = z.infer<typeof DiscountConflictResponseSchema>;
export type DiscountsResponse = z.infer<typeof DiscountsResponseSchema>;
export type ApplyUrlResponse = z.infer<typeof ApplyUrlResponseSchema>;
// Discount aliases
export type DiscountResponse = Discount;

export type TemplatePreviewRequest = z.infer<typeof TemplatePreviewRequestSchema>;
export type TemplatePreviewResponse = z.infer<typeof TemplatePreviewResponseSchema>;
export type TemplateValidationRequest = z.infer<typeof TemplateValidationRequestSchema>;
export type TemplateValidationResponse = z.infer<typeof TemplateValidationResponseSchema>;
export type TemplateVariablesResponse = z.infer<typeof TemplateVariablesResponseSchema>;
export type TemplateTriggersResponse = z.infer<typeof TemplateTriggersResponseSchema>;

export type Segment = z.infer<typeof SegmentSchema>;
export type SegmentCreateRequest = z.infer<typeof SegmentCreateRequestSchema>;
export type SegmentUpdateRequest = z.infer<typeof SegmentUpdateRequestSchema>;
export type SegmentsResponse = z.infer<typeof SegmentsResponseSchema>;
// Segment aliases
export type SegmentResponse = Segment;

export type Settings = z.infer<typeof SettingsSchema>;
export type SettingsUpdateRequest = z.infer<typeof SettingsUpdateRequestSchema>;
export type SettingsGetResponse = z.infer<typeof SettingsGetResponseSchema>;
// Settings aliases
export type SettingsPutRequest = SettingsUpdateRequest;

export type ReportOverviewResponse = z.infer<typeof ReportOverviewResponseSchema>;
export type ReportMessagingResponse = z.infer<typeof ReportMessagingResponseSchema>;
export type ReportCampaignsResponse = z.infer<typeof ReportCampaignsResponseSchema>;
export type ReportAutomationsResponse = z.infer<typeof ReportAutomationsResponseSchema>;
export type ReportAttributionResponse = z.infer<typeof ReportAttributionResponseSchema>;

export type AutomationRules = z.infer<typeof AutomationRulesSchema>;
export type AutomationConfig = z.infer<typeof AutomationConfigSchema>;
export type AutomationsResponse = z.infer<typeof AutomationsResponseSchema>;
export type AutomationsUpdateRequest = z.infer<typeof AutomationsUpdateRequestSchema>;

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
