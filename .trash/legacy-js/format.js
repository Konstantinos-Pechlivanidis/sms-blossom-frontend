export function fmtMoney(n, currency = 'EUR') {
    if (typeof n !== 'number')
        return '€0.00';
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
    }
    catch {
        return `€${n.toFixed(2)}`;
    }
}
export function fmtPct(n) {
    if (typeof n !== 'number')
        return '—';
    return `${(n * 100).toFixed(1)}%`;
}
export function fmtDateISO(s) {
    if (!s)
        return '—';
    try {
        return new Date(s).toLocaleString();
    }
    catch {
        return s;
    }
}
