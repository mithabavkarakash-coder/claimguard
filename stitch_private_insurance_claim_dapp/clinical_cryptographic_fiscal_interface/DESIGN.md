---
name: Clinical Cryptographic Fiscal Interface
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434654'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#1053d7'
  primary: '#003ca7'
  on-primary: '#ffffff'
  primary-container: '#0d52d6'
  on-primary-container: '#cbd5ff'
  inverse-primary: '#b4c5ff'
  secondary: '#3755c3'
  on-secondary: '#ffffff'
  secondary-container: '#708cfd'
  on-secondary-container: '#00217a'
  tertiary: '#004293'
  on-tertiary: '#ffffff'
  tertiary-container: '#0059c0'
  on-tertiary-container: '#c6d6ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#003da9'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c4ff'
  on-secondary-fixed: '#001453'
  on-secondary-fixed-variant: '#173bab'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-numeric:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 1rem
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
---

## Brand & Style

This design system is engineered for the intersection of clinical administration, patient billing transparency, and cryptographically verified financial settlements. The visual identity projects surgical precision, absolute institutional reliability, and immediate cognitive clarity. The target audience comprises hospital financial officers, claims analysts, clinical administrators, and patients navigating complex healthcare payments. 

The aesthetic is Modern Corporate tempered by Swiss-style functionalism. It rejects decorative trend-chasing in favor of structural integrity: dense data tables, unmistakable status indicators, high-contrast numerical typography, and discrete spatial planes. The emotional response is one of clinical calm, systemic accuracy, and cryptographic immutability—reassuring both patients facing billing anxiety and enterprises managing millions in fiduciary transfers.

## Colors

The palette operates under a high-utility light mode default to accommodate standard healthcare viewing environments, clinical daylight monitors, and audit workflows.

- **Primary (`#0D52D6`)**: Clinical Royal Blue. Applied to primary interactive anchors, confirmed validation states, critical transaction actions, and active cryptographic signatures.
- **Secondary (`#1E40AF`)**: Deep Navy. Serves as the structural anchor for deep navigation, active column headers, high-level fiscal summaries, and authoritative typography.
- **Tertiary (`#3B82F6`)**: Bright Slate Blue. Used for secondary active elements, hover accents, subtle focus rings, informational chips, and active progress paths.
- **Neutral Base (`#0F172A`)**: Slate 900. The foundational ink color for maximum typographic contrast, ensuring compliance with strict clinical legibility standards.

### Canvas & Surface Layers
- **Canvas Base**: `#F8FAFC` (Slate 50) creates a soft, non-glare foundation that isolates high-density data.
- **Surface Elevation 1 (Cards, Tables)**: `#FFFFFF` (Pure White) creates crisp spatial separation against the slate canvas.
- **Surface Elevation 2 (Nested Panels, Code Inserts)**: `#F1F5F9` (Slate 100) provides tactile inset depth for hashes, metadata, and formula blocks.
- **Borders & Dividers**: `#E2E8F0` (Slate 200) strictly delineates structural bounds with subtle, razor-thin lines.

### Functional States
- **Cryptographic Success/Settled**: `#059669` (Emerald 600) with `#ECFDF5` (Emerald 50) wash.
- **Audit Flag/Pending Approval**: `#D97706` (Amber 600) with `#FFFBEB` (Amber 50) wash.
- **Rejection/Disputed Claim**: `#DC2626` (Red 600) with `#FEF2F2` (Red 50) wash.
- **Cryptographic Hash/Verification State**: `#4F46E5` (Indigo 600) for immutable block markers.

## Typography

The typographic hierarchy is split into two specialized roles:
1. **Primary Structural Engine (`Inter`)**: Utilized across all interface hierarchies from headline numbers to small body text. Inter's optical clarity and tall x-height allow micro-scale legibility within dense tables. All tabular financial data and currencies must use the font-feature-setting `tnum` (tabular numbers) and `cv05` to guarantee monotonic alignment and unambiguous digit rendering.
2. **Verification & Monospace Engine (`JetBrains Mono`)**: Mandated for ledger entries, cryptographic hashes (SHA-256/Ethereum-style receipts), ICD-10 medical billing codes, procedure codes (CPT), and national provider identifiers (NPI).

Headlines are set with tight letter-spacing to command authority and eliminate sprawling text wrapping. Micro-labels (`label-caps`) use positive letter spacing and bold weighting for category headers in ledger panels.

## Layout & Spacing

The layout is built upon an uncompromising 8pt structural rhythm, with a 4pt sub-rhythm allocated exclusively for compact table cells, badges, and inline status markers.

### Layout Philosophy & Grid System
- **Desktop (>= 1280px)**: 12-column responsive fluid grid with 32px (`2rem`) gutters, max-width bounded at 1600px to maintain glanceable visibility during financial reconciliation. Collapsible sidebar navigation occupies a fixed 280px width, dynamically shifting table content.
- **Tablet (768px - 1279px)**: 8-column grid with 24px (`1.5rem`) gutters. Complex multi-row ledger rows collapse into structured 2-tier stacked metric cards.
- **Mobile (<= 767px)**: 4-column grid with 16px (`1rem`) gutters. Horizontal scroll is explicitly preserved for tabular cryptographic proof tables with sticky column-locking on the patient/identifier axis.

