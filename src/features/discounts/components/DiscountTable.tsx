import React, { useState } from 'react';
import {
  Card,
  Text,
  IndexTable,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  Modal,
  Banner,
  Spinner,
  EmptyState,
  Tooltip,
} from '@shopify/polaris';
import { useDiscounts, useDeleteDiscount, useDiscountStatus } from '../hooks';
import { ApplyUrlModal } from './ApplyUrlModal';

interface DiscountTableProps {
  onEdit?: (discount: any) => void;
  onDelete?: (id: string) => void;
  onCopyUrl?: (id: string) => void;
}

export function DiscountTable({ onEdit, onDelete, onCopyUrl }: DiscountTableProps) {
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  
  const { data: discounts, isLoading, error } = useDiscounts();
  const deleteDiscount = useDeleteDiscount();

  const handleDelete = async (id: string) => {
    try {
      await deleteDiscount.mutateAsync(id);
      setDeleteModal(null);
    } catch (error) {
      console.error('Failed to delete discount:', error);
    }
  };

  const handleCopyUrl = (discount: any) => {
    setSelectedDiscount(discount);
    setShowUrlModal(true);
  };

  const getStatusBadge = (discount: any) => {
    const status = useDiscountStatus(discount);
    
    switch (status) {
      case 'active':
        return <Badge tone="success">Active</Badge>;
      case 'inactive':
        return <Badge tone="critical">Inactive</Badge>;
      case 'expired':
        return <Badge tone="critical">Expired</Badge>;
      case 'scheduled':
        return <Badge tone="info">Scheduled</Badge>;
      default:
        return <Badge>Draft</Badge>; // Remove invalid tone
    }
  };

  const getUsageDisplay = (discount: any) => {
    const used = discount.usedCount || 0;
    const limit = discount.usageLimit;
    
    if (limit) {
      return `${used}/${limit}`;
    }
    return used.toString();
  };

  const getValueDisplay = (discount: any) => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    }
    return `${discount.value} ${discount.currencyCode || 'USD'}`;
  };

  const getDateDisplay = (date: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString();
  };

  const rows = (discounts?.items || []).map((discount, index) => (
    <IndexTable.Row 
      id={discount.id} 
      key={discount.id} 
      position={index} 
      selected={false}
      data-testid={`discount-row-${discount.id}`}
    >
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" fontWeight="semibold">{discount.code}</Text>
          {discount.title && (
            <Text as="span" tone="subdued" variant="bodySm">
              {discount.title}
            </Text>
          )}
        </BlockStack>
      </IndexTable.Cell>
      
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" fontWeight="semibold">
            {discount.type === 'percentage' ? 'Percentage' : 'Amount'}
          </Text>
          <Text as="span" tone="subdued">
            {getValueDisplay(discount)}
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" tone="subdued">
            Min: {discount.minimumAmount ? `${discount.minimumAmount} ${discount.currencyCode || 'USD'}` : 'None'}
          </Text>
          <Text as="span" tone="subdued">
            Once per customer: {discount.appliesOncePerCustomer ? 'Yes' : 'No'}
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" tone="subdued">
            Starts: {getDateDisplay(discount.startsAt || '')}
          </Text>
          <Text as="span" tone="subdued">
            Ends: {getDateDisplay(discount.endsAt || '')}
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      
      <IndexTable.Cell>
        {getStatusBadge(discount)}
      </IndexTable.Cell>
      
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" fontWeight="semibold">
            {getUsageDisplay(discount)}
          </Text>
          <Text as="span" tone="subdued" variant="bodySm">
            uses
          </Text>
        </BlockStack>
      </IndexTable.Cell>
      
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Tooltip content="Copy Apply URL">
            <Button
              size="slim"
              onClick={() => handleCopyUrl(discount)}
              data-testid={`copy-url-${discount.id}`}
            >
              Copy URL
            </Button>
          </Tooltip>
          
          {onEdit && (
            <Tooltip content="Edit Discount">
              <Button
                size="slim"
                onClick={() => onEdit(discount)}
                data-testid={`edit-discount-${discount.id}`}
              >
                Edit
              </Button>
            </Tooltip>
          )}
          
          {onDelete && (
            <Tooltip content="Delete Discount">
              <Button
                size="slim"
                tone="critical"
                onClick={() => setDeleteModal(discount.id)}
                data-testid={`delete-discount-${discount.id}`}
              >
                Delete
              </Button>
            </Tooltip>
          )}
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  if (isLoading) {
    return (
      <Card>
        <div style={{ padding: '16px' }}>
          <InlineStack align="center" gap="200">
            <Spinner size="small" />
            <Text as="p">Loading discounts...</Text>
          </InlineStack>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ padding: '16px' }}>
          <Banner tone="critical">
            <Text as="p">Failed to load discounts: {error.message}</Text>
          </Banner>
        </div>
      </Card>
    );
  }

  if (!discounts?.items || discounts.items.length === 0) {
    return (
      <Card>
        <div style={{ padding: '16px' }}>
          <EmptyState
            heading="No discounts yet"
            image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
            action={{
              content: 'Create Discount',
              onAction: () => {}, // This would be handled by parent
            }}
          >
            <Text as="p">Create your first discount code to start offering promotions to customers.</Text>
          </EmptyState>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div style={{ padding: '16px' }}>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Discount Codes
            </Text>
            
            <IndexTable
              resourceName={{ singular: 'discount', plural: 'discounts' }}
              itemCount={discounts.items.length}
              headings={[
                { title: 'Code' },
                { title: 'Type' },
                { title: 'Scope' },
                { title: 'Starts/Ends' },
                { title: 'Status' },
                { title: 'Uses' },
                { title: 'Actions' },
              ]}
              selectable={false}
              data-testid="discount-table"
            >
              {rows}
            </IndexTable>
          </BlockStack>
        </div>
      </Card>

      {/* Apply URL Modal */}
      {showUrlModal && selectedDiscount && (
        <ApplyUrlModal
          discount={selectedDiscount}
          isOpen={showUrlModal}
          onClose={() => {
            setShowUrlModal(false);
            setSelectedDiscount(null);
          }}
          onUrlGenerated={(url) => {
            console.log('URL generated:', url);
            setShowUrlModal(false);
            setSelectedDiscount(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Discount"
        primaryAction={{
          content: 'Delete',
          // Remove invalid tone property
          onAction: () => deleteModal && handleDelete(deleteModal),
          loading: deleteDiscount.isPending,
        }}
        secondaryActions={[
          { content: 'Cancel', onAction: () => setDeleteModal(null) },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Are you sure you want to delete this discount? This action cannot be undone.
          </Text>
        </Modal.Section>
      </Modal>
    </>
  );
}
