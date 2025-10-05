import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Page, Card, BlockStack, Text, TextField, InlineStack, Button, CalloutCard, Badge, } from '@shopify/polaris';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import CopyButton from '../components/CopyButton';
import UtmBuilder from '../components/UtmBuilder';
export default function CampaignDetail() {
    const { id = '' } = useParams();
    const shop = useMemo(() => inferShopDomainFromHostParam(), []);
    const qc = useQueryClient();
    const nav = useNavigate();
    const campaign = useQuery({
        queryKey: ['campaign', id, shop],
        queryFn: () => apiFetch(`/campaigns/${id}?shop=${encodeURIComponent(shop)}`),
    });
    const segments = useQuery({
        queryKey: ['segments', shop],
        queryFn: () => apiFetch(`/segments?shop=${encodeURIComponent(shop)}`),
    });
    const [name, setName] = useState('');
    const [segmentId, setSegmentId] = useState('');
    const [templateKey, setTemplateKey] = useState('campaign');
    const [discountCode, setDiscountCode] = useState('');
    const [applyUrl, setApplyUrl] = useState('');
    const [utm, setUtm] = useState({ utm_source: 'sms', utm_medium: 'sms' });
    const [testTo, setTestTo] = useState('');
    const [estimate, setEstimate] = useState(null);
    const [snapshot, setSnapshot] = useState(null);
    // keep local fields synced
    useEffect(() => {
        if (campaign.data && !name) {
            setName(campaign.data.name || '');
            setSegmentId(campaign.data.segmentId || '');
            setTemplateKey(campaign.data.templateKey || 'campaign');
            setUtm(campaign.data.utmJson || { utm_source: 'sms', utm_medium: 'sms' });
        }
    }, [campaign.data, name]);
    const saveMut = useMutation({
        mutationFn: () => apiFetch(`/campaigns/${id}?shop=${encodeURIComponent(shop)}`, {
            method: 'PUT',
            body: JSON.stringify({ name, segmentId: segmentId || null, templateKey }),
        }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['campaign', id, shop] }),
    });
    const attachMut = useMutation({
        mutationFn: () => apiFetch(`/campaigns/${id}/attach-discount?shop=${encodeURIComponent(shop)}`, {
            method: 'POST',
            body: JSON.stringify({ code: discountCode }),
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['campaign', id, shop] });
        },
    });
    const utmMut = useMutation({
        mutationFn: () => apiFetch(`/campaigns/${id}/utm?shop=${encodeURIComponent(shop)}`, {
            method: 'PUT',
            body: JSON.stringify(utm),
        }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['campaign', id, shop] }),
    });
    async function previewApplyUrl() {
        const res = await apiFetch(`/campaigns/${id}/apply-url?shop=${encodeURIComponent(shop)}&redirect=/checkout&short=true`);
        setApplyUrl(res.url);
    }
    async function doSnapshot() {
        try {
            const res = await apiFetch(`/campaigns/${id}/snapshot?shop=${encodeURIComponent(shop)}`, {
                method: 'POST',
            });
            setSnapshot(res);
        }
        catch {
            // Fallback: if snapshot not implemented, try segments preview
            if (campaign.data?.segmentId) {
                const prev = await apiFetch(`/segments/${campaign.data.segmentId}/preview?shop=${encodeURIComponent(shop)}`, { method: 'POST', body: JSON.stringify({ limit: 1 }) });
                setSnapshot({
                    count: prev?.total ?? 0,
                    note: 'Segment preview used (snapshot endpoint unavailable)',
                });
            }
        }
    }
    async function doEstimate() {
        try {
            const res = await apiFetch(`/campaigns/${id}/estimate?shop=${encodeURIComponent(shop)}`, {
                method: 'POST',
            });
            setEstimate(res);
        }
        catch {
            setEstimate({ error: 'Estimate endpoint not available' });
        }
    }
    async function doTestSend() {
        if (!testTo) {
            alert('Enter test phone (E.164)');
            return;
        }
        const res = await apiFetch(`/campaigns/${id}/test-send?shop=${encodeURIComponent(shop)}`, {
            method: 'POST',
            body: JSON.stringify({ to: testTo }),
        });
        alert('Test sent: ' + JSON.stringify(res));
    }
    async function doSendNow() {
        const res = await apiFetch(`/campaigns/${id}/send-now?shop=${encodeURIComponent(shop)}`, {
            method: 'POST',
        });
        alert('Send queued: ' + JSON.stringify(res));
        qc.invalidateQueries({ queryKey: ['campaigns', shop] });
    }
    return (_jsx(Page, { title: `Campaign: ${campaign.data?.name || ''}`, backAction: { content: 'Back', onAction: () => nav('/campaigns') }, children: _jsxs(BlockStack, { gap: "400", children: [_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Details" }), _jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { label: "Name", value: name, onChange: setName, autoComplete: "off" }), _jsx(TextField, { label: "Segment ID", value: segmentId, onChange: setSegmentId, autoComplete: "off", helpText: "Use Segments page to get an ID" }), _jsx(TextField, { label: "Template key", value: templateKey, onChange: setTemplateKey, autoComplete: "off" })] }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Button, { variant: "primary", onClick: () => saveMut.mutate(), loading: saveMut.isPending, children: "Save" }), _jsx(Badge, { tone: "success", children: campaign.data?.status || 'draft' })] })] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Discount" }), _jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { label: "Code", value: discountCode, onChange: setDiscountCode, autoComplete: "off" }), _jsx(Button, { onClick: () => attachMut.mutate(), loading: attachMut.isPending, children: "Attach to campaign" }), _jsx(Button, { tone: "critical", onClick: () => apiFetch(`/campaigns/${id}/detach-discount?shop=${encodeURIComponent(shop)}`, {
                                                method: 'POST',
                                            }).then(() => qc.invalidateQueries({ queryKey: ['campaign', id, shop] })), children: "Detach" })] }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Button, { onClick: previewApplyUrl, children: "Preview apply URL" }), applyUrl && (_jsxs(_Fragment, { children: [_jsx(CopyButton, { text: applyUrl, children: "Copy link" }), _jsx(Button, { url: applyUrl, target: "_blank", children: "Open" })] }))] }), applyUrl && (_jsx("div", { style: {
                                        fontFamily: 'monospace',
                                        background: '#f6f6f7',
                                        padding: 12,
                                        borderRadius: 6,
                                        wordBreak: 'break-all',
                                    }, children: applyUrl }))] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "UTM" }), _jsx(UtmBuilder, { value: utm, onChange: setUtm }), _jsx(InlineStack, { gap: "400", children: _jsx(Button, { onClick: () => utmMut.mutate(), loading: utmMut.isPending, children: "Save UTM" }) })] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Audience" }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Button, { onClick: doSnapshot, children: "Snapshot audience" }), _jsx(Button, { onClick: doEstimate, children: "Estimate cost" })] }), snapshot && (_jsx(CalloutCard, { title: "Snapshot", illustration: "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg", primaryAction: { content: 'Refresh', onAction: () => { } }, children: _jsxs(Text, { as: "p", children: ["Count: ", _jsx("b", { children: snapshot.count ?? snapshot.total ?? 0 }), ' ', snapshot.note ? `(${snapshot.note})` : ''] }) })), estimate && (_jsx(CalloutCard, { title: "Estimate", illustration: "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg", primaryAction: { content: 'Refresh', onAction: () => { } }, children: _jsx("pre", { style: {
                                            whiteSpace: 'pre-wrap',
                                            background: '#f6f6f7',
                                            padding: 12,
                                            borderRadius: 6,
                                        }, children: JSON.stringify(estimate, null, 2) }) }))] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Test & Send" }), _jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { label: "Test phone (E.164)", value: testTo, onChange: setTestTo, autoComplete: "off" }), _jsx(Button, { onClick: doTestSend, children: "Send test" }), _jsx(Button, { variant: "primary", tone: "success", onClick: doSendNow, children: "Send now" })] })] }) }) })] }) }));
}
