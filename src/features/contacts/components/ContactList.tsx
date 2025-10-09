import React, { useState } from 'react';
import {
  Card,
  DataTable,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Badge,
  ButtonGroup,
  Modal,
  TextField,
  Checkbox,
  Banner,
  EmptyState,
  Spinner,
} from '@shopify/polaris';
import { DeleteIcon, EditIcon, PlusIcon } from '@shopify/polaris-icons';
import { useContacts, useDeleteContact, useBulkContacts, Contact } from '../hooks';
import { ConsentBadge, getConsentStatus, getConsentSource, getConsentDate } from './ConsentBadge';

interface ContactListProps {
  onEditContact?: (contact: Contact) => void;
  onCreateContact?: () => void;
}

export function ContactList({ onEditContact, onCreateContact }: ContactListProps) {
  const { data: contactsData, isLoading, error } = useContacts();
  const deleteContact = useDeleteContact();
  const bulkContacts = useBulkContacts();
  
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  const contacts = contactsData?.contacts || [];

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await deleteContact.mutateAsync(id);
    }
  };

  const handleBulkAction = async () => {
    if (selectedContacts.length === 0 || !bulkAction) return;
    
    await bulkContacts.mutateAsync({
      action: bulkAction,
      contactIds: selectedContacts,
    });
    
    setSelectedContacts([]);
    setShowBulkModal(false);
    setBulkAction('');
  };

  const handleSelectContact = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, id]);
    } else {
      setSelectedContacts(prev => prev.filter(contactId => contactId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map((contact: any) => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <InlineStack align="center">
          <Spinner size="small" />
          <Text as="span">Loading contacts...</Text>
        </InlineStack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Banner tone="critical">
          <Text as="p">Failed to load contacts: {error.message}</Text>
        </Banner>
      </Card>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="No contacts found"
          image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
          action={{
            content: 'Add Contact',
            onAction: onCreateContact,
          }}
        >
          <Text as="p">Start building your SMS subscriber list by adding contacts.</Text>
        </EmptyState>
      </Card>
    );
  }

  const formatPhoneE164 = (phone: string) => {
    if (!phone) return '-';
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  const formatLastOrder = (contact: any) => {
    if (!contact.lastOrder) return '-';
    const order = contact.lastOrder;
    const date = new Date(order.date).toLocaleDateString();
    const amount = order.amount ? `${order.currency || 'USD'} ${order.amount}` : '';
    return `${date}${amount ? ` (${amount})` : ''}`;
  };

  const formatTags = (contact: any) => {
    if (!contact.tags || contact.tags.length === 0) return '-';
    return contact.tags.join(', ');
  };

  const rows = contacts.map((contact: any) => [
    <Checkbox
      label=""
      checked={selectedContacts.includes(contact.id)}
      onChange={(checked) => handleSelectContact(contact.id, checked)}
    />,
    formatPhoneE164(contact.phone),
    contact.email || '-',
    `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || '-',
    <ConsentBadge
      consentState={getConsentStatus(contact)}
      consentSource={getConsentSource(contact)}
      consentDate={getConsentDate(contact)}
    />,
    contact.locale || '-',
    formatLastOrder(contact),
    formatTags(contact),
    new Date(contact.createdAt).toLocaleDateString(),
    <ButtonGroup>
      <Button
        size="slim"
        icon={EditIcon}
        onClick={() => onEditContact?.(contact)}
      >
        Edit
      </Button>
      <Button
        size="slim"
        icon={DeleteIcon}
        tone="critical"
        onClick={() => handleDeleteContact(contact.id)}
        loading={deleteContact.isPending}
      >
        Delete
      </Button>
    </ButtonGroup>,
  ]);

  return (
    <>
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between">
            <Text variant="headingMd" as="h3">
              Contacts ({contacts.length})
            </Text>
            <InlineStack gap="200">
              {selectedContacts.length > 0 && (
                <Button
                  onClick={() => setShowBulkModal(true)}
                  disabled={selectedContacts.length === 0}
                >
                  Bulk Actions ({selectedContacts.length.toString()})
                </Button>
              )}
              <Button
                variant="primary"
                icon={PlusIcon}
                onClick={onCreateContact}
              >
                Add Contact
              </Button>
            </InlineStack>
          </InlineStack>

          <DataTable
            columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text']}
            headings={[
              <Checkbox
                label=""
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
                onChange={handleSelectAll}
              />,
              'Phone (E164)',
              'Email',
              'Name',
              'Consent Status',
              'Locale',
              'Last Order',
              'Tags',
              'Created',
              'Actions',
            ]}
            rows={rows}
          />
        </BlockStack>
      </Card>

      <Modal
        open={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Actions"
        primaryAction={{
          content: 'Apply',
          onAction: handleBulkAction,
          disabled: !bulkAction || selectedContacts.length === 0,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setShowBulkModal(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p">
              Apply action to {selectedContacts.length} selected contacts:
            </Text>
            
            <TextField
              label="Action"
              value={bulkAction}
              onChange={setBulkAction}
              placeholder="subscribe, unsubscribe, delete"
              autoComplete="off"
            />
            
            {bulkContacts.error && (
              <Banner tone="critical">
                <Text as="p">Error: {bulkContacts.error.message}</Text>
              </Banner>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}
