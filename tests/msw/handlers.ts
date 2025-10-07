import { http, HttpResponse } from 'msw';

// Health endpoint
export const healthHandler = http.get('*/health', () => {
  return HttpResponse.json({
    status: 'ok',
    version: '1.0.0',
    db: true,
    queue: 'active',
  });
});

// Dashboard KPIs
export const dashboardKpisHandler = http.get('*/api/dashboard/kpis', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    total_subscribers: 1250,
    active_campaigns: 3,
    total_sent: 15420,
    delivery_rate: 0.98,
    opt_out_rate: 0.02,
    revenue_attributed: 1250.50,
    last_updated: new Date().toISOString(),
  });
});

// Campaigns endpoints
export const campaignsListHandler = http.get('*/api/campaigns', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    campaigns: [
      {
        id: 'camp_1',
        name: 'Welcome Series',
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        message_count: 3,
        sent_count: 1250,
        delivery_rate: 0.98,
      },
      {
        id: 'camp_2',
        name: 'Abandoned Cart',
        status: 'draft',
        created_at: '2024-01-16T14:30:00Z',
        updated_at: '2024-01-16T14:30:00Z',
        message_count: 1,
        sent_count: 0,
        delivery_rate: 0,
      },
    ],
    total: 2,
    page: 1,
    per_page: 20,
  });
});

export const campaignCreateHandler = http.post('*/api/campaigns', async ({ request }) => {
  const body = await request.json() as any;
  
  if (!body.name || !body.template_id) {
    return HttpResponse.json(
      { error: 'validation_error', details: 'Name and template_id are required' },
      { status: 422 }
    );
  }

  return HttpResponse.json({
    id: 'camp_new',
    name: body.name,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message_count: 0,
    sent_count: 0,
    delivery_rate: 0,
  }, { status: 201 });
});

// Discounts endpoints
export const discountsListHandler = http.get('*/api/discounts', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    discounts: [
      {
        id: 'disc_1',
        code: 'SMS10',
        type: 'percentage',
        value: 10,
        status: 'active',
        usage_count: 45,
        usage_limit: 100,
        expires_at: '2024-12-31T23:59:59Z',
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 'disc_2',
        code: 'SMS20',
        type: 'fixed_amount',
        value: 5.00,
        status: 'active',
        usage_count: 12,
        usage_limit: 50,
        expires_at: null,
        created_at: '2024-01-16T14:30:00Z',
      },
    ],
    total: 2,
    page: 1,
    per_page: 20,
  });
});

export const discountCreateHandler = http.post('*/api/discounts', async ({ request }) => {
  const body = await request.json() as any;
  
  if (!body.code || !body.type || !body.value) {
    return HttpResponse.json(
      { error: 'validation_error', details: 'Code, type, and value are required' },
      { status: 422 }
    );
  }

  // Simulate conflict check
  if (body.code === 'CONFLICT') {
    return HttpResponse.json(
      { error: 'discount_conflict', details: 'Code already exists' },
      { status: 409 }
    );
  }

  return HttpResponse.json({
    id: 'disc_new',
    code: body.code,
    type: body.type,
    value: body.value,
    status: 'active',
    usage_count: 0,
    usage_limit: body.usage_limit || null,
    expires_at: body.expires_at || null,
    created_at: new Date().toISOString(),
  }, { status: 201 });
});

// Templates endpoints
export const templatesListHandler = http.get('*/api/templates', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    templates: [
      {
        id: 'tpl_1',
        name: 'Welcome Message',
        content: 'Welcome to {{shop_name}}! Use code {{discount_code}} for 10% off.',
        variables: ['shop_name', 'discount_code'],
        triggers: ['welcome'],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
      {
        id: 'tpl_2',
        name: 'Abandoned Cart',
        content: 'Don\'t forget your items! Complete your purchase with {{checkout_url}}',
        variables: ['checkout_url', 'customer_name'],
        triggers: ['abandoned_cart'],
        created_at: '2024-01-16T14:30:00Z',
        updated_at: '2024-01-16T14:30:00Z',
      },
    ],
    total: 2,
    page: 1,
    per_page: 20,
  });
});

export const templatePreviewHandler = http.post('*/api/templates/preview', async ({ request }) => {
  const body = await request.json() as any;
  
  if (!body.content) {
    return HttpResponse.json(
      { error: 'validation_error', details: 'Content is required' },
      { status: 422 }
    );
  }

  return HttpResponse.json({
    preview: body.content.replace(/\{\{(\w+)\}\}/g, (match: string, variable: string) => {
      const mockValues: Record<string, string> = {
        shop_name: 'Test Shop',
        discount_code: 'SAVE10',
        customer_name: 'John Doe',
        checkout_url: 'https://test-shop.myshopify.com/cart',
      };
      return mockValues[variable] || `[${variable}]`;
    }),
    variables: Array.from(new Set(body.content.match(/\{\{(\w+)\}\}/g)?.map((m: string) => m.slice(2, -2)) || [])),
  });
});

// Settings endpoints
export const settingsGetHandler = http.get('*/api/settings', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    quiet_hours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
      timezone: 'America/New_York',
    },
    notifications: {
      email: true,
      sms: false,
    },
    automation: {
      welcome_series: true,
      abandoned_cart: true,
      birthday_reminders: false,
    },
    compliance: {
      gdpr_enabled: true,
      can_spam_compliant: true,
    },
  });
});

export const settingsUpdateHandler = http.put('*/api/settings', async ({ request }) => {
  const body = await request.json() as any;
  
  return HttpResponse.json({
    ...body,
    updated_at: new Date().toISOString(),
  });
});

