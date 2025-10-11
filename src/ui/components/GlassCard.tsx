import { Card } from '@shopify/polaris';
import { PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';

// @cursor:start(glass-card)
export function GlassCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('ios-glass rounded-3xl', className)}>
      <Card>{children}</Card>
    </div>
  );
}
// @cursor:end(glass-card)
