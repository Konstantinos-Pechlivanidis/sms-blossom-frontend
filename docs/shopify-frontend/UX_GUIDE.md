# SMS Blossom Frontend UX Guide

## Architecture Overview

### **PAGES Registry**
| Page | Route | Primary Action | Backend Operations |
|------|-------|----------------|-------------------|
| **Dashboard** | `/` | Create Campaign | `getHealth`, `getOverviewReport`, `getMessagingReport` |
| **Contacts** | `/contacts` | Add Contact | `listSegments`, `previewSegment` |
| **Discounts** | `/discounts` | Create Discount | `listDiscounts`, `createDiscount`, `checkDiscountConflicts` |
| **Segments** | `/segments` | Create Segment | `listSegments`, `createSegment`, `previewSegment` |
| **Templates** | `/templates` | Create Template | `listTemplates`, `createTemplate`, `previewTemplate` |
| **Campaigns** | `/campaigns` | Create Campaign | `listCampaigns`, `createCampaign`, `estimateCampaign` |
| **Campaign Detail** | `/campaigns/:id` | Send Campaign | `getCampaign`, `sendCampaign`, `testSendCampaign` |
| **Automations** | `/automations` | Configure Rules | `getSettings`, `updateSettings` |
| **Reports** | `/reports` | Export Report | `getOverviewReport`, `getMessagingReport` |
| **Settings** | `/settings` | Save Settings | `getSettings`, `updateSettings` |

### **COMPONENTS Registry**
| Component | Purpose | Status |
|-----------|---------|--------|
| **PageHeader** | Standard page header with actions | 🔄 **TO CREATE** |
| **HelpDialog** | Contextual help modal | 🔄 **TO CREATE** |
| **ActionWithHelp** | Button with help tooltip | 🔄 **TO CREATE** |
| **KpiCard** | Consistent KPI display | 🔄 **TO CREATE** |
| **EmptyStateCard** | Standard empty state | 🔄 **TO CREATE** |
| **ConfirmModal** | Destructive action confirmation | 🔄 **TO CREATE** |
| **FormScaffold** | Opinionated form wrapper | 🔄 **TO CREATE** |
| **IPhoneSmsPreview** | Live SMS preview | 🔄 **TO CREATE** |

## Design Patterns

### **1. Page Layout Pattern**
```tsx
<Page>
  <PageHeader 
    title="Page Title"
    subtitle="Value proposition"
    primaryAction={primaryAction}
    secondaryActions={secondaryActions}
    onHelp={handleHelp}
  />
  <Layout>
    <Layout.Section>
      <Card>
        {/* Page content */}
      </Card>
    </Layout.Section>
  </Layout>
</Page>
```

### **2. Action Model**
- **Primary Action**: 1 per page (most important action)
- **Secondary Actions**: ≤2 per page (important but not primary)
- **Overflow Actions**: Everything else in ActionMenu
- **Destructive Actions**: Secondary with confirmation modal

### **3. Help System**
- **Page Help**: HelpDialog with page-specific guidance
- **Action Help**: ActionWithHelp for complex actions
- **Contextual Help**: Tooltips for form fields

### **4. Form Patterns**
- **FormScaffold**: Consistent form wrapper
- **ContextualSaveBar**: Sticky save bar on dirty
- **Inline Validation**: Real-time error display
- **Loading States**: Skeleton components

### **5. Data Display**
- **KpiCard**: Consistent KPI display
- **EmptyStateCard**: Standard empty states
- **Loading States**: Polaris Skeleton components
- **Error States**: Polaris Banner components

## Backend Integration

### **API Operations Mapping**
| Page | Operations | Purpose |
|------|------------|---------|
| **Dashboard** | `getHealth`, `getOverviewReport` | System health, KPI display |
| **Campaigns** | `listCampaigns`, `createCampaign`, `estimateCampaign` | Campaign management |
| **Templates** | `listTemplates`, `createTemplate`, `previewTemplate` | Template management |
| **Segments** | `listSegments`, `createSegment`, `previewSegment` | Audience targeting |
| **Discounts** | `listDiscounts`, `createDiscount`, `checkDiscountConflicts` | Discount management |
| **Settings** | `getSettings`, `updateSettings` | Configuration |

