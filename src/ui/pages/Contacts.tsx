import React, { useState } from 'react';
import { Page, Layout, Card, BlockStack, Text, InlineStack } from '@shopify/polaris';
import { ContactList } from '../../features/contacts/components/ContactList';
import { ContactForm } from '../../features/contacts/components/ContactForm';
import { Contact } from '../../features/contacts/hooks';

export default function Contacts() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

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

  return (
    <Page
      title="Contacts"
      subtitle="Manage your SMS subscriber list"
      primaryAction={{
        content: 'Add Contact',
        onAction: handleCreateContact,
      }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">
                  Subscriber Management
                </Text>
                <Text as="p" tone="subdued">
                  Manage your SMS subscriber list, view contact details, and handle subscriptions.
                </Text>
              </BlockStack>
            </Card>

            <ContactList
              onEditContact={handleEditContact}
              onCreateContact={handleCreateContact}
            />
          </BlockStack>
        </Layout.Section>
      </Layout>

      <ContactForm
        isOpen={showContactForm}
        onClose={handleCloseContactForm}
        contact={editingContact}
        mode={formMode}
      />
    </Page>
  );
}
