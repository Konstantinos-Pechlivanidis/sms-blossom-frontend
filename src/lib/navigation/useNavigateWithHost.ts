import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPersistedHost } from '../shopify/host';

// @cursor:start(navigate-with-host)
export function useNavigateWithHost() {
  const navigate = useNavigate();
  const host = loadPersistedHost();
  
  return (to: string) => {
    const u = new URL(to, window.location.origin);
    if (host) u.searchParams.set('host', host);
    navigate(u.pathname + u.search + u.hash);
  };
}

export function LinkWithHost({ to, ...rest }: { to: string } & any) {
  const host = loadPersistedHost();
  const u = new URL(to, window.location.origin);
  if (host) u.searchParams.set('host', host);
  
  // Import Link dynamically to avoid circular dependencies
  const { Link } = require('react-router-dom');
  return React.createElement(Link, { to: u.pathname + u.search + u.hash, ...rest });
}
// @cursor:end(navigate-with-host)
