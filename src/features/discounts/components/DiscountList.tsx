import React from 'react';
import {
  Card,
  IndexTable,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  EmptyState,
  SkeletonBodyText,
  SkeletonDisplayText,
} from '@shopify/polaris';
import { useDiscounts, useDiscountStatus } from '../hooks';
import { useNavigate } from 'react-router-dom';

interface DiscountListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function DiscountList({ onEdit, onDelete, onView }: DiscountListProps) {
  const navigate = useNavigate();
  const { data: discounts, isLoading, error } = useDiscounts();

  if (isLoading) {
    return (
      <Card>
        <BlockStack gap="400">
          <SkeletonDisplayText size="medium" />
          <SkeletonBodyText lines={5} />
        </BlockStack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0264/3175/7052/files/empty-state.svg"
          heading="Failed to load discounts"
          action={{
            content: 'Try again',
            onAction: () => window.location.reload(),
          }}
        >
          <p>There was an error loading your discounts. Please try again.</p>
        </EmptyState>
      </Card>
    );
  }

  if (!discounts?.items?.length) {
    return (
      <Card>
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0264/3175/7052/files/empty-state.svg"
          heading="No discounts yet"
          action={{
            content: 'Create discount',
            onAction: () => navigate('/discounts/new'),
          }}
        >
          <p>Create your first discount code to start offering promotions to your customers.</p>
        </EmptyState>
      </Card>
    );
  }

  const getStatusBadge = (discount: any) => {
    const status = useDiscountStatus(discount);
    const statusMap = {
      draft: { status: 'info', children: 'Draft' },
      active: { status: 'success', children: 'Active' },
      inactive: { status: 'warning', children: 'Inactive' },
      expired: { status: 'critical', children: 'Expired' },
      scheduled: { status: 'attention', children: 'Scheduled' },
    };
    
    return <Badge {...statusMap[status as keyof typeof statusMap]} />;
  };

  const formatValue = (discount: any) => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    }
    return `$${discount.value}`;
  };

  const formatUsage = (discount: any) => {
    if (!discount.usageLimit) return 'Unlimited';
    const used = discount.usedCount || 0;
    return `${used}/${discount.usageLimit}`;
  };

  const rows = discounts.items.map((discount) => ({
    id: discount.id,
    code: discount.code,
    value: formatValue(discount),
    status: getStatusBadge(discount),
    usage: formatUsage(discount),
    createdAt: discount.createdAt ? new Date(discount.createdAt).toLocaleDateString() : 'N/A',
    actions: (
      <InlineStack gap="200">
        <Button
          size="slim"
          onClick={() => navigate(`/discounts/${discount.id}`)}
        >
          View
        </Button>
        {onEdit && (
          <Button
            size="slim"
            onClick={() => onEdit(discount.id)}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            size="slim"
            variant="plain"
            tone="critical"
            onClick={() => onDelete(discount.id)}
          >
            Delete
          </Button>
        )}
      </InlineStack>
    ),
  }));

  return (
    <Card>
      <IndexTable
        headings={[
          { title: 'Code' },
          { title: 'Value' },
          { title: 'Status' },
          { title: 'Usage' },
          { title: 'Created' },
          { title: 'Actions' },
        ]}
        itemCount={rows.length}
        selectable={false}
      >
        {rows.map((row, index) => (
          <IndexTable.Row key={row.id} id={row.id} position={index}>
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="semibold" as="p">
                {row.code}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="p">{row.value}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{row.status}</IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="p">{row.usage}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="p">{row.createdAt}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{row.actions}</IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
  );
}
