import createApp from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
export function getHostParam() {
    const url = new URL(window.location.href);
    return url.searchParams.get('host') || '';
}
export function getShopFromHost(host) {
    try {
        const decoded = atob(host);
        const url = new URL(`https://${decoded}`);
        const parts = url.hostname.split('.');
        if (parts.length >= 3)
            return `${parts[0]}.myshopify.com`;
        if (url.hostname.endsWith('myshopify.com'))
            return url.hostname;
        return null;
    }
    catch {
        return null;
    }
}
let _app = null;
export function getAppBridge() {
    if (_app)
        return _app;
    _app = createApp({
        apiKey: __SHOPIFY_API_KEY__,
        host: getHostParam(),
        forceRedirect: true,
    });
    return _app;
}
export async function getBearerToken() {
    const app = getAppBridge();
    const token = await getSessionToken(app);
    return token;
}
