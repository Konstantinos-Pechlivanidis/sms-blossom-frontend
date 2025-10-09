import React, { useState } from 'react';
import {
  Modal,
  Text,
  Button,
  BlockStack,
  InlineStack,
  ProgressBar,
  Divider,
  Banner,
  Spinner,
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import { useCreateCampaign } from '../hooks';
import { SegmentStep } from './SegmentStep';
import { TemplateStep } from './TemplateStep';
import { DiscountStep } from './DiscountStep';
import { ScheduleStep } from './ScheduleStep';
import { ReviewStep } from './ReviewStep';

interface CampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WizardStep {
  key: string;
  title: string;
  component: React.ComponentType<any>;
  validation?: (data: any) => boolean;
}

const steps: WizardStep[] = [
  { key: 'segment', title: 'Choose Audience', component: SegmentStep },
  { key: 'template', title: 'Message Template', component: TemplateStep },
  { key: 'discount', title: 'Discount (Optional)', component: DiscountStep },
  { key: 'schedule', title: 'Schedule', component: ScheduleStep },
  { key: 'review', title: 'Review & Send', component: ReviewStep },
];

export function CampaignWizard({ isOpen, onClose }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const createCampaign = useCreateCampaign();

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    // Validate current step
    const stepValidation = currentStepData.validation;
    if (stepValidation && !stepValidation(wizardData)) {
      setErrors({ [currentStepData.key]: 'Please complete this step before continuing' });
      return;
    }

    // Clear errors
    setErrors({});

    // Move to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleFinish = async () => {
    try {
      const campaign = await createCampaign.mutateAsync({
        name: wizardData.name,
        message: wizardData.template || '', // Add required message field
        segmentId: wizardData.segmentId,
        scheduledAt: wizardData.scheduledAt,
        utm: wizardData.utm,
      });

      // Navigate to campaign detail
      navigate(`/campaigns/${campaign.id}`);
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to create campaign. Please try again.' });
    }
  };

  const handleStepDataChange = (stepKey: string, data: any) => {
    setWizardData((prev: any) => ({
      ...prev,
      [stepKey]: data,
    }));
  };

  const handleClose = () => {
    setCurrentStep(0);
    setWizardData({});
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Create Campaign"
      size="large"
      primaryAction={{
        content: currentStep === steps.length - 1 ? 'Create Campaign' : 'Next',
        onAction: currentStep === steps.length - 1 ? handleFinish : handleNext,
        loading: createCampaign.isPending,
        disabled: currentStep === steps.length - 1 && !wizardData.name,
      }}
      secondaryActions={[
        ...(currentStep > 0 ? [{ content: 'Previous', onAction: handlePrevious }] : []),
        { content: 'Cancel', onAction: handleClose },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Progress Indicator */}
          <BlockStack gap="200">
            <Text variant="bodyMd" as="p">
              Step {currentStep + 1} of {steps.length}: {currentStepData.title}
            </Text>
            <ProgressBar progress={progress} />
          </BlockStack>

          <Divider />

          {/* Error Banner */}
          {Object.keys(errors).length > 0 && (
            <Banner tone="critical">
              <Text as="p">
                {Object.values(errors).map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </Text>
            </Banner>
          )}

          {/* Step Content */}
          <div style={{ minHeight: '400px' }}>
            {createCampaign.isPending ? (
              <InlineStack align="center" gap="200">
                <Spinner size="small" />
                <Text as="p">Creating campaign...</Text>
              </InlineStack>
            ) : (
              <currentStepData.component
                data={wizardData[currentStepData.key]}
                onChange={(data: any) => handleStepDataChange(currentStepData.key, data)}
                errors={errors[currentStepData.key]}
              />
            )}
          </div>

          {/* Step Navigation */}
          <Divider />

          <InlineStack align="space-between">
            <Text variant="bodySm" as="p" tone="subdued">
              {currentStep === 0 && 'Start by choosing your target audience'}
              {currentStep === 1 && 'Create your message template'}
              {currentStep === 2 && 'Optionally attach a discount code'}
              {currentStep === 3 && 'Schedule when to send the campaign'}
              {currentStep === 4 && 'Review all settings before sending'}
            </Text>
            <InlineStack gap="200">
              {currentStep > 0 && (
                <Button onClick={handlePrevious}>Previous</Button>
              )}
              <Button
                variant="primary"
                onClick={currentStep === steps.length - 1 ? handleFinish : handleNext}
                loading={createCampaign.isPending}
                disabled={currentStep === steps.length - 1 && !wizardData.name}
              >
                {currentStep === steps.length - 1 ? 'Create Campaign' : 'Next'}
              </Button>
            </InlineStack>
          </InlineStack>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
