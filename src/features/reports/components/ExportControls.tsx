import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  InlineStack,
  Text,
  Card,
  Banner,
  Spinner,
  Select,
  Popover,
  BlockStack,
} from '@shopify/polaris';
import { ViewIcon } from '@shopify/polaris-icons';
import { generateCSV, generateJSON, generateFilename, downloadFile } from '../utils/exportUtils';
import { DateRange } from './DateRangeSelector';

interface ExportControlsProps {
  data: any;
  type: 'overview' | 'messaging' | 'campaigns' | 'automations';
  dateRange: DateRange;
  onExport?: (format: 'csv' | 'json' | 'pdf') => void;
}

export function ExportControls({ data, type, dateRange, onExport }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [showFormatSelector, setShowFormatSelector] = useState(false);
  const [exportError, setExportError] = useState('');

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setIsExporting(true);
    setExportError('');
    
    try {
      let content: string;
      let mimeType: string;
      let filename: string;
      
      switch (format) {
        case 'csv':
          content = generateCSVFromData(data, type);
          mimeType = 'text/csv';
          filename = generateFilename(type, 'csv', dateRange);
          break;
        case 'json':
          content = generateJSON(data);
          mimeType = 'application/json';
          filename = generateFilename(type, 'json', dateRange);
          break;
        case 'pdf':
          // For PDF, we'll generate a simple text representation
          content = generatePDFFromData(data, type, dateRange);
          mimeType = 'application/pdf';
          filename = generateFilename(type, 'pdf', dateRange);
          break;
        default:
          throw new Error('Unsupported export format');
      }
      
      downloadFile(content, filename, mimeType);
      
      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSVFromData = (data: any, type: string): string => {
    switch (type) {
      case 'overview':
        return generateCSV([
          { metric: 'Total Sent', value: data.sent || 0 },
          { metric: 'Total Delivered', value: data.delivered || 0 },
          { metric: 'Total Failed', value: data.failed || 0 },
          { metric: 'Delivery Rate', value: `${data.deliveryRate || 0}%` },
          { metric: 'Total Cost', value: data.cost || 0 },
          { metric: 'Opt-ins', value: data.optIns || 0 },
          { metric: 'Opt-outs', value: data.optOuts || 0 },
        ], ['metric', 'value']);
        
      case 'messaging':
        if (data.series && Array.isArray(data.series)) {
          return generateCSV(data.series, ['day', 'sent', 'delivered', 'failed', 'cost']);
        }
        return generateCSV([], []);
        
      case 'campaigns':
        if (data.items && Array.isArray(data.items)) {
          return generateCSV(data.items, ['campaignId', 'name', 'revenue', 'orders', 'clicks_lifetime']);
        }
        return generateCSV([], []);
        
      case 'automations':
        if (data.items && Array.isArray(data.items)) {
          return generateCSV(data.items, ['automation', 'orders', 'revenue']);
        }
        return generateCSV([], []);
        
      default:
        return generateCSV([], []);
    }
  };

  const generatePDFFromData = (data: any, type: string, dateRange: DateRange): string => {
    // Simple text-based PDF content (in real implementation, use a PDF library)
    const content = `
SMS Reports - ${type.toUpperCase()}
Date Range: ${dateRange.from} to ${dateRange.to}
Generated: ${new Date().toISOString()}

${JSON.stringify(data, null, 2)}
    `.trim();
    
    return content;
  };

  const formatOptions = [
    { label: 'CSV', value: 'csv' },
    { label: 'JSON', value: 'json' },
    { label: 'PDF', value: 'pdf' },
  ];

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h3">
            Export Data
          </Text>
          
          <InlineStack gap="200">
            <Popover
              active={showFormatSelector}
              activator={
                <Button
                  icon={ViewIcon}
                  onClick={() => setShowFormatSelector(!showFormatSelector)}
                  disabled={isExporting || !data}
                >
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              }
              onClose={() => setShowFormatSelector(false)}
            >
              <div style={{ padding: '16px', minWidth: '200px' }}>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h4">
                    Export Format
                  </Text>
                  
                  <Select
                    label="Format"
                    options={formatOptions}
                    value={exportFormat}
                    onChange={(value) => setExportFormat(value as 'csv' | 'json' | 'pdf')}
                  />
                  
                  <ButtonGroup>
                    <Button 
                      onClick={() => {
                        handleExport(exportFormat);
                        setShowFormatSelector(false);
                      }}
                      loading={isExporting}
                    >
                      Download
                    </Button>
                    <Button onClick={() => setShowFormatSelector(false)}>
                      Cancel
                    </Button>
                  </ButtonGroup>
                </BlockStack>
              </div>
            </Popover>
          </InlineStack>
        </InlineStack>
        
        {exportError && (
          <Banner tone="critical">
            <Text as="p">{exportError}</Text>
          </Banner>
        )}
        
        {isExporting && (
          <InlineStack align="center" gap="200">
            <Spinner size="small" />
            <Text as="p">Generating export...</Text>
          </InlineStack>
        )}
        
        <Text tone="subdued" as="p">
          Export {type} data for the selected date range. Choose your preferred format.
        </Text>
      </BlockStack>
    </Card>
  );
}