// Reports endpoints
export const reportsOverviewHandler = http.get('*/api/reports/overview', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  const window = url.searchParams.get('window') || '30d';
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    period: window,
    total_subscribers: 1250,
    new_subscribers: 45,
    total_sent: 15420,
    delivery_rate: 0.98,
    open_rate: 0.85,
    click_rate: 0.12,
    opt_out_rate: 0.02,
    revenue_attributed: 1250.50,
    cost_savings: 320.75,
  });
});

// Automations endpoints
export const automationsGetHandler = http.get('*/api/automations', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    automations: {
      abandoned: {
        enabled: true,
        template: 'Hello {{customer_name}}, complete your purchase: {{checkout_url}}',
        rules: {
          quietHours: { enabled: true, start: 22, end: 8, zone: 'UTC' },
          frequencyCap: { enabled: true, max: 1, per: 'day' },
          dedupeWindowMin: 60,
        },
        delayMinutes: 30,
      },
      orderPaid: {
        enabled: false,
        template: 'Thank you {{customer_name}}! Your order #{{order_number}} is confirmed.',
        rules: {
          quietHours: { enabled: false, start: 22, end: 8, zone: 'UTC' },
          frequencyCap: { enabled: false, max: 1, per: 'day' },
          dedupeWindowMin: 60,
        },
      },
      fulfillmentUpdate: {
        enabled: true,
        template: 'Your order #{{order_number}} is on the way! Track: {{tracking_url}}',
        rules: {
          quietHours: { enabled: true, start: 22, end: 8, zone: 'UTC' },
          frequencyCap: { enabled: true, max: 1, per: 'day' },
          dedupeWindowMin: 60,
        },
      },
      welcome: {
        enabled: true,
        template: 'Welcome {{customer_name}}! Use code {{discount_code}} for 10% off.',
        rules: {
          quietHours: { enabled: false, start: 22, end: 8, zone: 'UTC' },
          frequencyCap: { enabled: false, max: 1, per: 'day' },
          dedupeWindowMin: 60,
        },
      },
      backInStock: {
        enabled: false,
        template: '{{product_name}} is back in stock! Shop now: {{product_url}}',
        rules: {
          quietHours: { enabled: false, start: 22, end: 8, zone: 'UTC' },
          frequencyCap: { enabled: false, max: 1, per: 'day' },
          dedupeWindowMin: 60,
        },
      },
    },
  });
});

export const automationsUpdateHandler = http.put('*/api/automations', async ({ request }) => {
  const body = await request.json() as any;
  
  return HttpResponse.json({
    automations: body,
    updated_at: new Date().toISOString(),
  });
});

// Contacts endpoints
export const contactsListHandler = http.get('*/api/contacts', ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return HttpResponse.json(
      { error: 'shop_required' },
      { status: 400 }
    );
  }

  return HttpResponse.json({
    contacts: [
      {
        id: 'contact_1',
        phone: '+1234567890',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        subscribed: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastActivity: '2024-01-20T14:30:00Z',
      },
      {
        id: 'contact_2',
        phone: '+1987654321',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        status: 'active',
        subscribed: true,
        createdAt: '2024-01-16T11:20:00Z',
        lastActivity: '2024-01-19T09:15:00Z',
      },
    ],
    total: 2,
    page: 1,
    per_page: 20,
  });
});

export const contactCreateHandler = http.post('*/api/contacts', async ({ request }) => {
  const body = await request.json() as any;
  
  if (!body.phone) {
    return HttpResponse.json(
      { error: 'validation_error', details: 'Phone is required' },
      { status: 422 }
    );
  }

  return HttpResponse.json({
    id: 'contact_new',
    phone: body.phone,
    email: body.email || null,
    firstName: body.firstName || null,
    lastName: body.lastName || null,
    status: 'active',
    subscribed: true,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  }, { status: 201 });
});

// Error scenarios
export const errorHandlers = {
  unauthorized: http.get('*/api/unauthorized', () => {
    return HttpResponse.json(
      { error: 'invalid_token' },
      { status: 401 }
    );
  }),
  
  forbidden: http.get('*/api/forbidden', () => {
    return HttpResponse.json(
      { error: 'unauthorized' },
      { status: 403 }
    );
  }),
  
  notFound: http.get('*/api/notfound', () => {
    return HttpResponse.json(
      { error: 'campaign_not_found' },
      { status: 404 }
    );
  }),
  
  conflict: http.get('*/api/conflict', () => {
    return HttpResponse.json(
      { error: 'discount_conflict' },
      { status: 409 }
    );
  }),
  
  validationError: http.get('*/api/validation', () => {
    return HttpResponse.json(
      { error: 'validation_error', details: 'Invalid input' },
      { status: 422 }
    );
  }),
  
  rateLimited: http.get('*/api/ratelimit', () => {
    return HttpResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }),
  
  serverError: http.get('*/api/servererror', () => {
    return HttpResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    );
  }),
};

// Export all handlers
export const handlers = [
  healthHandler,
  dashboardKpisHandler,
  campaignsListHandler,
  campaignCreateHandler,
  discountsListHandler,
  discountCreateHandler,
  templatesListHandler,
  templatePreviewHandler,
  settingsGetHandler,
  settingsUpdateHandler,
  reportsOverviewHandler,
  automationsGetHandler,
  automationsUpdateHandler,
  contactsListHandler,
  contactCreateHandler,
  ...Object.values(errorHandlers),
];
