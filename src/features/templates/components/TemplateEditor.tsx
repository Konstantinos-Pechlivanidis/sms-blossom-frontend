import React, { useState } from 'react';
import {
  Card,
  TextField,
  Button,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Banner,
  Select,
} from '@shopify/polaris';

interface TemplateEditorProps {
  initialTemplate?: string;
  initialTrigger?: string;
  onSave?: (template: string, trigger: string) => void;
  onPreview?: (template: string, variables: Record<string, string>) => void;
}

export default function TemplateEditor({
  initialTemplate = '',
  initialTrigger = '',
  onSave,
  onPreview,
}: TemplateEditorProps) {
  const [template, setTemplate] = useState(initialTemplate);
  const [trigger, setTrigger] = useState(initialTrigger);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<{ rendered: string } | null>(null);
  const [validation, setValidation] = useState<{ message: string; isValid: boolean } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const availableTriggers = [
    { label: 'Welcome', value: 'welcome' },
    { label: 'Abandoned Cart', value: 'abandoned_cart' },
    { label: 'Birthday', value: 'birthday' },
  ];

  const availableVariables = [
    'shop_name',
    'customer_name',
    'product_name',
    'discount_code',
    'checkout_url',
  ];

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    setErrors([]);
    setWarnings([]);
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({ ...prev, [variable]: value }));
  };

  const handlePreview = () => {
    // Mock preview logic
    const rendered = template.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return variables[variable] || `[${variable}]`;
    });
    setPreview({ rendered });
  };

  const handleValidate = () => {
    // Mock validation logic
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    if (!template.trim()) {
      newErrors.push('Template content is required');
    }

    if (template.includes('{{invalid}}')) {
      newErrors.push('Invalid variable syntax');
    }

    if (template.length > 160) {
      newWarnings.push('Template is longer than recommended SMS length');
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
    setValidation({
      message: newErrors.length === 0 ? 'Template is valid' : 'Template has errors',
      isValid: newErrors.length === 0,
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(template, trigger);
    }
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">Template Editor</Text>
        
        {/* Trigger Selection */}
        <Select
          label="Trigger"
          options={[
            { label: 'Select a trigger', value: '' },
            ...availableTriggers,
          ]}
          value={trigger}
          onChange={setTrigger}
        />
        
        {/* Template Content */}
        <TextField
          label="Message Template"
          value={template}
          onChange={handleTemplateChange}
          multiline={4}
          helpText="Use Liquid syntax for dynamic content. Available variables will appear below."
          placeholder="Enter your template content here..."
          autoComplete="off"
        />
        
        {/* SMS Segments */}
        <div>
          <Text variant="bodyMd" fontWeight="semibold" as="p">SMS Segments</Text>
          <Text variant="bodyMd" as="p">
            Estimated segments: {Math.ceil(template.length / 160)}
          </Text>
          <Text variant="bodyMd" as="p">
            Characters: {template.length}/160
          </Text>
          <Text variant="bodyMd" as="p">
            Cost estimate: ${(Math.ceil(template.length / 160) * 0.01).toFixed(2)}
          </Text>
        </div>

        {/* Available Variables */}
        {availableVariables.length > 0 && (
          <Card>
            <BlockStack gap="200">
              <Text variant="bodyMd" fontWeight="semibold" as="p">Available Variables</Text>
              <Text variant="bodySm" as="p">
                Use these variables in your template: {availableVariables.join(', ')}
              </Text>
            </BlockStack>
          </Card>
        )}

        {/* Test Variables */}
        <Card>
          <BlockStack gap="200">
            <Text variant="bodyMd" fontWeight="semibold" as="p">Test Variables</Text>
            <Text variant="bodySm" as="p">
              Set test values for preview
            </Text>
            {availableVariables.map((variable) => (
              <TextField
                key={variable}
                label={variable}
                value={variables[variable] || ''}
                onChange={(value) => handleVariableChange(variable, value)}
                placeholder={`Test value for ${variable}`}
                autoComplete="off"
              />
            ))}
          </BlockStack>
        </Card>

        {/* Validation Results */}
        {errors.length > 0 && (
          <Banner>
            <Text variant="bodyMd" fontWeight="semibold" as="p">Validation Errors</Text>
            {errors.map((error, index) => (
              <Text key={index} variant="bodyMd" as="p">• {error}</Text>
            ))}
          </Banner>
        )}

        {warnings.length > 0 && (
          <Banner>
            <Text variant="bodyMd" fontWeight="semibold" as="p">Warnings</Text>
            {warnings.map((warning, index) => (
              <Text key={index} variant="bodyMd" as="p">• {warning}</Text>
            ))}
          </Banner>
        )}

        {/* Preview */}
        {preview && (
          <Card>
            <BlockStack gap="200">
              <Text variant="bodyMd" fontWeight="semibold" as="p">Preview</Text>
              <Text variant="bodyMd" as="p">{preview.rendered}</Text>
            </BlockStack>
          </Card>
        )}

        {/* Validation Results */}
        {validation && (
          <Card>
            <BlockStack gap="200">
              <Text variant="bodyMd" fontWeight="semibold" as="p">Validation Results</Text>
              <Text variant="bodyMd" as="p">{validation.message}</Text>
              {validation.isValid && (
                <Badge>Valid Template</Badge>
              )}
            </BlockStack>
          </Card>
        )}

        {/* Error State */}
        {errors.length > 0 && (
          <Banner>
            <Text variant="bodyMd" as="p">
              Please fix the validation errors before saving the template.
            </Text>
          </Banner>
        )}

        {/* Actions */}
        <InlineStack gap="200">
          <Button onClick={handlePreview}>Preview</Button>
          <Button onClick={handleValidate}>Validate</Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={errors.length > 0}
          >
            Save Template
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}