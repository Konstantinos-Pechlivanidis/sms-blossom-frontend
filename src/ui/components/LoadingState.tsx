import React from 'react';
import { Card, SkeletonBodyText, SkeletonDisplayText, SkeletonPage } from '@shopify/polaris';

// @cursor-opt:start(loading-state)
interface LoadingStateProps {
  type?: 'page' | 'card' | 'table' | 'list';
  lines?: number;
}

export function LoadingState({ type = 'card', lines = 3 }: LoadingStateProps) {
  switch (type) {
    case 'page':
      return <SkeletonPage title="Loading..." />;
    
    case 'card':
      return (
        <Card>
          <div style={{ padding: '16px' }}>
            <SkeletonDisplayText size="medium" />
            <div style={{ marginTop: '12px' }}>
              <SkeletonBodyText lines={lines} />
            </div>
          </div>
        </Card>
      );
    
    case 'table':
      return (
        <Card>
          <div style={{ padding: '16px' }}>
            <SkeletonDisplayText size="small" />
            <div style={{ marginTop: '12px' }}>
              <SkeletonBodyText lines={lines} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <SkeletonBodyText lines={lines} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <SkeletonBodyText lines={lines} />
            </div>
          </div>
        </Card>
      );
    
    case 'list':
      return (
        <div style={{ padding: '16px' }}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <SkeletonBodyText lines={1} />
            </div>
          ))}
        </div>
      );
    
    default:
      return <SkeletonBodyText lines={lines} />;
  }
}
// @cursor-opt:end(loading-state)
