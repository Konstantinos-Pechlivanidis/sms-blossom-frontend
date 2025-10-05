import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Page, Card, BlockStack, Text, Button, InlineStack, TextField, Select, IndexTable, Badge, } from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { inferShopDomainFromHostParam } from '../../lib/shop';
export default function Campaigns() {
    const shop = useMemo(() => inferShopDomainFromHostParam(), []);
    const qc = useQueryClient();
    const nav = useNavigate();
    const segments = useQuery({
        queryKey: ['segments', shop],
        queryFn: () => apiFetch(`/segments?shop=${encodeURIComponent(shop)}`),
    });
    const list = useQuery({
        queryKey: ['campaigns', shop],
        queryFn: () => apiFetch(`/campaigns?shop=${encodeURIComponent(shop)}`),
    });
    const [name, setName] = useState('October Blast');
    const [segmentId, setSegmentId] = useState('');
    const [templateKey, setTemplateKey] = useState('campaign');
    const [scheduleAt, setScheduleAt] = useState('');
    const [batchSize, setBatchSize] = useState('500');
    const createMut = useMutation({
        mutationFn: () => apiFetch(`/campaigns?shop=${encodeURIComponent(shop)}`, {
            method: 'POST',
            body: JSON.stringify({
                name,
                segmentId: segmentId || null,
                templateKey,
                scheduleAt: scheduleAt ? toIso(scheduleAt) : null,
                batchSize: Number(batchSize) || 500,
            }),
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['campaigns', shop] });
        },
    });
    const rows = (list.data || []).map((c, idx) => (_jsxs(IndexTable.Row, { id: c.id, position: idx, selected: false, children: [_jsx(IndexTable.Cell, { children: _jsx(Text, { as: "span", children: c.name }) }), _jsx(IndexTable.Cell, { children: _jsx(Badge, { children: c.status || 'draft' }) }), _jsx(IndexTable.Cell, { children: _jsx(Text, { as: "span", tone: "subdued", children: c.templateKey || 'campaign' }) }), _jsx(IndexTable.Cell, { children: _jsx(Text, { as: "span", tone: "subdued", children: c.scheduleAt ? new Date(c.scheduleAt).toLocaleString() : '—' }) }), _jsx(IndexTable.Cell, { children: _jsx(Button, { onClick: () => nav(`/campaigns/${c.id}`), children: "Open" }) })] }, c.id)));
    return (_jsx(Page, { title: "Campaigns", children: _jsxs(BlockStack, { gap: "400", children: [_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Create campaign" }), _jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { label: "Name", value: name, onChange: setName, autoComplete: "off" }), _jsx(Select, { label: "Segment", options: [
                                                { label: '(none)', value: '' },
                                                ...(segments.data || []).map((s) => ({ label: s.name, value: s.id })),
                                            ], value: segmentId, onChange: setSegmentId }), _jsx(TextField, { label: "Template key", value: templateKey, onChange: setTemplateKey, autoComplete: "off" })] }), _jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { type: "datetime-local", label: "Schedule at (optional)", value: scheduleAt, onChange: setScheduleAt, autoComplete: "off" }), _jsx(TextField, { label: "Batch size", value: batchSize, onChange: setBatchSize, autoComplete: "off" }), _jsx("div", { style: { flex: 1 } })] }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Button, { variant: "primary", onClick: () => createMut.mutate(), loading: createMut.isPending, children: "Create" }), _jsx(Button, { onClick: () => {
                                                setName('');
                                                setSegmentId('');
                                                setScheduleAt('');
                                            }, children: "Reset" })] })] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Campaigns" }), _jsx(IndexTable, { resourceName: { singular: 'campaign', plural: 'campaigns' }, itemCount: list.data?.length || 0, headings: [
                                        { title: 'Name' },
                                        { title: 'Status' },
                                        { title: 'Template' },
                                        { title: 'Schedule' },
                                        { title: 'Open' },
                                    ], selectable: false, children: rows })] }) }) })] }) }));
}
function toIso(local) {
    const d = new Date(local);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
