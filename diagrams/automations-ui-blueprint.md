# Automations UI Blueprint

## Overview

The Automations feature provides a comprehensive SMS automation management system with 5 automation types, template editing, rules configuration, and testing capabilities.

## UI Architecture

### 🏗️ **Main Page Structure**

```
AutomationsPage (/automations)
├── Header Section
│   ├── Title: "SMS Automations"
│   └── Description: "Configure automated SMS messages"
├── Automation Cards (5 cards)
│   ├── Abandoned Checkout Card
│   ├── Order Paid Card
│   ├── Fulfillment Update Card
│   ├── Welcome Card
│   └── Back in Stock Card
├── Template Drawer (Modal)
│   ├── Template Editor
│   ├── Variable Palette
│   └── Preview/Test
└── Rules Modal
    ├── Quiet Hours
    ├── Frequency Cap
    └── Deduplication
```

### 🎯 **Automation Cards**

Each automation card follows this structure:

```
AutomationCard
├── Header
│   ├── Title (e.g., "Abandoned Checkout")
│   ├── Description
│   ├── Status Badge (Active/Inactive)
│   └── Toggle Button (Enable/Disable)
├── Metrics Section (if available)
│   ├── Last 7 days summary
│   ├── Sent count
│   ├── Delivered count
│   └── CTR percentage
├── Template Status
│   ├── Icon (configured/not configured)
│   └── Status text
├── Action Buttons
│   ├── Edit Template
│   ├── Rules
│   ├── Preview
│   └── Test
└── Configuration Summary
    ├── Delay (for Abandoned)
    ├── Quiet hours
    ├── Frequency cap
    └── Deduplication
```

### 🎨 **Template Editor**

```
TemplateDrawer (Modal)
├── Header
│   ├── Title: "Edit Template - {triggerKey}"
│   └── Close Button
├── Variable Palette
│   ├── Available Variables (context-aware)
│   └── Insert Buttons
├── Template Editor
│   ├── Textarea (Monaco-style)
│   ├── GSM Counter (160 char limit)
│   └── Syntax highlighting
└── Actions
    ├── Save Template
    └── Cancel
```

### ⚙️ **Rules Modal**

```
AutomationRulesModal
├── Header
│   ├── Title: "Automation Rules"
│   ├── Save Button
│   └── Cancel Button
├── Quiet Hours Section
│   ├── Enable checkbox
│   ├── Start time selector
│   ├── End time selector
│   └── Timezone selector
├── Frequency Cap Section
│   ├── Enable checkbox
│   ├── Max messages input
│   └── Per period selector
├── Deduplication Section
│   ├── Enable checkbox
│   └── Window minutes input
└── Error Banner (if validation fails)
```

## Data Flow

### 🔄 **State Management**

```typescript
// Main page state
const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
const [templateDrawer, setTemplateDrawer] = useState({ isOpen: false, triggerKey: '', template: '' });
const [rulesModal, setRulesModal] = useState({ isOpen: false, triggerKey: '' });

// Data hooks
const { data: automations, isLoading } = useAutomations();
const updateAutomations = useUpdateAutomations();
const { toggle, isUpdating } = useToggleAutomation(triggerKey);
```

### 🔄 **User Interactions**

```typescript
// Toggle automation
const handleToggle = async (triggerKey: string, enabled: boolean) => {
  await toggle(enabled);
};

// Edit template
const handleEditTemplate = (triggerKey: string) => {
  const config = automations?.automations[triggerKey];
  setTemplateDrawer({
    isOpen: true,
    triggerKey,
    template: config?.template || '',
  });
};

// Edit rules
const handleEditRules = (triggerKey: string) => {
  setRulesModal({ isOpen: true, triggerKey });
};

// Save template
const handleSaveTemplate = (triggerKey: string, template: string) => {
  const currentConfig = automations?.automations[triggerKey];
  const updatedConfig = { ...currentConfig, template };
  updateAutomations.mutateAsync({ [triggerKey]: updatedConfig });
};

// Save rules
const handleSaveRules = (triggerKey: string, rules: AutomationRules) => {
  const currentConfig = automations?.automations[triggerKey];
  const updatedConfig = { ...currentConfig, rules };
  updateAutomations.mutateAsync({ [triggerKey]: updatedConfig });
};
```

## Component Props

### 🎯 **AutomationCard Props**

```typescript
interface AutomationCardProps {
  triggerKey: string;                    // 'abandoned' | 'orderPaid' | etc.
  title: string;                        // Display title
  description: string;                  // Description text
  config: AutomationConfig | null;      // Current configuration
  onToggle: (enabled: boolean) => void; // Toggle handler
  onEditTemplate: () => void;           // Edit template handler
  onEditRules: () => void;              // Edit rules handler
  onPreview?: () => void;               // Preview handler (optional)
  onTest?: () => void;                  // Test handler (optional)
  isLoading?: boolean;                  // Loading state
  metrics?: {                           // Metrics data (optional)
    sent?: number;
    delivered?: number;
    ctr?: number;
    period?: string;
  };
}
```

### 🎨 **TemplateDrawer Props**

```typescript
interface TemplateDrawerProps {
  isOpen: boolean;                      // Drawer visibility
  onClose: () => void;                  // Close handler
  triggerKey: string;                   // Automation trigger
  template: string;                     // Current template
  onSave: (template: string) => void;   // Save handler
}
```

### ⚙️ **AutomationRulesModal Props**

```typescript
interface AutomationRulesModalProps {
  isOpen: boolean;                      // Modal visibility
  onClose: () => void;                  // Close handler
  onSave: (rules: AutomationRules) => void; // Save handler
  initialRules?: AutomationRules;        // Initial rules
  isLoading?: boolean;                  // Loading state
}
```

