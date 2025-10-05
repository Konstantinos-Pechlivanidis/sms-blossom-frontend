import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, BlockStack, SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';
export function KpiSkeletonRow() {
    return (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(SkeletonDisplayText, { size: "small" }), _jsx(SkeletonBodyText, { lines: 2 })] }) }) }));
}
export function ChartSkeleton() {
    return (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(SkeletonDisplayText, { size: "medium" }), _jsx("div", { style: { height: 320, background: '#f6f6f7', borderRadius: 8 } })] }) }) }));
}
export function TableSkeleton() {
    return (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(SkeletonDisplayText, { size: "small" }), _jsx(SkeletonBodyText, { lines: 6 })] }) }) }));
}
