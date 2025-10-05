import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Page, Text, InlineStack, BlockStack } from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useMemo } from 'react';
import { KpiSkeletonRow, ChartSkeleton } from '../components/Skeletons';
export default function Dashboard() {
    const shop = useMemo(() => {
        const h = new URL(window.location.href).searchParams.get('host') || '';
        try {
            const s = atob(h);
            const u = new URL(`https://${s}`);
            const sub = u.hostname.split('.')[0];
            return `${sub}.myshopify.com`;
        }
        catch {
            return '';
        }
    }, []);
    const { data: overview, isLoading: loadingOverview } = useQuery({
        queryKey: ['overview', shop],
        queryFn: () => apiFetch(`/reports/overview?shop=${encodeURIComponent(shop)}&window=30d`),
    });
    const { data: ts, isLoading: loadingTs } = useQuery({
        queryKey: ['timeseries', shop],
        queryFn: () => apiFetch(`/reports/messaging/timeseries?shop=${encodeURIComponent(shop)}&window=30d`),
    });
    return (_jsx(Page, { title: "Dashboard", children: _jsxs(BlockStack, { gap: "400", children: [loadingOverview ? (_jsx(KpiSkeletonRow, {})) : (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "200", children: [_jsxs(InlineStack, { gap: "400", align: "space-between", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Overview (30d)" }), _jsxs(Text, { as: "span", tone: "subdued", children: [overview?.range?.from?.slice(0, 10), " \u2192 ", overview?.range?.to?.slice(0, 10)] })] }), _jsxs(InlineStack, { gap: "600", children: [_jsx(Stat, { label: "Sent", value: overview?.sent }), _jsx(Stat, { label: "Delivered", value: overview?.delivered }), _jsx(Stat, { label: "Failed", value: overview?.failed }), _jsx(Stat, { label: "Delivery rate", value: toPct(overview?.deliveryRate) }), _jsx(Stat, { label: "Cost (\u20AC)", value: fmt(overview?.cost) }), _jsx(Stat, { label: "Opt-ins", value: overview?.optIns }), _jsx(Stat, { label: "Opt-outs", value: overview?.optOuts })] })] }) }) })), loadingTs ? (_jsx(ChartSkeleton, {})) : (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "200", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Messaging (last 30d)" }), _jsx("div", { style: { fontFamily: 'monospace', whiteSpace: 'pre-wrap' }, children: ts?.series
                                        ?.map((r) => `${r.day?.slice(0, 10)}  sent:${r.sent}  deliv:${r.delivered}  fail:${r.failed}  €${fmt(r.cost)}`)
                                        .join('\n') || '—' })] }) }) }))] }) }));
}
function Stat({ label, value }) {
    return (_jsxs(BlockStack, { children: [_jsx(Text, { as: "span", tone: "subdued", children: label }), _jsx(Text, { as: "p", variant: "headingLg", children: value ?? '—' })] }));
}
function toPct(n) {
    if (typeof n !== 'number')
        return '—';
    return `${(n * 100).toFixed(1)}%`;
}
function fmt(n) {
    if (typeof n !== 'number')
        return '0.00';
    return n.toFixed(2);
}
