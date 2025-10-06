import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getHostParam } from './shopify';
import { inferShopDomainFromHostParam } from './shop';

interface ShopContextType {
  shop: string;
  host: string;
  isReady: boolean;
}

const ShopContext = createContext<ShopContextType>({
  shop: '',
  host: '',
  isReady: false,
});

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shop, setShop] = useState('');
  const [host, setHost] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Get host and shop from URL params on app bootstrap
    const urlParams = new URLSearchParams(window.location.search);
    const hostParam = urlParams.get('host') || '';
    const shopParam = urlParams.get('shop') || '';

    // Set host
    setHost(hostParam);

    // Try to get shop from various sources
    let detectedShop = '';
    
    // 1. Direct shop parameter
    if (shopParam && shopParam.includes('.myshopify.com')) {
      detectedShop = shopParam.toLowerCase();
    }
    // 2. From host parameter
    else if (hostParam) {
      try {
        const decoded = atob(hostParam);
        const url = new URL(`https://${decoded}`);
        const parts = url.hostname.split('.');
        if (parts.length >= 3 && url.hostname.endsWith('.myshopify.com')) {
          detectedShop = url.hostname.toLowerCase();
        }
      } catch {
        // Fall back to inferShopDomainFromHostParam
        detectedShop = inferShopDomainFromHostParam();
      }
    }
    // 3. Fallback to existing logic
    else {
      detectedShop = inferShopDomainFromHostParam();
    }

    setShop(detectedShop);
    setIsReady(true);

    // Log for development
    if (import.meta.env.DEV) {
      console.log('[ShopContext] Initialized:', { shop: detectedShop, host: hostParam });
    }
  }, []);

  return (
    <ShopContext.Provider value={{ shop, host, isReady }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
