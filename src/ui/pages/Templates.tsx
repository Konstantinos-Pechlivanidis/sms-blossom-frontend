import { 
  Page, 
  Card, 
  Text, 
  Button, 
  InlineStack, 
  BlockStack, 
  IndexTable, 
  Badge, 
  EmptyState,
  Banner,
  Spinner,
  Modal,
  FormLayout,
  TextField,
  Select,
  ButtonGroup
} from '@shopify/polaris';
import { useState } from 'react';
import { useTemplates, useCreateTemplate, usePreviewTemplate, useValidateTemplate } from '../../lib/api/hooks';
import { useShop } from '../../lib/shopContext';

// @cursor:start(templates-page)
const TRIGGER_OPTIONS = [
  { label: 'All Triggers', value: '' },
  { label: 'Abandoned Checkout', value: 'abandoned_checkout' },
  { label: 'Order Created', value: 'order_created' },
  { label: 'Order Paid', value: 'order_paid' },
  { label: 'Fulfillment Update', value: 'fulfillment_update' },
  { label: 'Welcome', value: 'welcome' },
  { label: 'Back in Stock', value: 'back_in_stock' },
];

export default function Templates() {
  const { shop } = useShop();
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  const { data: templates, isLoading, error } = useTemplates({ trigger: selectedTrigger || undefined });
  const createTemplate = useCreateTemplate();
  const previewTemplate = usePreviewTemplate();
  const validateTemplate = useValidateTemplate();

  const handleCreateTemplate = async (data: any) => {
    try {
      await createTemplate.mutateAsync(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handlePreview = async (body: string, variables: any) => {
    try {
      const result = await previewTemplate.mutateAsync({ body, variables });
      setPreviewData(result);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Failed to preview template:', error);
    }
  };

  const handleValidate = async (body: string, trigger: string) => {
    try {
      const result = await validateTemplate.mutateAsync({ body, trigger });
      return result;
    } catch (error) {
      console.error('Failed to validate template:', error);
      return null;
    }
  };

  const rows = templates?.data?.map((template: any) => [
    template.name,
    template.trigger,
    template.body.substring(0, 100) + (template.body.length > 100 ? '...' : ''),
    new Date(template.createdAt).toLocaleDateString(),
    <ButtonGroup key={template.id}>
      <Button 
        size="slim" 
        onClick={() => handlePreview(template.body, template.variables)}
      >
        Preview
      </Button>
    </ButtonGroup>
  ]) || [];

  return (
    <Page 
      title="Templates"
      primaryAction={{
        content: 'Create Template',
        onAction: () => setShowCreateModal(true),
      }}
    >
      <BlockStack gap="400">
        {error && (
          <Banner tone="critical" title="Failed to load templates">
            <p>Unable to load templates. Please try again.</p>
          </Banner>
        )}

        <Card>
          <div style={{ padding: '16px' }}>
            <InlineStack gap="400" align="space-between">
              <Text as="h2" variant="headingMd">
                SMS Templates
              </Text>
              <Select
                label="Filter by trigger"
                labelHidden
                options={TRIGGER_OPTIONS}
                value={selectedTrigger}
                onChange={setSelectedTrigger}
              />
            </InlineStack>
          </div>
        </Card>

        {isLoading ? (
          <Card>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <Spinner size="large" />
            </div>
          </Card>
        ) : templates?.data?.length === 0 ? (
          <Card>
            <EmptyState
              heading="No templates found"
              action={{
                content: 'Create your first template',
                onAction: () => setShowCreateModal(true),
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Create SMS templates for different triggers like abandoned checkouts, order confirmations, and more.</p>
            </EmptyState>
          </Card>
        ) : (
          <Card>
            <IndexTable
              headings={[
                { title: 'Name' },
                { title: 'Trigger' },
                { title: 'Content' },
                { title: 'Created' },
                { title: 'Actions' }
              ]}
              itemCount={templates?.data?.length || 0}
            >
              {rows.map((row, index) => (
                <IndexTable.Row key={index} id={index.toString()} position={index}>
                  {row.map((cell, cellIndex) => (
                    <IndexTable.Cell key={cellIndex}>
                      {cell}
                    </IndexTable.Cell>
                  ))}
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Card>
        )}

        {/* Create Template Modal */}
        <CreateTemplateModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTemplate}
          onPreview={handlePreview}
          onValidate={handleValidate}
        />

        {/* Preview Modal */}
        <PreviewModal
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          data={previewData}
        />
      </BlockStack>
    </Page>
  );
}

function CreateTemplateModal({ 
  open, 
  onClose, 
  onSubmit, 
  onPreview, 
  onValidate 
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onPreview: (body: string, variables: any) => void;
  onValidate: (body: string, trigger: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    trigger: '',
    body: '',
    variables: {}
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: '', trigger: '', body: '', variables: {} });
  };

  const handlePreview = () => {
    onPreview(formData.body, formData.variables);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Template"
      primaryAction={{
        content: 'Create',
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: 'Preview',
          onAction: handlePreview,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Template Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="e.g., Abandoned Checkout Recovery"
            autoComplete="off"
          />
          <Select
            label="Trigger"
            options={TRIGGER_OPTIONS.slice(1)}
            value={formData.trigger}
            onChange={(value) => setFormData({ ...formData, trigger: value })}
          />
          <TextField
            label="Template Body"
            value={formData.body}
            onChange={(value) => setFormData({ ...formData, body: value })}
            multiline={4}
            placeholder="Hi {{ customer.first_name }}, complete your order: {{ recovery_url }}"
            helpText="Use Liquid syntax for dynamic content. Available variables depend on the trigger type."
            autoComplete="off"
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}

function PreviewModal({ 
  open, 
  onClose, 
  data 
}: {
  open: boolean;
  onClose: () => void;
  data: any;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Template Preview"
      primaryAction={{
        content: 'Close',
        onAction: onClose,
      }}
    >
      <Modal.Section>
        {data && (
          <BlockStack gap="400">
            <div>
              <Text as="h3" variant="headingMd">Rendered Text:</Text>
              <Card>
                <div style={{ padding: '16px', fontFamily: 'monospace' }}>
                  {data.text}
                </div>
              </Card>
            </div>
            {data.warnings && data.warnings.length > 0 && (
              <div>
                <Text as="h3" variant="headingMd">Warnings:</Text>
                <ul>
                  {data.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.segments && (
              <div>
                <Text as="h3" variant="headingMd">SMS Segments:</Text>
                <Text as="p">Parts: {data.segments.parts}, Characters: {data.segments.characters}, Encoding: {data.segments.encoding}</Text>
              </div>
            )}
          </BlockStack>
        )}
      </Modal.Section>
    </Modal>
  );
}
// @cursor:end(templates-page)
