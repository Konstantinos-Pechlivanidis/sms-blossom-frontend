import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import { ReactNode } from 'react';

// @cursor:start(polaris-theme)
const theme = {
  colorSchemes: {
    light: {
      colors: {
        // Brand teal gradient colors - accessible and professional
        primary: { 
          '50':'#ecfeff','100':'#cffafe','200':'#a5f3fc','300':'#67e8f9',
          '400':'#22d3ee','500':'#06b6d4','600':'#0891b2','700':'#0e7490',
          '800':'#155e75','900':'#164e63'
        },
        // Soft greys for backgrounds
        surface: {
          '50': '#f8fafc',
          '100': '#f1f5f9', 
          '200': '#e2e8f0',
          '300': '#cbd5e1'
        }
      }
    }
  }
};

export function PolarisThemeProvider({ children }: { children: ReactNode }) {
  return (
    <AppProvider i18n={en}>
      {children}
    </AppProvider>
  );
}
// @cursor:end(polaris-theme)
