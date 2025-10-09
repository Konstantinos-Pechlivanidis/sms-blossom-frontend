import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Select,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Banner,
  Spinner,
} from '@shopify/polaris';
import { useDiscounts } from '../../discounts/hooks';

interface DiscountStepProps {
  data?: any;
  onChange: (data: any) => void;
  errors?: string;
}

export function DiscountStep({ data, onChange, errors }: DiscountStepProps) {
  const [selectedDiscount, setSelectedDiscount] = useState(data?.discountId || '');
  const [discountName, setDiscountName] = useState(data?.discountName || '');
  const { data: discounts, isLoading, error } = useDiscounts();

  useEffect(() => {
    if (selectedDiscount && discounts?.items) {
      const discount = discounts.items.find((d: any) => d.id === selectedDiscount);
      if (discount) {
        setDiscountName(discount.title || discount.code);
        onChange({
          discountId: selectedDiscount,
          discountName: discount.title || discount.code,
          discountCode: discount.code,
          discountValue: discount.value,
          discountType: discount.type,
        });
      }
    } else if (!selectedDiscount) {
      onChange({
        discountId: null,
        discountName: null,
        discountCode: null,
        discountValue: null,
        discountType: null,
      });
    }
  }, [selectedDiscount, discounts, onChange]);

  const discountOptions = [
    { label: 'No discount', value: '' },
    ...(discounts?.items || []).map((discount: any) => ({
      label: `${discount.title || discount.code} (${discount.type} ${discount.value}${discount.type === 'percentage' ? '%' : ''})`,
      value: discount.id,
    })),
  ];

  if (isLoading) {
    return (
      <InlineStack align="center" gap="200">
        <Spinner size="small" />
        <Text as="p">Loading discounts...</Text>
      </InlineStack>
    );
  }

  if (error) {
    return (
      <Banner tone="critical">
        <Text as="p">Failed to load discounts: {error.message}</Text>
      </Banner>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            Discount Code (Optional)
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            Optionally attach a discount code to incentivize purchases.
          </Text>
        </BlockStack>

        <Select
          label="Discount Code"
          options={discountOptions}
          value={selectedDiscount}
          onChange={setSelectedDiscount}
          error={errors}
          helpText="Choose a discount code to include in your campaign"
        />

        {selectedDiscount && discountName && (
          <Card>
            <BlockStack gap="200">
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Selected Discount
              </Text>
              <InlineStack gap="200" align="center">
                <Text as="span">{discountName}</Text>
                <Badge tone="success">
                  {`${data?.discountType} ${data?.discountValue}${data?.discountType === 'percentage' ? '%' : ''}`}
                </Badge>
              </InlineStack>
            </BlockStack>
          </Card>
        )}

        {!discounts?.items || discounts.items.length === 0 && (
          <Banner tone="info">
            <Text as="p">
              No discounts available. You can create discounts in the Discounts section.
            </Text>
          </Banner>
        )}

        <Banner tone="info">
          <Text as="p">
            <strong>Tip:</strong> Discount codes can significantly increase conversion rates. 
            Consider offering a time-limited discount for better results.
          </Text>
        </Banner>
      </BlockStack>
    </Card>
  );
}
