import React from 'react';
import { Card, Text, Button } from '@shopify/polaris';

export default function TestFrame() {
  return (
    <div>
      <Card>
        <div style={{ padding: '16px' }}>
          <Text as="h1" variant="headingLg">
            AppFrame Test
          </Text>
          <Text as="p" variant="bodyMd">
            If you can see this, the AppFrame is working correctly!
          </Text>
          <div className="gradientHero" style={{ padding: '24px', marginTop: '16px' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Brand Gradient Test
            </h2>
            <p style={{ color: 'white', margin: '8px 0 0 0' }}>
              This should have a teal gradient background.
            </p>
          </div>
          <div className="kpi-card" style={{ padding: '16px', marginTop: '16px' }}>
            <Text as="h3" variant="headingMd">
              KPI Card Test
            </Text>
            <Text as="p">
              This should have rounded corners and subtle shadow.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
