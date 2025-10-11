import React, { useState } from 'react';
import { Page, Layout, Card, BlockStack, Text, InlineStack, Box, Filters, Button, Toast, Banner } from '@shopify/polaris';
import { ContactList } from '../../features/contacts/components/ContactList';
import { ContactForm } from '../../features/contacts/components/ContactForm';
import { Contact, ContactFilters, useContactsWithFilters } from '../../features/contacts/hooks';
import { useAdminSyncCustomers as useSyncCustomers } from '../../lib/api/hooks/segments';
import { useToast } from '../../lib/useToast';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
// @cursor:start(contacts-imports)
import { PageHeader } from '../components/PageHeader';
import { ExplainableButton } from '../components/ExplainableButton';
import { SectionCard } from '../components/SectionCard';
import { DataGrid } from '../components/DataGrid';
import { useSaveBar } from '../../lib/hooks/useSaveBar';
// @cursor:end(contacts-imports)

export default function Contacts() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isDirty, setIsDirty] = useState(false);
  
  // @cursor-doc:start(contacts-filters)
  const [filters, setFilters] = useState<ContactFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const { showSuccess, showError, ToastComponent } = useToast();
  
  const syncCustomers = useSyncCustomers();

  // Save Bar integration
  const { SaveBarComponent } = useSaveBar({
    isDirty,
    onSave: () => {
      // Handle save logic
      setIsDirty(false);
    },
    onDiscard: () => {
      setIsDirty(false);
    },
    loading: false,
  });
  // @cursor-doc:end(contacts-filters)

  const handleCreateContact = () => {
    setEditingContact(null);
    setFormMode('create');
    setShowContactForm(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setFormMode('edit');
    setShowContactForm(true);
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
    setEditingContact(null);
  };

  // @cursor-doc:start(sync-handlers)
  const handleSyncCustomers = async () => {
    try {
      await syncCustomers.mutateAsync();
      showSuccess('Customers synced successfully');
    } catch (error) {
      showError('Failed to sync customers');
    }
  };

  const handleFiltersChange = (newFilters: ContactFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };
  // @cursor-doc:end(sync-handlers)

  return (
    <>
      {SaveBarComponent}
      <PageHeader
        title="Contacts"
        subtitle="Manage your SMS subscriber list and customer contact details"
        primaryAction={
          <ExplainableButton
            onAction={handleCreateContact}
            label="Add Contact"
            explainTitle="Add Contact"
            explainMarkdown="Manually add a new contact to your SMS subscriber list. You can also import contacts from CSV or sync from Shopify."
          />
        }
        secondaryActions={[
          <ExplainableButton
            key="sync"
            onAction={handleSyncCustomers}
            label="Sync Customers"
            explainTitle="Sync Customers"
            explainMarkdown="Import customers directly from your Shopify store. This will add new customers to your SMS subscriber list."
            loading={syncCustomers.isPending}
          />
        ]}
        helpSlug="contacts"
      />
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* @cursor:start(contacts-hero) */}
            {/* Hero Section - Brand gradient wrapper */}
            <div className="gradientHero">
              <Text as="h2" variant="headingLg">Contact Management</Text>
              <Text as="p" variant="bodyMd">Manage your SMS subscriber list and contact details</Text>
            </div>
            {/* @cursor:end(contacts-hero) */}

            {/* @cursor:start(contacts-filters) */}
            <SectionCard title="Contact Filters">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h3">
                  Filter Contacts
                </Text>
                <Button onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </InlineStack>
              {showFilters && (
                <Box paddingBlockStart="400">
                  <ContactFiltersComponent
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />
                </Box>
              )}
            </SectionCard>
            {/* @cursor:end(contacts-filters) */}

            <SectionCard title="Contact List">
              <ContactList
                onEditContact={handleEditContact}
                onCreateContact={handleCreateContact}
                filters={filters}
              />
            </SectionCard>
          </BlockStack>
        </Layout.Section>
      </Layout>

      <ContactForm
        isOpen={showContactForm}
        onClose={handleCloseContactForm}
        contact={editingContact}
        mode={formMode}
      />

      {ToastComponent}
    </>
  );
}

// @cursor-doc:start(contact-filters-component)
interface ContactFiltersComponentProps {
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
  onClearFilters: () => void;
}

function ContactFiltersComponent({ filters, onFiltersChange, onClearFilters }: ContactFiltersComponentProps) {
  return (
    <InlineStack gap="400" wrap>
      <div style={{ minWidth: '200px' }}>
        <label>
          <Text as="span" variant="bodyMd" fontWeight="medium">
            Gender
          </Text>
          <select
            value={filters.gender || 'all'}
            onChange={(e) => onFiltersChange({ ...filters, gender: e.target.value as any })}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
      
      <div style={{ minWidth: '120px' }}>
        <label>
          <Text as="span" variant="bodyMd" fontWeight="medium">
            Min Age
          </Text>
          <input
            type="number"
            value={filters.minAge || ''}
            onChange={(e) => onFiltersChange({ ...filters, minAge: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="18"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>
      </div>
      
      <div style={{ minWidth: '120px' }}>
        <label>
          <Text as="span" variant="bodyMd" fontWeight="medium">
            Max Age
          </Text>
          <input
            type="number"
            value={filters.maxAge || ''}
            onChange={(e) => onFiltersChange({ ...filters, maxAge: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="65"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>
      </div>
      
      <div style={{ minWidth: '200px' }}>
        <label>
          <Text as="span" variant="bodyMd" fontWeight="medium">
            Conversion Status
          </Text>
          <select
            value={filters.conversionStatus || 'all'}
            onChange={(e) => onFiltersChange({ ...filters, conversionStatus: e.target.value as any })}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="all">All</option>
            <option value="converted_lifetime">Converted (Lifetime)</option>
            <option value="converted_last_90d">Converted (Last 90 days)</option>
            <option value="not_converted">Not Converted</option>
          </select>
        </label>
      </div>
      
      <div style={{ alignSelf: 'flex-end' }}>
        <Button onClick={onClearFilters}>Clear Filters</Button>
      </div>
    </InlineStack>
  );
}
// @cursor-doc:end(contact-filters-component)
