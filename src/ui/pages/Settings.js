import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Page, Card, Text, BlockStack, Button, InlineStack, Checkbox } from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useEffect, useMemo, useState } from 'react';
import { inferShopDomainFromHostParam } from '../../lib/shop';
export default function Settings() {
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['health'],
        queryFn: () => apiFetch('/health'),
    });
    const shop = useMemo(() => inferShopDomainFromHostParam(), []);
    const [bannerEnabled, setBannerEnabled] = useState(false);
    const [unsubscribeExample, setUnsubExample] = useState('');
    useEffect(() => {
        // Try backend settings; fallback to localStorage
        (async () => {
            try {
                const s = await apiFetch(`/settings?shop=${encodeURIComponent(shop)}`);
                setBannerEnabled(!!s?.ui?.bannerEnabled);
            }
            catch {
                const ls = localStorage.getItem('ui.bannerEnabled');
                if (ls != null)
                    setBannerEnabled(ls === 'true');
            }
            // Unsubscribe example link (App Proxy)
            setUnsubExample(`/apps/sms-blossom/public/unsubscribe?shop=${encodeURIComponent(shop)}&phone=%2B3069XXXXXXX`);
        })();
    }, [shop]);
    async function saveBanner() {
        try {
            await apiFetch(`/settings?shop=${encodeURIComponent(shop)}`, {
                method: 'PUT',
                body: JSON.stringify({ ui: { bannerEnabled } }),
            });
            alert('Saved settings');
        }
        catch {
            // fallback persist locally so UI remains usable
            localStorage.setItem('ui.bannerEnabled', String(bannerEnabled));
            alert('Backend settings endpoint not available. Saved locally for now.');
        }
    }
    return (_jsx(Page, { title: "Settings", children: _jsxs(BlockStack, { gap: "400", children: [_jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "200", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Backend health" }), _jsxs(Text, { as: "p", children: ["Status: ", _jsx("b", { children: data?.status ?? '—' })] }), _jsxs(Text, { as: "p", children: ["DB: ", _jsx("b", { children: String(data?.db ?? '—') }), ", Queue: ", _jsx("b", { children: String(data?.redis ?? '—') })] }), _jsx(Button, { onClick: () => refetch(), loading: isFetching, children: "Refresh" })] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Theme banner (App Embed)" }), _jsx(Text, { as: "p", tone: "subdued", children: "Toggle the storefront consent banner. The embed itself is enabled/disabled in the Theme Editor; this flag lets your backend respect a merchant preference if you wire it server-side." }), _jsx(Checkbox, { label: "Enable banner", checked: bannerEnabled, onChange: (v) => setBannerEnabled(!!v) }), _jsxs(InlineStack, { gap: "400", children: [_jsx(Button, { onClick: saveBanner, variant: "primary", children: "Save" }), _jsx(Button, { url: "/admin/themes/current/editor?template=theme", target: "_blank", children: "Open Theme Editor" })] })] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Unsubscribe link (example)" }), _jsx(Text, { as: "p", children: unsubscribeExample }), _jsx(Button, { url: unsubscribeExample, target: "_blank", children: "Open example" })] }) }) }), _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "200", children: [_jsx(Text, { as: "h2", variant: "headingMd", children: "Environment" }), _jsxs(Text, { as: "p", children: ["VITE_BACKEND_URL = ", __BACKEND_URL__] }), _jsxs(Text, { as: "p", children: ["VITE_SHOPIFY_API_KEY = ", __SHOPIFY_API_KEY__] })] }) }) })] }) }));
}
