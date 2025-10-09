import React, { useState } from 'react';
import {
  Select,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Card,
  TextField,
  Banner,
  Popover,
  ButtonGroup,
} from '@shopify/polaris';
import { CalendarIcon } from '@shopify/polaris-icons';

export interface DateRange {
  from: string;
  to: string;
  label: string;
}

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
}

export function DateRangeSelector({ value, onChange, disabled }: DateRangeSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [customError, setCustomError] = useState('');

  const standardRanges = [
    { 
      label: 'Last 7 days', 
      value: '7d',
      getRange: () => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 7);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
          label: 'Last 7 days'
        };
      }
    },
    { 
      label: 'Last 30 days', 
      value: '30d',
      getRange: () => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 30);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
          label: 'Last 30 days'
        };
      }
    },
    { 
      label: 'Last 90 days', 
      value: '90d',
      getRange: () => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 90);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
          label: 'Last 90 days'
        };
      }
    },
    { 
      label: 'Last year', 
      value: '1y',
      getRange: () => {
        const to = new Date();
        const from = new Date();
        from.setFullYear(from.getFullYear() - 1);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
          label: 'Last year'
        };
      }
    },
  ];

  const handleStandardRangeChange = (rangeValue: string) => {
    const range = standardRanges.find(r => r.value === rangeValue);
    if (range) {
      onChange(range.getRange());
    }
  };

  const handleCustomRangeSubmit = () => {
    setCustomError('');
    
    if (!customFrom || !customTo) {
      setCustomError('Both start and end dates are required');
      return;
    }
    
    const fromDate = new Date(customFrom);
    const toDate = new Date(customTo);
    
    if (fromDate >= toDate) {
      setCustomError('Start date must be before end date');
      return;
    }
    
    const today = new Date();
    if (toDate > today) {
      setCustomError('End date cannot be in the future');
      return;
    }
    
    onChange({
      from: customFrom,
      to: customTo,
      label: `Custom: ${customFrom} to ${customTo}`
    });
    
    setShowCustom(false);
  };

  const handleCustomRangeCancel = () => {
    setCustomFrom('');
    setCustomTo('');
    setCustomError('');
    setShowCustom(false);
  };

  const getCurrentRangeValue = () => {
    const range = standardRanges.find(r => {
      const standardRange = r.getRange();
      return standardRange.from === value.from && standardRange.to === value.to;
    });
    return range?.value || 'custom';
  };

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h3">
            Date Range
          </Text>
          <InlineStack gap="200">
            <Select
              label="Time Period"
              labelHidden
              options={[
                ...standardRanges.map(range => ({
                  label: range.label,
                  value: range.value
                })),
                { label: 'Custom Range', value: 'custom' }
              ]}
              value={getCurrentRangeValue()}
              onChange={handleStandardRangeChange}
              disabled={disabled}
            />
            
            <Popover
              active={showCustom}
              activator={
                <Button
                  icon={CalendarIcon}
                  onClick={() => setShowCustom(!showCustom)}
                  disabled={disabled}
                >
                  Custom
                </Button>
              }
              onClose={() => setShowCustom(false)}
            >
              <div style={{ padding: '16px', minWidth: '300px' }}>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h4">
                    Custom Date Range
                  </Text>
                  
                  <TextField
                    label="Start Date"
                    type="date"
                    value={customFrom}
                    onChange={setCustomFrom}
                    error={customError}
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="End Date"
                    type="date"
                    value={customTo}
                    onChange={setCustomTo}
                    error={customError}
                    autoComplete="off"
                  />
                  
                  {customError && (
                    <Banner tone="critical">
                      <Text as="p">{customError}</Text>
                    </Banner>
                  )}
                  
                  <ButtonGroup>
                    <Button onClick={handleCustomRangeSubmit}>
                      Apply
                    </Button>
                    <Button onClick={handleCustomRangeCancel}>
                      Cancel
                    </Button>
                  </ButtonGroup>
                </BlockStack>
              </div>
            </Popover>
          </InlineStack>
        </InlineStack>
        
        <Text tone="subdued" as="p">
          Showing data from <strong>{value.from}</strong> to <strong>{value.to}</strong>
        </Text>
      </BlockStack>
    </Card>
  );
}
