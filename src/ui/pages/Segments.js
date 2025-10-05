import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Page, Card, BlockStack, Text, InlineStack, Button, TextField, IndexTable, Badge, Modal, } from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { inferShopDomainFromHostParam } from '../../lib/shop';
const segSchema = z.object({
    name: z.string().min(2),
    filterJson: z.string().transform((s, ctx) => {
        try {
            return s.trim() ? JSON.parse(s) : {};
        }
        catch (e) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid JSON' });
            return z.NEVER;
        }
    }),
});
function useShop() {
    return useMemo(() => inferShopDomainFromHostParam(), []);
}
export default function Segments() {
    const shop = useShop();
    const qc = useQueryClient();
    const [selected, setSelected] = useState(null);
    const [preview, setPreview] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const list = useQuery({
        queryKey: ['segments', shop],
        queryFn: () => apiFetch(`/segments?shop=${encodeURIComponent(shop)}`),
    });
    const createMut = useMutation({
        mutationFn: (payload) => apiFetch(`/segments?shop=${encodeURIComponent(shop)}`, {
            method: 'POST',
            body: JSON.stringify(payload),
        }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['segments', shop] }),
    });
    const updateMut = useMutation({
        mutationFn: ({ id, payload }) => apiFetch(`/segments/${id}?shop=${encodeURIComponent(shop)}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['segments', shop] });
            setEditorOpen(false);
        },
    });
    const deleteMut = useMutation({
        mutationFn: (id) => apiFetch(`/segments/${id}?shop=${encodeURIComponent(shop)}`, { method: 'DELETE' }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['segments', shop] }),
    });
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(segSchema),
        defaultValues: {
            name: 'High value opted-in',
            filterJson: '{"and":[{"consent":"opted_in"},{"total_spent":{"gte":100}}]}',
        },
    });
    async function onCreate(v) {
        await createMut.mutateAsync({ name: v.name, filterJson: JSON.parse(v.filterJson) });
        reset();
    }
    async function onPreview(id) {
        setPreview(null);
        const res = await apiFetch(`/segments/${id}/preview?shop=${encodeURIComponent(shop)}`, { method: 'POST', body: JSON.stringify({ limit: 20 }) });
        setPreview(res);
    }
    const rows = (list.data || []).map((s, idx) => (_jsxs(IndexTable.Row, { id: s.id, position: idx, selected: false, children: [_jsx(IndexTable.Cell, { children: s.name }), _jsx(IndexTable.Cell, { children: _jsx(Badge, { tone: "success", children: "Active" }) }), _jsx(IndexTable.Cell, { children: _jsxs(InlineStack, { gap: "200", children: [_jsx(Button, { onClick: () => {
                                setSelected(s);
                                setEditorOpen(true);
                            }, children: "Edit" }), _jsx(Button, { onClick: () => onPreview(s.id), children: "Preview" }), _jsx(Button, { tone: "critical", onClick: () => deleteMut.mutate(s.id), children: "Delete" })] }) })] }, s.id)));
    return (_jsxs(Page, { title: "Segments", children: [_jsxs(BlockStack, { gap: "400", children: [_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Create segment" }), _jsxs("form", { onSubmit: handleSubmit(onCreate), children: [_jsxs(InlineStack, { gap: "400", children: [_jsx(TextField, { label: "Name", autoComplete: "off", value: watch('name'), onChange: (value) => setValue('name', value), error: errors.name?.message }), _jsx("div", { style: { flex: 1 } })] }), _jsx(TextField, { label: "Filter JSON", multiline: 8, autoComplete: "off", value: watch('filterJson'), onChange: (value) => setValue('filterJson', value), error: errors.filterJson?.message }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Button, { submit: true, variant: "primary", loading: isSubmitting, children: "Create" }), _jsx(Button, { onClick: () => reset(), children: "Reset" })] })] })] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Segments" }), _jsx(IndexTable, { resourceName: { singular: 'segment', plural: 'segments' }, itemCount: list.data?.length || 0, headings: [{ title: 'Name' }, { title: 'Status' }, { title: 'Actions' }], selectable: false, children: rows })] }) }) }), preview && (_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Preview" }), _jsxs(Text, { as: "p", children: ["Total eligible contacts: ", _jsx("b", { children: preview.total })] }), _jsxs(Text, { as: "p", children: ["Sample (first ", preview.sample?.length || 0, ")"] }), _jsx("pre", { style: {
                                            whiteSpace: 'pre-wrap',
                                            background: '#f6f6f7',
                                            padding: 12,
                                            borderRadius: 6,
                                        }, children: JSON.stringify(preview.sample, null, 2) })] }) }) }))] }), _jsx(Modal, { open: editorOpen, onClose: () => setEditorOpen(false), title: `Edit: ${selected?.name || ''}`, primaryAction: {
                    content: 'Save',
                    onAction: async () => {
                        if (!selected)
                            return;
                        const name = document.getElementById('seg_edit_name')?.value ||
                            selected.name;
                        const json = document.getElementById('seg_edit_json')?.value ||
                            JSON.stringify(selected.filterJson);
                        try {
                            const filter = json.trim() ? JSON.parse(json) : {};
                            await updateMut.mutateAsync({
                                id: selected.id,
                                payload: { name, filterJson: filter },
                            });
                        }
                        catch (e) {
                            alert('Invalid JSON');
                        }
                    },
                }, secondaryActions: [{ content: 'Cancel', onAction: () => setEditorOpen(false) }], children: _jsx(Modal.Section, { children: _jsxs(BlockStack, { gap: "300", children: [_jsx(TextField, { id: "seg_edit_name", label: "Name", autoComplete: "off", value: selected?.name || '' }), _jsx(TextField, { id: "seg_edit_json", label: "Filter JSON", multiline: 10, autoComplete: "off", value: JSON.stringify(selected?.filterJson || {}, null, 2) })] }) }) })] }));
}
