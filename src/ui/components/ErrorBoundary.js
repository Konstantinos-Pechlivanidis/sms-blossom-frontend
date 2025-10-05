import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Page, Card, BlockStack, Text, Button } from '@shopify/polaris';
export default class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary', error, info);
    }
    render() {
        if (!this.state.hasError)
            return this.props.children;
        return (_jsx(Page, { title: "Something went wrong", children: _jsx(Card, { children: _jsx("div", { style: { padding: '16px' }, children: _jsxs(BlockStack, { gap: "300", children: [_jsx(Text, { as: "p", tone: "critical", children: "An unexpected error occurred." }), _jsx(Text, { as: "p", tone: "subdued", children: String(this.state.error?.message || '') }), _jsx(Button, { onClick: () => location.reload(), children: "Reload" })] }) }) }) }));
    }
}
