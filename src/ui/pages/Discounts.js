import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Page, Card, BlockStack, Text, TextField, Button, InlineStack, Select, Checkbox, Divider, Banner, CalloutCard, } from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CopyButton from '../components/CopyButton';
import UtmBuilder from '../components/UtmBuilder';
import { appendUtm, inferShopDomainFromHostParam } from '../../lib/shop';
const schema = z
    .object({
    code: z
        .string()
        .min(3)
        .max(64)
        .regex(/^[A-Z0-9\-_]+$/, 'Use A–Z, 0–9, dashes or underscores')
        .transform((s) => s.toUpperCase()),
    title: z.string().max(200).optional(),
    kind: z.enum(['percentage', 'amount']),
    value: z.coerce.number().positive('Must be > 0'),
    currencyCode: z.string().optional(),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    appliesOncePerCustomer: z.boolean().default(true),
    usageLimit: z.coerce.number().int().positive().optional(),
    redirect: z.string().default('/checkout'),
})
    .refine((v) => (v.kind === 'amount' ? !!v.currencyCode : true), {
    path: ['currencyCode'],
    message: 'Currency required for amount discounts',
})
    .refine((v) => {
    if (!v.startsAt || !v.endsAt)
        return true;
    return new Date(v.endsAt).getTime() > new Date(v.startsAt).getTime();
}, { path: ['endsAt'], message: 'End must be after start' });
export default function Discounts() {
    const shop = useMemo(() => inferShopDomainFromHostParam(), []);
    const [utm, setUtm] = useState({ utm_source: 'sms', utm_medium: 'sms' });
    const [previewUrl, setPreviewUrl] = useState('');
    const [response, setResponse] = useState(null);
    const [conflicts, setConflicts] = useState([]);
    const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            code: 'WELCOME10',
            title: 'Welcome 10%',
            kind: 'percentage',
            value: 10,
            redirect: '/checkout',
            appliesOncePerCustomer: true,
        },
    });
    const kind = watch('kind');
    async function onSubmit(values) {
        setResponse(null);
        setPreviewUrl('');
        const payload = {
            code: values.code,
            title: values.title || values.code,
            kind: values.kind,
            value: values.value,
            appliesOncePerCustomer: values.appliesOncePerCustomer,
            usageLimit: values.usageLimit ?? undefined,
        };
        if (values.kind === 'amount')
            payload.currencyCode = values.currencyCode || 'EUR';
        if (values.startsAt)
            payload.startsAt = toIso(values.startsAt);
        if (values.endsAt)
            payload.endsAt = toIso(values.endsAt);
        const created = await apiFetch(`/discounts?shop=${encodeURIComponent(shop)}`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setResponse(created);
        // Build apply URL using backend helper, then add UTM client-side
        const urlRes = await apiFetch(`/discounts/apply-url?shop=${encodeURIComponent(shop)}&code=${encodeURIComponent(values.code)}&redirect=${encodeURIComponent(values.redirect || '/checkout')}`).catch(() => ({ url: '' }));
        const withUtm = appendUtm(urlRes.url, utm);
        setPreviewUrl(withUtm);
    }
    async function runConflictScan() {
        const res = await apiFetch(`/discounts/conflicts?shop=${encodeURIComponent(shop)}`);
        setConflicts(res.automaticDiscounts || []);
    }
    return (_jsx(Page, { title: "Discounts", children: _jsxs(BlockStack, { gap: "400", children: [_jsx(Banner, { tone: "info", children: "Create code discounts, preview apply URLs, add UTM parameters, and scan for conflicts with active automatic discounts." }), _jsx(Card, { children: _jsx("form", { onSubmit: handleSubmit(onSubmit), children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Discount details" }), _jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { label: "Code", autoComplete: "off", value: watch('code'), onChange: (value) => setValue('code', value), error: errors.code?.message }), _jsx(TextField, { label: "Title", autoComplete: "off", value: watch('title'), onChange: (value) => setValue('title', value), error: errors.title?.message })] }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Select, { label: "Type", options: [
                                                    { label: 'Percentage', value: 'percentage' },
                                                    { label: 'Amount', value: 'amount' },
                                                ], value: kind, onChange: (value) => setValue('kind', value) }), _jsx(TextField, { label: kind === 'percentage' ? 'Value (%)' : 'Amount', autoComplete: "off", value: String(watch('value')), onChange: (value) => setValue('value', Number(value)), error: errors.value?.message }), kind === 'amount' && (_jsx(Select, { label: "Currency", options: [
                                                    { label: 'EUR', value: 'EUR' },
                                                    { label: 'USD', value: 'USD' },
                                                    { label: 'GBP', value: 'GBP' },
                                                ], value: watch('currencyCode'), onChange: (value) => setValue('currencyCode', value) }))] }), _jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { type: "datetime-local", label: "Starts at", autoComplete: "off", value: watch('startsAt'), onChange: (value) => setValue('startsAt', value), error: errors.startsAt?.message }), _jsx(TextField, { type: "datetime-local", label: "Ends at", autoComplete: "off", value: watch('endsAt'), onChange: (value) => setValue('endsAt', value), error: errors.endsAt?.message })] }), _jsxs(InlineStack, { gap: "400", align: "space-between", children: [_jsx(Checkbox, { label: "Once per customer", checked: watch('appliesOncePerCustomer'), onChange: (checked) => setValue('appliesOncePerCustomer', checked) }), _jsx(TextField, { label: "Usage limit (optional)", autoComplete: "off", value: watch('usageLimit') ? String(watch('usageLimit')) : '', onChange: (value) => setValue('usageLimit', value ? Number(value) : undefined), error: errors.usageLimit?.message })] }), _jsx(Divider, {}), _jsx(Text, { as: "h2", variant: "headingMd", children: "Link & tracking" }), _jsx(InlineStack, { gap: "400", children: _jsx(TextField, { label: "Redirect path", helpText: "Where Shopify should send customers after applying the code", autoComplete: "off", value: watch('redirect'), onChange: (value) => setValue('redirect', value) }) }), _jsx(UtmBuilder, { value: utm, onChange: setUtm }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Button, { submit: true, variant: "primary", loading: isSubmitting, children: "Create discount" }), _jsx(Button, { onClick: runConflictScan, children: "Scan automatic conflicts" }), _jsx(Button, { onClick: () => {
                                                    reset();
                                                    setPreviewUrl('');
                                                    setResponse(null);
                                                }, tone: "critical", children: "Reset form" })] })] }) }) }) }), response && (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Created" }), _jsx("pre", { style: {
                                        whiteSpace: 'pre-wrap',
                                        background: '#f6f6f7',
                                        padding: 12,
                                        borderRadius: 6,
                                    }, children: JSON.stringify(response, null, 2) })] }) }) })), previewUrl && (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Apply URL (with UTM)" }), _jsx("div", { style: {
                                        fontFamily: 'monospace',
                                        background: '#f6f6f7',
                                        padding: 12,
                                        borderRadius: 6,
                                        wordBreak: 'break-all',
                                    }, children: previewUrl }), _jsxs(InlineStack, { gap: "400", children: [_jsx(CopyButton, { text: previewUrl, children: "Copy link" }), _jsx(Button, { url: previewUrl, target: "_blank", children: "Open" })] })] }) }) })), conflicts.length > 0 && (_jsx(CalloutCard, { title: "Active automatic discounts (advisory)", illustration: "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg", primaryAction: { content: 'Refresh', onAction: runConflictScan }, children: _jsx(BlockStack, { gap: "200", children: conflicts.map((c, i) => (_jsx("div", { style: { padding: '4px 0' }, children: _jsxs(Text, { as: "p", children: [_jsx("b", { children: c.title }), " \u2014 ", c.type, " \u2014 combinesWith:", ' ', c.combinesWith
                                        ? Object.entries(c.combinesWith)
                                            .map(([k, v]) => `${k}:${v ? '✓' : '✕'}`)
                                            .join(', ')
                                        : 'n/a'] }) }, i))) }) }))] }) }));
}
function toIso(local) {
    // datetime-local returns local time; convert to ISO UTC
    const d = new Date(local);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
