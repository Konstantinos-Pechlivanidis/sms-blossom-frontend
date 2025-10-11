import React, { useState, useEffect } from 'react';
import { Form, FormLayout, Button, InlineStack, ContextualSaveBar, InlineError } from '@shopify/polaris';

// @cursor:start(form-scaffold)
interface FormScaffoldProps {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  errors?: Record<string, string>;
  isDirty?: boolean;
  submitDisabled?: boolean;
}

export function FormScaffold({
  children,
  onSubmit,
  onCancel,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  errors = {},
  isDirty = false,
  submitDisabled = false
}: FormScaffoldProps) {
  const [showSaveBar, setShowSaveBar] = useState(false);

  useEffect(() => {
    setShowSaveBar(isDirty && !loading);
  }, [isDirty, loading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(event);
  };

  const handleSave = () => {
    onSubmit({});
  };

  const handleDiscard = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormLayout>
          {children}
          
          {/* Inline errors */}
          {Object.entries(errors).map(([field, error]) => (
            <InlineError key={field} message={error} fieldID={field} />
          ))}
          
          {/* Submit/Cancel buttons */}
          <InlineStack gap="300" align="end">
            {onCancel && (
              <Button onClick={onCancel} disabled={loading}>
                {cancelText}
              </Button>
            )}
            <Button
              submit
              variant="primary"
              loading={loading}
              disabled={submitDisabled}
            >
              {submitText}
            </Button>
          </InlineStack>
        </FormLayout>
      </Form>

      {/* Contextual Save Bar */}
      {showSaveBar && (
        <ContextualSaveBar
          message="Unsaved changes"
          saveAction={{
            onAction: handleSave,
            loading,
            disabled: submitDisabled,
          }}
          discardAction={{
            onAction: handleDiscard,
          }}
        />
      )}
    </>
  );
}
// @cursor:end(form-scaffold)
