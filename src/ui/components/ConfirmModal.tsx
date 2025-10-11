import React from 'react';
import { Modal, Text, BlockStack, InlineStack } from '@shopify/polaris';

// @cursor:start(confirm-modal)
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  loading = false
}: ConfirmModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title}
      // @cursor:start(confirm-modal-actions)
      primaryAction={{
        content: confirmText,
        onAction: onConfirm,
        destructive,
        loading,
      }}
      secondaryActions={[
        {
          content: cancelText,
          onAction: onClose,
        },
      ]}
      // @cursor:end(confirm-modal-actions)
    >
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="bodyMd" as="p">
            {message}
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
// @cursor:end(confirm-modal)
