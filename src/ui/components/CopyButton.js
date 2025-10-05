import { jsx as _jsx } from "react/jsx-runtime";
import { Button, Tooltip } from '@shopify/polaris';
import { useState } from 'react';
export default function CopyButton({ text, children }) {
    const [copied, setCopied] = useState(false);
    async function onCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
        catch {
            // ignore
        }
    }
    return (_jsx(Tooltip, { content: copied ? 'Copied!' : 'Copy to clipboard', children: _jsx(Button, { onClick: onCopy, children: children || (copied ? 'Copied' : 'Copy') }) }));
}
