import React from 'react';
import { FormLayout, Text, InlineError } from '@shopify/polaris';

// @cursor:start(form-row)
interface FormRowProps {
  label: string;
  children: React.ReactNode;
  helpText?: string;
  error?: string;
  required?: boolean;
}

export function FormRow({
  label,
  children,
  helpText,
  error,
  required = false
}: FormRowProps) {
  return (
    <FormLayout.Group>
      <div>
        <Text variant="bodyMd" as="p">
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Text>
        {children}
        {helpText && (
          <Text variant="bodySm" as="p" tone="subdued">
            {helpText}
          </Text>
        )}
        {error && (
          <InlineError message={error} fieldID="error" />
        )}
      </div>
    </FormLayout.Group>
  );
}
// @cursor:end(form-row)
