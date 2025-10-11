import type { Config } from 'tailwindcss';

// @cursor-tailwind:start(config)
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  prefix: 'tw-',
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#20B2AA', // Teal
          secondary: '#17A2B8', // Teal variant
          accent: '#00CED1', // Dark turquoise
          surface: '#F8F9FA',
          muted: '#E9ECEF',
        },
        polaris: {
          // Mirror Polaris colors for consistency
          surface: '#FFFFFF',
          surfaceSubdued: '#F6F6F7',
          border: '#E1E3E5',
          text: '#202223',
          textSubdued: '#6D7175',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  corePlugins: {
    // Disable preflight to avoid conflicts with Polaris
    preflight: false,
  },
};
// @cursor-tailwind:end(config)

export default config;
