import { Button, Tooltip } from '@shopify/polaris';
import { useState } from 'react';

export default function CopyButton({ text, children }: { text: string; children?: string }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }
  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
      <Button onClick={onCopy}>{children || (copied ? 'Copied' : 'Copy')}</Button>
    </Tooltip>
  );
}
