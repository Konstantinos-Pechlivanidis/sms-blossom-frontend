/** @type {import('eslint').Linter.FlatConfig[]} */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  { ignores: [
      'dist/**',
      'node_modules/**',
      'src/api/sdk/**',      // generated from OpenAPI
      '.github/**',
      'extensions/**',       // ignore extensions for now
      '.shopify/**',         // ignore Shopify build artifacts
      'scripts/**',          // ignore build scripts
      'vite.config.ts',      // ignore vite config for now
      '**/*.js'              // ignore JS files for now (legacy)
    ]},
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        alert: 'readonly',
        console: 'readonly',
        process: 'readonly',
        // Vite globals
        __BACKEND_URL__: 'readonly',
        __SHOPIFY_API_KEY__: 'readonly',
        // Shopify globals
        shopify: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      import: importPlugin,
      'jsx-a11y': jsxA11y
    },
    rules: {
      // React
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Imports
      'import/order': ['warn', {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: ['builtin','external','internal','parent','sibling','index']
      }],
      'import/no-unresolved': 'off', // handled by TS
      // A11y (sane defaults)
      'jsx-a11y/anchor-is-valid': 'warn',
      // General
      'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
      'no-undef': 'off' // handled by TypeScript
    },
    settings: {
      react: { version: 'detect' }
    }
  }
];