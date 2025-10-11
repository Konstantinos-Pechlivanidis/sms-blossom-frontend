// @cursor:start(tailwind-v4-config)
// Tailwind v4 configuration - content globs not needed
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe', 
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },
        surface: { 
          DEFAULT: "#0b1220", 
          soft: "#0f172a80" 
        }
      },
      borderRadius: { 
        xl: "1rem", 
        "2xl": "1.25rem", 
        "3xl": "1.5rem" 
      },
      boxShadow: {
        card: "0 6px 24px -8px rgba(2, 132, 199, 0.18)",
        focus: "0 0 0 3px rgba(34, 211, 238, 0.45)"
      },
      backdropBlur: { 
        xs: "2px" 
      },
      transitionTimingFunction: { 
        spring: "cubic-bezier(0.2, 0.8, 0.2, 1)" 
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
// @cursor:end(tailwind-v4-config)