## Variable Contexts

### 📱 **Abandoned Checkout Variables**

```typescript
const abandonedVariables = {
  customer_name: 'John Doe',
  checkout_url: 'https://shop.myshopify.com/checkout/123',
  cart_total: '$99.99',
  discount_code: 'SAVE10',
};
```

### 💳 **Order Paid Variables**

```typescript
const orderPaidVariables = {
  customer_name: 'John Doe',
  order_number: '#1001',
  order_total: '$99.99',
  tracking_url: 'https://tracking.com/123',
};
```

### 📦 **Fulfillment Update Variables**

```typescript
const fulfillmentVariables = {
  customer_name: 'John Doe',
  order_number: '#1001',
  tracking_number: '1Z999AA1234567890',
  tracking_url: 'https://tracking.com/123',
};
```

### 👋 **Welcome Variables**

```typescript
const welcomeVariables = {
  customer_name: 'John Doe',
  discount_code: 'WELCOME10',
  discount_value: '10%',
};
```

### 📱 **Back in Stock Variables**

```typescript
const backInStockVariables = {
  customer_name: 'John Doe',
  product_name: 'Amazing Product',
  product_url: 'https://shop.myshopify.com/products/amazing',
};
```

## Rules Configuration

### 🕐 **Quiet Hours**

```typescript
interface QuietHours {
  enabled: boolean;                     // Enable quiet hours
  start: number;                        // Start hour (0-23)
  end: number;                          // End hour (0-23)
  zone: string;                         // Timezone
}
```

### 📈 **Frequency Cap**

```typescript
interface FrequencyCap {
  enabled: boolean;                     // Enable frequency cap
  max: number;                          // Max messages (1-100)
  per: 'hour' | 'day' | 'week';        // Time period
}
```

### 🔄 **Deduplication**

```typescript
interface Deduplication {
  enabled: boolean;                     // Enable deduplication
  minutes: number;                      // Window in minutes (5-1440)
}
```

## Validation Rules

### ✅ **Template Validation**

```typescript
// Template length validation
if (template.length > 160) {
  errors.template = 'Template is too long (max 160 characters)';
}

// Required template validation
if (!template.trim()) {
  errors.template = 'Template is required';
}
```

### ✅ **Rules Validation**

```typescript
// Quiet hours validation
if (rules.quietHours?.enabled) {
  if (rules.quietHours.start < 0 || rules.quietHours.start > 23) {
    errors.quietStart = 'Start hour must be between 0 and 23';
  }
  if (rules.quietHours.end < 0 || rules.quietHours.end > 23) {
    errors.quietEnd = 'End hour must be between 0 and 23';
  }
}

// Frequency cap validation
if (rules.frequencyCap?.enabled) {
  if (rules.frequencyCap.max < 1 || rules.frequencyCap.max > 100) {
    errors.frequencyMax = 'Max messages must be between 1 and 100';
  }
}

// Deduplication validation
if (rules.dedupeWindowMin < 5 || rules.dedupeWindowMin > 1440) {
  errors.dedupeMinutes = 'Dedupe window must be between 5 and 1440 minutes';
}
```

## Error Handling

### 🚨 **Error States**

```typescript
// Loading state
if (isLoading) {
  return <Spinner size="small" />;
}

// Error state
if (error) {
  return (
    <Banner tone="critical">
      <Text as="p">Failed to load automations: {error.message}</Text>
    </Banner>
  );
}

// Empty state
if (!automations) {
  return (
    <EmptyState
      heading="No automations found"
      image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
    >
      <Text as="p">Automations will appear here once they are configured.</Text>
    </EmptyState>
  );
}
```

### 🔄 **Optimistic Updates**

```typescript
// Optimistic update with rollback
const updateAutomations = useMutation({
  mutationFn: (payload) => apiClient.updateAutomations({ shop, payload }),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['automations', shop] });
    
    // Snapshot previous value
    const previousData = queryClient.getQueryData(['automations', shop]);
    
    // Optimistically update
    queryClient.setQueryData(['automations', shop], (old) => ({
      ...old,
      ...newData,
    }));
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    if (context?.previousData) {
      queryClient.setQueryData(['automations', shop], context.previousData);
    }
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['automations', shop] });
  },
});
```

## Accessibility

### ♿ **Accessibility Features**

```typescript
// Proper ARIA labels
<Button
  aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${title} automation`}
  onClick={() => onToggle(!isEnabled)}
>
  {isEnabled ? 'Disable' : 'Enable'}
</Button>

// Keyboard navigation
<ButtonGroup>
  <Button variant="secondary" onClick={onEditTemplate}>
    Edit Template
  </Button>
  <Button variant="secondary" onClick={onEditRules}>
    Rules
  </Button>
</ButtonGroup>

// Screen reader support
<Text variant="bodySm" as="span" tone={hasTemplate ? 'success' : 'critical'}>
  {hasTemplate ? 'Template configured' : 'No template set'}
</Text>
```

## Performance

### ⚡ **Performance Optimizations**

```typescript
// Memoized components
const AutomationCard = React.memo(({ triggerKey, title, description, config, onToggle, onEditTemplate, onEditRules, onPreview, onTest, isLoading, metrics }) => {
  // Component implementation
});

// Lazy loading
const TemplateDrawer = lazy(() => import('./TemplateDrawer'));
const AutomationRulesModal = lazy(() => import('./AutomationRulesModal'));

// Debounced search
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    // Search logic
  }, 300),
  []
);
```

This blueprint provides a comprehensive guide for implementing the Automations UI with proper data flow, component structure, and user experience considerations.
