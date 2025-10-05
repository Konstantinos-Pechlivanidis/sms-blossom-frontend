import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Frame, Navigation, Toast } from '@shopify/polaris';
import { HomeIcon, SettingsIcon, ViewIcon, DiscountIcon, PersonIcon, MentionIcon, } from '@shopify/polaris-icons';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Discounts from './pages/Discounts';
import Segments from './pages/Segments';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Reports from './pages/Reports';
import ErrorBoundary from './components/ErrorBoundary';
import { bus } from '../lib/events';
function NavLink({ to, label, icon }) {
    const location = useLocation();
    const selected = location.pathname.startsWith(to);
    return _jsx(Navigation.Item, { url: to, label: label, icon: icon, selected: selected });
}
export default function App() {
    const [toast, setToast] = React.useState({
        active: false,
        content: '',
    });
    React.useEffect(() => {
        function onErr(e) {
            setToast({ active: true, content: e?.detail?.message || 'Request failed' });
        }
        bus.addEventListener('api-error', onErr);
        return () => bus.removeEventListener('api-error', onErr);
    }, []);
    return (_jsxs(Frame, { navigation: _jsxs(Navigation, { location: "/", children: [_jsx(NavLink, { to: "/", label: "Dashboard", icon: HomeIcon }), _jsx(NavLink, { to: "/discounts", label: "Discounts", icon: DiscountIcon }), _jsx(NavLink, { to: "/segments", label: "Segments", icon: PersonIcon }), _jsx(NavLink, { to: "/campaigns", label: "Campaigns", icon: MentionIcon }), _jsx(NavLink, { to: "/reports", label: "Reports", icon: ViewIcon }), _jsx(NavLink, { to: "/settings", label: "Settings", icon: SettingsIcon })] }), children: [_jsx(ErrorBoundary, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/discounts", element: _jsx(Discounts, {}) }), _jsx(Route, { path: "/segments", element: _jsx(Segments, {}) }), _jsx(Route, { path: "/campaigns", element: _jsx(Campaigns, {}) }), _jsx(Route, { path: "/campaigns/:id", element: _jsx(CampaignDetail, {}) }), _jsx(Route, { path: "/reports", element: _jsx(Reports, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "*", element: _jsx("div", { style: { padding: 16 }, children: "Not found" }) })] }) }), toast.active && (_jsx(Toast, { content: toast.content, onDismiss: () => setToast({ active: false, content: '' }) })), _jsx(Outlet, {})] }));
}