### **Data Flow**
1. **Page Load**: Fetch initial data with hooks
2. **User Action**: Trigger mutation with optimistic updates
3. **Success**: Show toast, refresh data
4. **Error**: Show banner, allow retry

## Accessibility

### **Keyboard Navigation**
- **Enter**: Submit forms, activate primary actions
- **Escape**: Cancel modals, close dialogs
- **Tab**: Navigate through interactive elements

### **Screen Reader Support**
- **ARIA Labels**: All interactive elements
- **Focus Management**: Modal focus traps
- **Semantic HTML**: Proper heading hierarchy

### **Touch Targets**
- **Minimum Size**: 44x44pt (Apple HIG)
- **Spacing**: Adequate touch targets
- **Mobile Navigation**: Collapsible navigation

## Performance

### **Loading States**
- **Skeleton Components**: For data loading
- **Lazy Loading**: For heavy routes
- **Optimistic Updates**: For better UX

### **Error Handling**
- **Error Boundaries**: Catch component errors
- **Retry Mechanisms**: Allow user retry
- **Fallback UI**: Graceful degradation

## Brand Integration

### **Color Palette**
- **Primary**: Teal gradient (`#14b8a6` to `#0d9488`)
- **Secondary**: Soft greys (`#f8fafc`, `#e2e8f0`)
- **Accent**: Polaris brand colors

### **Typography**
- **Headings**: Polaris heading variants
- **Body**: Polaris body text
- **Code**: Monospace for technical content

### **Spacing**
- **Polaris Tokens**: Consistent spacing scale
- **Responsive**: Mobile-first approach
- **Grid System**: Polaris Layout components

## Quality Gates

### **Code Quality**
- **TypeScript**: Strict type checking
- **ESLint**: Code quality rules
- **Prettier**: Code formatting

### **Testing**
- **Unit Tests**: Component testing
- **Integration Tests**: Page testing
- **E2E Tests**: User journey testing

### **Performance**
- **Bundle Size**: Optimized builds
- **Runtime Performance**: Efficient rendering
- **Accessibility**: WCAG compliance

## Implementation Checklist

### **Phase 1: Foundation**
- [ ] Create PageHeader component
- [ ] Create HelpDialog component
- [ ] Create ActionWithHelp component
- [ ] Create KpiCard component
- [ ] Create EmptyStateCard component
- [ ] Create ConfirmModal component
- [ ] Create FormScaffold component
- [ ] Create IPhoneSmsPreview component

### **Phase 2: Page Refactoring**
- [ ] Refactor Dashboard page
- [ ] Refactor Campaigns page
- [ ] Refactor Templates page
- [ ] Refactor Segments page
- [ ] Refactor Discounts page
- [ ] Refactor Contacts page
- [ ] Refactor Settings page
- [ ] Refactor Reports page
- [ ] Refactor Automations page

### **Phase 3: Campaign Wizard**
- [ ] Implement Audience step
- [ ] Implement Message step with live preview
- [ ] Implement Discount step
- [ ] Implement Schedule step
- [ ] Implement Review step

### **Phase 4: Documentation**
- [ ] Create page contracts
- [ ] Update UX guide
- [ ] Create component documentation
- [ ] Add accessibility guidelines

## Success Metrics

### **User Experience**
- **Task Completion**: Users can complete primary tasks
- **Error Rate**: Reduced user errors
- **Help Usage**: Contextual help is used

### **Developer Experience**
- **Code Reuse**: Components are reused
- **Maintainability**: Easy to update
- **Performance**: Fast load times

### **Accessibility**
- **WCAG Compliance**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper screen reader support
