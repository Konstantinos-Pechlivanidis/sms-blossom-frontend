import { DateRange } from '../components/DateRangeSelector';

/**
 * Generate CSV content from data array and headers
 */
export function generateCSV(data: any[], headers: string[]): string {
  if (!data || data.length === 0) {
    return headers.join(',');
  }
  
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const escapedValue = String(value).replace(/"/g, '""');
      return /[",\n\r]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Generate JSON content from data
 */
export function generateJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Generate safe filename with timestamp
 */
export function generateFilename(type: string, format: string, dateRange: DateRange): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  const safeType = type.replace(/[^a-zA-Z0-9]/g, '-');
  const safeFrom = dateRange.from.replace(/[^a-zA-Z0-9]/g, '-');
  const safeTo = dateRange.to.replace(/[^a-zA-Z0-9]/g, '-');
  
  return `sms-reports-${safeType}-${safeFrom}-to-${safeTo}.${format}`;
}

/**
 * Download file with generated content
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Generate CSV headers for different report types
 */
export function getCSVHeaders(type: string): string[] {
  switch (type) {
    case 'overview':
      return ['metric', 'value'];
    case 'messaging':
      return ['day', 'sent', 'delivered', 'failed', 'cost'];
    case 'campaigns':
      return ['campaignId', 'name', 'revenue', 'orders', 'clicks_lifetime'];
    case 'automations':
      return ['automation', 'orders', 'revenue'];
    default:
      return [];
  }
}

/**
 * Transform data for CSV export
 */
export function transformDataForCSV(data: any, type: string): any[] {
  switch (type) {
    case 'overview':
      return [
        { metric: 'Total Sent', value: data.sent || 0 },
        { metric: 'Total Delivered', value: data.delivered || 0 },
        { metric: 'Total Failed', value: data.failed || 0 },
        { metric: 'Delivery Rate', value: `${data.deliveryRate || 0}%` },
        { metric: 'Total Cost', value: data.cost || 0 },
        { metric: 'Opt-ins', value: data.optIns || 0 },
        { metric: 'Opt-outs', value: data.optOuts || 0 },
      ];
      
    case 'messaging':
      return data.series || [];
      
    case 'campaigns':
      return data.items || [];
      
    case 'automations':
      return data.items || [];
      
    default:
      return [];
  }
}

/**
 * Generate PDF content (simple text-based for now)
 */
export function generatePDFContent(data: any, type: string, dateRange: DateRange): string {
  const timestamp = new Date().toISOString();
  const title = `SMS Reports - ${type.toUpperCase()}`;
  
  let content = `
${title}
${'='.repeat(title.length)}

Date Range: ${dateRange.from} to ${dateRange.to}
Generated: ${timestamp}

`;
  
  switch (type) {
    case 'overview':
      content += `
OVERVIEW METRICS
${'-'.repeat(20)}
Total Sent: ${data.sent || 0}
Total Delivered: ${data.delivered || 0}
Total Failed: ${data.failed || 0}
Delivery Rate: ${data.deliveryRate || 0}%
Total Cost: ${data.cost || 0}
Opt-ins: ${data.optIns || 0}
Opt-outs: ${data.optOuts || 0}
`;
      break;
      
    case 'messaging':
      content += `
MESSAGING TIMESERIES
${'-'.repeat(25)}
${(data.series || []).map((point: any) => 
  `${point.day}: Sent ${point.sent}, Delivered ${point.delivered}, Failed ${point.failed}`
).join('\n')}
`;
      break;
      
    case 'campaigns':
      content += `
CAMPAIGN ATTRIBUTION
${'-'.repeat(22)}
${(data.items || []).map((campaign: any) => 
  `${campaign.name || campaign.campaignId}: Revenue ${campaign.revenue}, Orders ${campaign.orders}`
).join('\n')}
`;
      break;
      
    case 'automations':
      content += `
AUTOMATION ATTRIBUTION
${'-'.repeat(25)}
${(data.items || []).map((automation: any) => 
  `${automation.automation}: Orders ${automation.orders}, Revenue ${automation.revenue}`
).join('\n')}
`;
      break;
  }
  
  return content.trim();
}

/**
 * Validate date range
 */
export function validateDateRange(dateRange: DateRange): { isValid: boolean; error?: string } {
  const fromDate = new Date(dateRange.from);
  const toDate = new Date(dateRange.to);
  const today = new Date();
  
  if (fromDate >= toDate) {
    return { isValid: false, error: 'Start date must be before end date' };
  }
  
  if (toDate > today) {
    return { isValid: false, error: 'End date cannot be in the future' };
  }
  
  const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 365) {
    return { isValid: false, error: 'Date range cannot exceed 1 year' };
  }
  
  return { isValid: true };
}

/**
 * Get export file size estimate
 */
export function getExportSizeEstimate(data: any, format: string): string {
  const content = format === 'csv' ? generateCSV(transformDataForCSV(data, 'overview'), getCSVHeaders('overview')) : generateJSON(data);
  const sizeInBytes = new Blob([content]).size;
  
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
