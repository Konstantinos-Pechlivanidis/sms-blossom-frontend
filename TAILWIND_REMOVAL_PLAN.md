# Tailwind Removal Plan

**Date**: 2025-01-10  
**Status**: 📋 **PLANNING**  
**Framework**: Vite + React + Polaris

## Packages to Uninstall

### Tailwind Core Packages
- `tailwindcss@4.1.14`
- `@tailwindcss/vite@4.1.14` 
- `@tailwindcss/postcss@4.1.14`
- `tailwindcss-animate@1.0.7`
- `tailwind-merge@3.3.1`

### Conditional Removal
- `clsx@2.1.1` - **KEEP** (used for conditional classes, not Tailwind-specific)

## Files to Patch/Remove

### Configuration Files (Remove)
- `tailwind.config.ts` → Move to `.trash/`
- `postcss.config.js` → **KEEP** (contains autoprefixer)

### CSS Files (Patch)
- `src/styles/globals.css` → Remove Tailwind imports, keep Polaris-only styles

### Vite Config (Patch)
- `vite.config.ts` → Remove `@tailwindcss/vite` plugin and import

## Files with Tailwind Classes (8 files)

| File | Tailwind Classes Found | Refactor Strategy |
|------|----------------------|-------------------|
| `src/ui/pages/Settings.tsx` | `ios-hero p-6 mb-6` | Replace with Polaris `<Box>` |
| `src/ui/pages/Reports.tsx` | `ios-hero p-6 mb-6` | Replace with Polaris `<Box>` |
| `src/ui/pages/Contacts.tsx` | `ios-hero p-6 mb-6` | Replace with Polaris `<Box>` |
| `src/features/automations/AutomationsPage.tsx` | `ios-hero p-6 mb-6` | Replace with Polaris `<Box>` |
| `src/ui/pages/Discounts.tsx` | `ios-hero p-6 mb-6` | Replace with Polaris `<Box>` |
| `src/ui/pages/Templates.tsx` | `p-4`, `text-center` | Replace with Polaris `<Box>` |
| `src/ui/pages/Campaigns.tsx` | `ios-hero p-6 mb-6` | Replace with Polaris `<Box>` |
| `src/ui/pages/Dashboard.tsx` | `ios-hero p-6 mb-6` | Replace with Polaris `<Box>` |

## High-Confidence Refactors

### 1. iOS Hero Sections
**Pattern**: `<div className="ios-hero p-6 mb-6">`
**Refactor**: Replace with Polaris `<Box padding="600" marginBlockEnd="600">`
**Files**: 8 files (all page components)

### 2. Simple Padding Wrappers
**Pattern**: `<div className="p-4">`
**Refactor**: Replace with Polaris `<Box padding="400">`
**Files**: `src/ui/pages/Templates.tsx`

### 3. Text Alignment
**Pattern**: `className="text-center"`
**Refactor**: Use Polaris `<Text alignment="center">` or `<Box textAlign="center">`

## Low-Confidence Areas (TODOs)

### Custom iOS Utilities
- `.ios-hero`, `.ios-glass`, `.ios-focus` classes in `src/styles/globals.css`
- These were custom utilities we added - need to remove after refactoring

### Icon Sizing
- No inline SVG elements found with Tailwind sizing
- Polaris `<Icon>` components should handle sizing automatically

## Polaris Components to Use

### Layout & Spacing
- `<Box>` for padding/margin wrappers
- `<Layout>` and `<Layout.Section>` for page structure
- `<BlockStack>` and `<InlineStack>` for flex layouts

### Typography
- `<Text>` with proper variants and alignment
- `<Heading>` for page titles

### Cards & Containers
- `<Card>` for content containers
- `<Page>` for page structure with actions

## Safety Measures

### Backup Strategy
- Move removed files to `.trash/<timestamp>/`
- Keep PostCSS config (contains autoprefixer)
- Preserve Polaris CSS import order

### Build Validation
- Ensure Polaris stylesheet is imported before globals
- Verify `<AppProvider>` wrapper is intact
- Test build after each step

## Expected Outcome

### After Removal
- ✅ No Tailwind packages in `package.json`
- ✅ No Tailwind imports in CSS
- ✅ No Tailwind plugins in Vite config
- ✅ All styling via Polaris components
- ✅ App builds and runs successfully

### Performance Benefits
- Reduced bundle size (remove Tailwind CSS)
- Faster build times (no Tailwind processing)
- Simplified styling (Polaris-only)
- Better accessibility (Polaris compliance)

## Implementation Order

1. **Unwire Tailwind** (non-destructive)
2. **Uninstall Packages** (dry-run → apply)
3. **Refactor Components** (high-confidence only)
4. **Remove Files** (move to .trash)
5. **Verify Build** (ensure Polaris-only)

## Risk Assessment

### Low Risk
- Removing Tailwind packages (can reinstall)
- Moving config files to .trash (reversible)
- Refactoring simple padding wrappers

### Medium Risk
- Refactoring iOS hero sections (visual changes)
- Removing custom utilities (may break styling)

### Mitigation
- Test build after each step
- Keep backups in .trash
- Focus on high-confidence refactors first
