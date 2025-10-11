import React, { useState, useEffect } from 'react';
import {
  Modal,
  BlockStack,
  InlineStack,
  TextField,
  Button,
  Banner,
  Text,
} from '@shopify/polaris';
import { useCreateContact, useUpdateContact, Contact } from '../hooks';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null;
  mode: 'create' | 'edit';
}

export function ContactForm({ isOpen, onClose, contact, mode }: ContactFormProps) {
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contact && mode === 'edit') {
      setFormData({
        phone: contact.phone,
        email: contact.email || '',
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
      });
    } else {
      setFormData({
        phone: '',
        email: '',
        firstName: '',
        lastName: '',
      });
    }
    setErrors({});
  }, [contact, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        await createContact.mutateAsync(formData);
      } else if (contact) {
        await updateContact.mutateAsync({
          id: contact.id,
          data: formData,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isLoading = createContact.isPending || updateContact.isPending;
  const error = createContact.error || updateContact.error;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Contact' : 'Edit Contact'}
      primaryAction={{
        content: mode === 'create' ? 'Add Contact' : 'Save Changes',
        onAction: handleSubmit,
        loading: isLoading,
        disabled: !formData.phone.trim(),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {error && (
            <Banner tone="critical">
              <Text as="p">Error: {error.message}</Text>
            </Banner>
          )}

          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={(value) => handleFieldChange('phone', value)}
            error={errors.phone}
            placeholder="+1234567890"
            autoComplete="off"
          />

          <TextField
            label="Email Address"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            error={errors.email}
            placeholder="customer@example.com"
            autoComplete="off"
          />

          <InlineStack gap="400">
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(value) => handleFieldChange('firstName', value)}
              placeholder="John"
              autoComplete="off"
            />

            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => handleFieldChange('lastName', value)}
              placeholder="Doe"
              autoComplete="off"
            />
          </InlineStack>

          <Text as="p" tone="subdued">
            {mode === 'create' 
              ? 'Add a new contact to your SMS subscriber list.'
              : 'Update the contact information below.'
            }
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
