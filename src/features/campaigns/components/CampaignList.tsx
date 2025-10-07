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
import { useCampaigns, useCampaignStatus, useCampaignProgress } from '../hooks';
import { useNavigate } from 'react-router-dom';

interface CampaignListProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSend?: (id: string) => void;
}

export default function CampaignList({ onEdit, onDelete, onSend }: CampaignListProps) {
  const navigate = useNavigate();
  const { data: campaigns, isLoading, error } = useCampaigns();

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
          heading="Failed to load campaigns"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
          action={{
            content: 'Try again',
            onAction: () => window.location.reload(),
          }}
        >
          <Text as="p">There was an error loading your campaigns. Please try again.</Text>
        </EmptyState>
      </Card>
    );
  }

  if (!campaigns?.items?.length) {
    return (
      <Card>
        <EmptyState
          heading="No campaigns yet"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
          action={{
            content: 'Create campaign',
            onAction: () => navigate('/campaigns/new'),
          }}
        >
          <Text as="p">Create your first SMS campaign to start reaching your customers.</Text>
        </EmptyState>
      </Card>
    );
  }

  const getStatusBadge = (campaign: any) => {
    const status = useCampaignStatus(campaign);
    const statusMap = {
      draft: { tone: 'info' as const, children: 'Draft' },
      estimated: { tone: 'warning' as const, children: 'Estimated' },
      scheduled: { tone: 'attention' as const, children: 'Scheduled' },
      sent: { tone: 'success' as const, children: 'Sent' },
    };
    
    return <Badge {...statusMap[status as keyof typeof statusMap]} />;
  };

  const getProgress = (campaign: any) => {
    const { progress } = useCampaignProgress(campaign);
    return `${Math.round(progress)}%`;
  };

  const rows = campaigns.items.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    status: getStatusBadge(campaign),
    progress: getProgress(campaign),
    createdAt: campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'Unknown',
    actions: (
      <InlineStack gap="200">
        <Button
          size="slim"
          onClick={() => navigate(`/campaigns/${campaign.id}`)}
        >
          View
        </Button>
        {onEdit && (
          <Button
            size="slim"
            onClick={() => onEdit(campaign.id)}
          >
            Edit
          </Button>
        )}
        {onSend && campaign.status !== 'sent' && (
          <Button
            size="slim"
            variant="primary"
            onClick={() => onSend(campaign.id)}
          >
            Send
          </Button>
        )}
        {onDelete && (
          <Button
            size="slim"
            variant="plain"
            tone="critical"
            onClick={() => onDelete(campaign.id)}
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
          { title: 'Name' },
          { title: 'Status' },
          { title: 'Progress' },
          { title: 'Created' },
          { title: 'Actions' },
        ]}
        itemCount={rows.length}
        selectable={false}
      >
        {rows.map((row, index) => (
          <IndexTable.Row key={row.id} id={row.id} position={index}>
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="semibold" as="span">
                {row.name}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{row.status}</IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{row.progress}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Text variant="bodyMd" as="span">{row.createdAt}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{row.actions}</IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
  );
}
