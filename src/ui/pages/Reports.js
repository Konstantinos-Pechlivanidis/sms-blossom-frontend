import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Page, Card, BlockStack, InlineStack, Text, Select, Button, IndexTable, Badge, } from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import { fmtMoney, fmtPct } from '../../lib/format';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, } from 'recharts';
import { KpiSkeletonRow, ChartSkeleton, TableSkeleton } from '../components/Skeletons';
export default function Reports() {
    const shop = useMemo(() => inferShopDomainFromHostParam(), []);
    const [windowSel, setWindowSel] = useState('30d');
    const { data: overview, isLoading: loadO } = useQuery({
        queryKey: ['r_overview', shop, windowSel],
        queryFn: () => apiFetch(`/reports/overview?shop=${encodeURIComponent(shop)}&window=${windowSel}`),
        enabled: !!shop,
    });
    const { data: timeseries, isLoading: loadT } = useQuery({
        queryKey: ['r_ts', shop, windowSel],
        queryFn: () => apiFetch(`/reports/messaging/timeseries?shop=${encodeURIComponent(shop)}&window=${windowSel}`),
        enabled: !!shop,
    });
    const { data: campaigns, isLoading: loadC } = useQuery({
        queryKey: ['r_campaigns', shop, windowSel],
        queryFn: () => apiFetch(`/reports/campaigns?shop=${encodeURIComponent(shop)}&window=${windowSel}`),
        enabled: !!shop,
    });
    const { data: automations, isLoading: loadA } = useQuery({
        queryKey: ['r_autom', shop, windowSel],
        queryFn: () => apiFetch(`/reports/automations?shop=${encodeURIComponent(shop)}&window=${windowSel}`),
        enabled: !!shop,
    });
    return (_jsx(Page, { title: "Reports", children: _jsxs(BlockStack, { gap: "400", children: [loadO ? (_jsx(KpiSkeletonRow, {})) : (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsxs(InlineStack, { align: "space-between", gap: "400", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Overview" }), _jsxs(InlineStack, { gap: "200", children: [_jsx(Select, { label: "Window", labelHidden: true, options: [
                                                        { label: '7 days', value: '7d' },
                                                        { label: '30 days', value: '30d' },
                                                        { label: '90 days', value: '90d' },
                                                    ], value: windowSel, onChange: (v) => setWindowSel(v) }), _jsx(Button, { onClick: () => {
                                                        /* could add from/to pickers in FE-D.1 */
                                                    }, children: "Custom\u2026 (v2)" })] })] }), _jsxs(InlineStack, { gap: "600", children: [_jsx(Stat, { label: "Sent", value: overview?.sent }), _jsx(Stat, { label: "Delivered", value: overview?.delivered }), _jsx(Stat, { label: "Failed", value: overview?.failed }), _jsx(Stat, { label: "Delivery", value: fmtPct(overview?.deliveryRate) }), _jsx(Stat, { label: "Spend", value: fmtMoney(overview?.cost) }), _jsx(Stat, { label: "Opt-ins", value: overview?.optIns }), _jsx(Stat, { label: "Opt-outs", value: overview?.optOuts })] }), _jsxs(Text, { tone: "subdued", as: "span", children: ["Range: ", overview?.range?.from?.slice(0, 10), " \u2192 ", overview?.range?.to?.slice(0, 10)] })] }) }) })), loadT ? (_jsx(ChartSkeleton, {})) : (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Messaging timeseries" }), _jsx("div", { style: { width: '100%', height: 320 }, children: _jsx(ResponsiveContainer, { children: _jsxs(LineChart, { data: (timeseries?.series || []).map((p) => ({
                                                ...p,
                                                day: (p.day || '').slice(0, 10),
                                            })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "day" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "sent", stroke: "#8884d8", dot: false }), _jsx(Line, { type: "monotone", dataKey: "delivered", stroke: "#82ca9d", dot: false }), _jsx(Line, { type: "monotone", dataKey: "failed", stroke: "#ff6961", dot: false })] }) }) })] }) }) })), loadC ? _jsx(TableSkeleton, {}) : _jsx(CampaignAttributionTable, { data: campaigns?.items || [] }), loadA ? _jsx(KpiSkeletonRow, {}) : _jsx(AutomationAttributionCard, { data: automations?.items || [] })] }) }));
}
function Stat({ label, value }) {
    return (_jsxs(BlockStack, { children: [_jsx(Text, { tone: "subdued", as: "span", children: label }), _jsx(Text, { variant: "headingLg", as: "p", children: value ?? '—' })] }));
}
function CampaignAttributionTable({ data }) {
    const rows = data.map((c, idx) => (_jsxs(IndexTable.Row, { id: c.campaignId, position: idx, selected: false, children: [_jsx(IndexTable.Cell, { children: _jsx(Text, { as: "span", children: c.name || c.campaignId }) }), _jsx(IndexTable.Cell, { children: _jsx(Text, { as: "span", children: fmtMoney(c.revenue) }) }), _jsx(IndexTable.Cell, { children: _jsx(Text, { as: "span", children: c.orders }) }), _jsx(IndexTable.Cell, { children: _jsxs(Text, { as: "span", children: ["disc:", c.via?.discount || 0, " / utm:", c.via?.utm || 0] }) }), _jsx(IndexTable.Cell, { children: _jsxs(InlineStack, { gap: "200", children: [_jsx(Badge, { tone: "success", children: `sent ${c.messaging?.sent || 0}` }), _jsx(Badge, { tone: "success", children: `deliv ${c.messaging?.delivered || 0}` }), _jsx(Badge, { tone: "critical", children: `fail ${c.messaging?.failed || 0}` })] }) }), _jsx(IndexTable.Cell, { children: _jsx(Text, { as: "span", children: c.clicks_lifetime || 0 }) })] }, c.campaignId)));
    return (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Campaign attribution" }), _jsx(IndexTable, { resourceName: { singular: 'campaign', plural: 'campaigns' }, itemCount: data.length, headings: [
                            { title: 'Campaign' },
                            { title: 'Revenue' },
                            { title: '# Orders' },
                            { title: 'Attribution (disc/utm)' },
                            { title: 'Messaging' },
                            { title: 'Clicks (lifetime)' },
                        ], selectable: false, children: rows })] }) }) }));
}
function AutomationAttributionCard({ data, }) {
    const ac = (data || []).find((x) => x.automation === 'abandoned_checkout');
    return (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "200", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Automation attribution" }), _jsxs(InlineStack, { gap: "600", children: [_jsx(Stat, { label: "Abandoned Checkout \u2014 Orders", value: ac?.orders ?? 0 }), _jsx(Stat, { label: "Abandoned Checkout \u2014 Revenue", value: fmtMoney(ac?.revenue || 0) })] }), _jsx(Text, { tone: "subdued", as: "span", children: "Joins message.metadata.checkoutId \u2194 order.checkout_id from webhook events." })] }) }) }));
}
