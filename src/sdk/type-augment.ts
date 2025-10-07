// Re-export generated types from OpenAPI
export * as Gen from './types.generated';
export { components, paths } from './types.generated';

// Re-export all schemas and types
export * from './schemas';

// Provide convenient aliases for commonly used types
export type {
  // Core types
  HealthResponse,
  ConsentRequest,
  ConsentResponse,
  WhoAmIResponse,
  
  // Campaign types
  Campaign,
  CampaignCreateRequest,
  CampaignUpdateRequest,
  CampaignEstimateResponse,
  CampaignTestSendRequest,
  CampaignTestSendResponse,
  CampaignSendResponse,
  CampaignsResponse,
  // Campaign aliases
  CampaignResponse,
  
  // Discount types
  Discount,
  DiscountCreateRequest,
  DiscountCreateResponse,
  DiscountUpdateRequest,
  DiscountConflictCheckRequest,
  DiscountConflictResponse,
  DiscountsResponse,
  ApplyUrlResponse,
  // Discount aliases
  DiscountResponse,
  
  // Template types
  TemplatePreviewRequest,
  TemplatePreviewResponse,
  TemplateValidationRequest,
  TemplateValidationResponse,
  TemplateVariablesResponse,
  TemplateTriggersResponse,
  
  // Segment types
  Segment,
  SegmentCreateRequest,
  SegmentUpdateRequest,
  SegmentsResponse,
  // Segment aliases
  SegmentResponse,
  
  // Settings types
  Settings,
  SettingsUpdateRequest,
  SettingsGetResponse,
  // Settings aliases
  SettingsPutRequest,
  
  // Report types
  ReportOverviewResponse,
  ReportMessagingResponse,
  ReportCampaignsResponse,
  ReportAutomationsResponse,
  ReportAttributionResponse,
  
  // Automation types
  AutomationRules,
  AutomationConfig,
  AutomationsResponse,
  AutomationsUpdateRequest,
  
  // Error types
  ErrorResponse,
} from './schemas';

// Re-export schemas for runtime validation
export {
  // Core schemas
  HealthResponseSchema,
  ConsentRequestSchema,
  ConsentResponseSchema,
  WhoAmIResponseSchema,
  
  // Campaign schemas
  CampaignSchema,
  CampaignCreateRequestSchema,
  CampaignUpdateRequestSchema,
  CampaignEstimateResponseSchema,
  CampaignTestSendRequestSchema,
  CampaignTestSendResponseSchema,
  CampaignSendResponseSchema,
  CampaignsResponseSchema,
  
  // Discount schemas
  DiscountSchema,
  DiscountCreateRequestSchema,
  DiscountCreateResponseSchema,
  DiscountUpdateRequestSchema,
  DiscountConflictCheckRequestSchema,
  DiscountConflictResponseSchema,
  DiscountsResponseSchema,
  ApplyUrlResponseSchema,
  
  // Template schemas
  TemplatePreviewRequestSchema,
  TemplatePreviewResponseSchema,
  TemplateValidationRequestSchema,
  TemplateValidationResponseSchema,
  TemplateVariablesResponseSchema,
  TemplateTriggersResponseSchema,
  
  // Segment schemas
  SegmentSchema,
  SegmentCreateRequestSchema,
  SegmentUpdateRequestSchema,
  SegmentsResponseSchema,
  
  // Settings schemas
  SettingsSchema,
  SettingsUpdateRequestSchema,
  SettingsGetResponseSchema,
  
  // Report schemas
  ReportOverviewResponseSchema,
  ReportMessagingResponseSchema,
  ReportCampaignsResponseSchema,
  ReportAutomationsResponseSchema,
  ReportAttributionResponseSchema,
  
  // Automation schemas
  AutomationRulesSchema,
  AutomationConfigSchema,
  AutomationsResponseSchema,
  AutomationsUpdateRequestSchema,
  
  // Error schemas
  ErrorResponseSchema,
} from './schemas';
