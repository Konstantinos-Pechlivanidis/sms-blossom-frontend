import React, { ReactNode } from 'react';

// @cursor:start(theme-provider)
interface PolarisThemeProviderProps {
  children: ReactNode;
}

export function PolarisThemeProvider({ children }: PolarisThemeProviderProps) {
  return (
    <>
      {children}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Brand gradient utility class */
        .gradientHero {
          background: linear-gradient(135deg, #20b2aa 0%, #008b8b 100%);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(32, 178, 170, 0.15);
        }
        
        /* Ensure proper contrast for text on gradient */
        .gradientHero h1,
        .gradientHero h2,
        .gradientHero h3,
        .gradientHero .Polaris-Text {
          color: white !important;
        }
        
        /* Soft grey card styling */
        .Polaris-Card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        /* KPI card styling */
        .kpi-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.2s ease;
        }
        
        .kpi-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }
        
        /* Responsive container */
        .app-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
        }
        
        @media (min-width: 768px) {
          .app-container {
            padding: 0 24px;
          }
        }
        
        @media (min-width: 1024px) {
          .app-container {
            padding: 0 32px;
          }
        }
        `
      }} />
    </>
  );
}
// @cursor:end(theme-provider)
