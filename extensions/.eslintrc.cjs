module.exports = {
  root: false,
  env: { es2022: true },
  overrides: [
    {
      files: ["**/src/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "no-restricted-imports": ["error", {
          paths: [
            { name: "react", message: "Do not use React in Checkout UI extensions." },
            { name: "react-dom", message: "Do not use React in Checkout UI extensions." },
            { name: "@shopify/checkout-ui-extensions-react", message: "Use @shopify/checkout-ui-extensions instead." },
            { name: "country-state-city", message: "Too heavy for the 64KB limit." }
          ]
        }]
      }
    }
  ]
};
