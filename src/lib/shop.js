export function inferShopDomainFromHostParam() {
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
}
export function appendUtm(url, utm) {
    try {
        const u = new URL(url);
        Object.entries(utm).forEach(([k, v]) => {
            if (v != null && v !== '')
                u.searchParams.set(k, String(v));
        });
        return u.toString();
    }
    catch {
        return url;
    }
}