### Spacing Density
Spacing between data modules adheres to strict containment: dense data blocks use `space-sm` (8px) interior row padding, standard card interior padding uses `space-lg` (24px), and inter-card structural boundaries use `space-xl` (32px).

## Elevation & Depth

This system avoids heavy drop shadows and dramatic skeuomorphic lifts. Instead, depth is achieved through an architectural stack of clean, low-contrast borders combined with diffused, navy-tinted ambient shadows.

### Elevation Planes
- **Ground (0)**: `#F8FAFC`. Base canvas floor. Zero shadow, flat.
- **Layer 1 (Card/Table Surface)**: `#FFFFFF`. Flat surface bounded by a 1px solid `#E2E8F0` border, grounded by an ultra-diffused navy shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Layer 2 (Interactive Elements & Dropdowns)**: `#FFFFFF`. Enhanced contrast with border `#CBD5E1` and a soft ambient lift: `0 4px 6px -1px rgba(13, 82, 214, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Layer 3 (Modals, Cryptographic Verification Drawers)**: `#FFFFFF`. Distinct focus depth: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)` over a backdrop blur overlay (`rgba(15, 23, 42, 0.4)` with `backdrop-filter: blur(4px)`).

Inset wells (`#F1F5F9`) use a zero-shadow treatment bounded by an inner line to display immutable cryptographic hashes and immutable claim receipts.

## Shapes

The interface balances soft humanization with institutional precision using medium-to-high curvature:

- **Primary Cards & Modals**: `rounded-2xl` (16px / 1rem to 1.5rem) to soften large surface masses and distinguish clinical tooling from legacy rigid enterprise spreadsheets.
- **Nested Insets & Sub-panels**: `rounded-xl` (12px / 0.75rem) to preserve concentric border radii within parent cards.
- **Inputs, Buttons, and Select Menus**: `rounded-lg` (8px / 0.5rem) providing a solid, stable click target.
- **Pills & Status Badges**: Fully rounded (`9999px`) for quick-scan ocular recognition across ledger states.

## Components

### Buttons
- **Primary**: Solid `#0D52D6` background, `#FFFFFF` text, `rounded-lg` (8px), padding `10px 18px`. Hover shifts to `#1E40AF`. Focused state introduces a `2px` offset outline of `#3B82F6`.
- **Secondary / Ghost**: Pure `#FFFFFF` background, `1px` border of `#E2E8F0`, text `#0F172A`. Hover transitions background to `#F8FAFC` and border to `#CBD5E1`.
- **Verification Trigger**: Background `#1E40AF`, text `#FFFFFF`, left-aligned lock or cryptographic icon. Triggers synchronous progress state with subtle ambient pulse.

### Cards & Ledger Containers
- **Standard Card**: `#FFFFFF` background, `rounded-2xl` (16px), `1px` solid `#E2E8F0`, interior padding `24px`.
- **Cryptographic Hash Well**: Inset within standard card. `#F1F5F9` background, `rounded-xl` (12px), `1px` solid `#E2E8F0`, font `JetBrains Mono` at `0.8125rem`, with an inline copy-to-clipboard trigger.

### Input Fields
- **Default Field**: Height `40px`, background `#FFFFFF`, border `1px` solid `#E2E8F0`, `rounded-lg` (8px), text `Inter` `0.9375rem`.
- **Focus State**: Border color swaps directly to `#0D52D6` with a `3px` soft glow ring in `rgba(59, 130, 246, 0.15)`.
- **Currency/Amount Inset**: Displays fixed prefix (e.g., `USD $`) in bold `#64748B` with tabular figure enforcement.

### Chips & Badges
- **Settled / Verified**: Background `#ECFDF5`, text `#059669`, border `1px` solid `rgba(5, 150, 105, 0.2)`. Fully rounded pill (`9999px`).
- **Claim Pending**: Background `#FFFBEB`, text `#D97706`, border `1px` solid `rgba(217, 119, 6, 0.2)`.
- **Cryptographic Receipt Chip**: Background `#EFF6FF`, text `#1E40AF`, monospace format displaying first and last four characters (`0x7F...2B19`), border `1px` solid `rgba(30, 64, 175, 0.2)`.

### Lists & Data Tables
- Header row fixed in `#F8FAFC` with subtle uppercase micro-labels (`label-caps`) in `#64748B`.
- Row height fixed to `52px` with a `1px` bottom border of `#F1F5F9`. Hover row trigger changes background to `#F8FAFC`.
- Financial amount columns align right with strict `tnum` numeric styling.

### Specialized Component: Ledger Verification Stepper
- A high-density audit bar tracking claims from **Adjudication -> Verification -> Settlement -> On-Chain Attestation**.
- Connected via a solid `2px` path (`#E2E8F0` for pending, `#0D52D6` for confirmed), accompanied by micro status labels and block-height timestamps.