# Alias-Based Monorepo Migration Report

> **Project:** ADREC Component Library  
> **Date:** February 18, 2026  
> **Current Stack:** React 19, Tailwind CSS v4, Radix UI, Vite + Module Federation  

---

## Migration status (updated)

| Area | Status |
|------|--------|
| **Tier 1** — Platform primitives (19) | ✅ Migrated (web + mobile) |
| **Tier 2** — Shared composed components (13) | ✅ Migrated (ModalTitle, ModalSteps, CardTitle, GenericCard, GenericCards, GenericTableCard, OwnerCard, PlotCard, ViewOwnerDetail, ApplicationDetail, ApplicationMessage, Table, TestComponent) |
| **Tier 3** — API-dependent (10) | ✅ Migrated (web + mobile) |
| **Shared configs** (45) | ✅ All migrated to `shared/configs/` |
| **Layout** (1 per platform) | Per-platform (not shared) |

---

## 1. Executive Summary

This report analyzes all **44 exposed components** from the ADREC Component Library and classifies them for migration into an alias-based monorepo structure where:

- **`/shared`** — Platform-agnostic business logic, configs, types, hooks, composed components (via `@platform` alias)
- **`/web`** — Web-specific UI implementations (Tailwind, Radix UI, HTML elements)
- **`/mobile`** — React Native UI implementations

The `@platform` alias resolves to `/web` or `/mobile` at build time, allowing shared components to consume the correct platform primitives automatically.

### Key Numbers

| Category | Count |
|----------|-------|
| Total exposed components | **44** |
| Web-only implementations needed | **30** |
| Mobile-only implementations needed | **30** |
| Shared components (via alias) | **13** (all migrated) |
| Shared logic modules (hooks, schemas, configs) | **44** (all configs) + extracted logic |

---

## 2. Platform-Agnostic Libraries (Shared Across Web & Mobile)

These libraries are **fully compatible** with both React (web) and React Native (mobile). All logic built on them belongs in the **shared** folder:

| Library | Usage | Platform Support |
|---------|-------|-----------------|
| **@tanstack/react-form** | Form state management, field validation, submission | React + React Native |
| **@tanstack/react-query** | API data fetching, caching, mutations | React + React Native |
| **Zod** | Schema validation, type inference | Pure JS — any platform |
| **date-fns** | Date formatting, parsing, manipulation | Pure JS — any platform |
| **axios** | HTTP requests | React + React Native |
| **TypeScript types/interfaces** | Component props, API types, configs | Any platform |

### Impact on Classification

Components previously considered platform-specific solely because of TanStack Form or Zod have their **entire logic layer** moved to shared. Only the UI rendering (HTML/Tailwind vs RN components) stays platform-specific.

---

## 3. Target Monorepo Structure

```
packages/
├── shared/
│   ├── configs/                    # All 44 .config.ts files
│   ├── types/                      # dls.types.ts, component prop interfaces
│   ├── schemas/                    # Zod validation schemas (extracted)
│   ├── hooks/                      # react-query hooks, business logic hooks
│   ├── forms/                      # TanStack Form definitions, field configs
│   │   ├── payment.form.ts         # Payment form logic + Zod schemas
│   │   ├── search-plot.form.ts     # SearchPlot form logic
│   │   └── ...
│   ├── utils/                      # transform-dls-config, validators
│   └── components/                 # Composed components using @platform alias
│       ├── OwnerCard/
│       ├── PlotCard/
│       ├── ModalTitle/
│       └── ...  (14 composed components)
│
├── web/
│   ├── primitives/                 # Base web components (Button, Input, etc.)
│   ├── components/                 # Web-only complex components
│   │   ├── Signature/              # Canvas-based
│   │   ├── FilterBar/              # Radix Popover-based
│   │   ├── UploadDocuments/        # Blob/URL API-based
│   │   └── ...
│   └── layout/                     # Web app shell (Header, Sidebar, Footer)
│
├── mobile/
│   ├── primitives/                 # RN base components (Pressable, TextInput, etc.)
│   ├── components/                 # Mobile-only complex components
│   │   ├── Signature/              # SVG-based
│   │   ├── FilterBar/              # BottomSheet-based
│   │   ├── UploadDocuments/        # DocumentPicker-based
│   │   └── ...
│   └── layout/                     # Mobile app shell (TabBar, Stack Nav, etc.)
```

---

## 4. Component Classification

### 4.1 TIER 1 — Platform Primitives (19 components)

These are atomic UI components that directly render platform-specific elements. Each needs a **separate implementation per platform**, but their **prop interfaces and configs are shared**.

#### UI Components (7)

| # | Component | Web Implementation | Mobile Implementation | Effort |
|---|-----------|-------------------|----------------------|--------|
| 1 | **Buttons** | `<button>` + Tailwind + mouse events | `<Pressable>` + StyleSheet | Medium |
| 2 | **Typography** | `<h1>`–`<h4>`, `<p>` + Tailwind | `<Text>` with style variants | Low |
| 3 | **Breadcrumb** | `<nav>` / `<ol>` / `<li>` | `<View>` + `<Text>` chain | Low |
| 4 | **Pagination** | `<nav>` + `<button>` page controls | `<Pressable>` row / list footer | Medium |
| 5 | **ScreenLoader** | `fixed inset-0` + backdrop-blur + GIF | `<Modal>` + `<ActivityIndicator>` | Low |
| 6 | **Prompt** | Dialog with yes/no buttons | `<Modal>` / `Alert.alert()` | Low |
| 7 | **AddMoreButton** | `<div>` + lucide-react icon | `<Pressable>` + lucide-react-native | Low |

#### Form Components (12)

| # | Component | Web Implementation | Mobile Implementation | Shared Logic |
|---|-----------|-------------------|----------------------|-------------|
| 8 | **TextInput** | HTML `<input>` + Label/Caption | RN `<TextInput>` + Label | Validation schema, field config |
| 9 | **TextArea** | HTML `<textarea>` | RN `<TextInput multiline>` | Validation schema, field config |
| 10 | **Select (Single)** | Radix Select / `<select>` | RN Picker / Bottom Sheet | Options config, validation |
| 11 | **MultiSelect** | Radix multi-select dropdown | Multi-select modal | Options config, validation |
| 12 | **Currency** | Styled `<input>` with formatting | RN `<TextInput>` with mask | Currency formatting logic, validation |
| 13 | **Number** | `<input type="number">` | RN `<TextInput keyboardType="numeric">` | Validation schema |
| 14 | **DateSelect** | react-day-picker + HTML date | RN DateTimePicker | Date validation, formatting (date-fns) |
| 15 | **CheckboxField** | Radix Checkbox | RN Checkbox / custom | Toggle logic |
| 16 | **CheckboxInput** | Radix Checkbox group | RN Checkbox group | Group state management |
| 17 | **RadioField** | Radix Radio | RN Radio / custom | Selection logic |
| 18 | **RadioInput** | Radix Radio group | RN Radio group | Group state management |
| 19 | **PhoneInput** | Styled `<input>` + country code | RN `<TextInput>` + country picker | Phone validation, country data |

> **Subtotal:** 19 components × 2 platforms = **38 platform-specific builds**  
> **Shared from Tier 1:** All prop interfaces, config files, Zod schemas, and field definitions → `shared/`

---

### 4.2 TIER 2 — Composed Components — Shared via Alias (13 components)

These components **compose Tier 1 primitives** and contain business logic. After refactoring to import primitives via `@platform/` alias, they live in the **shared** folder and work on **both platforms with a single codebase**.

| # | Component | Depends On (via @platform alias) | Shared Business Logic | Status |
|---|-----------|----------------------------------|----------------------|--------|
| 1 | **ModalTitle** | Typography | Bilingual title formatting | ✅ Migrated |
| 2 | **ModalSteps** | Typography | Step state management | ✅ Migrated |
| 3 | **CardTitle** | Buttons, Typography | Expand/collapse state, badge logic | ✅ Migrated |
| 4 | **GenericCard** | CardTitle, Buttons, Typography | Expand/collapse, row rendering | ✅ Migrated |
| 5 | **GenericCards** | GenericCard | Grid/list state, shared expansion | ✅ Migrated |
| 6 | **GenericTableCard** | Pagination, Typography | Row/column rendering, pagination state | ✅ Migrated |
| 7 | **OwnerCard** | GenericCard, Buttons | Owner data mapping, action handlers | ✅ Migrated |
| 8 | **PlotCard** | GenericCard, Buttons | Plot data mapping, action handlers | ✅ Migrated |
| 9 | **ViewOwnerDetail** | Typography | Owner detail display, bilingual | ✅ Migrated |
| 10 | **ApplicationDetail** | CardTitle, TextInput | Detail display, reference editing | ✅ Migrated |
| 11 | **ApplicationMessage** | Buttons, Typography | Status type switching (success/error/info) | ✅ Migrated |
| 12 | **Table** | GenericCard, Typography | Grid column/row data rendering | ✅ Migrated |
| 13 | **TestComponent** | TextInput, Buttons | Demo form logic | ✅ Migrated |

> **Subtotal:** 13 components in `shared/` — **built once, runs on both platforms** — **all migrated**

**How this works in practice:**

```typescript
// shared/components/OwnerCard/OwnerCard.tsx
import { Button } from '@platform/primitives/Button';      // resolves per platform
import { GenericCard } from '@platform/primitives/GenericCard';
import { useOwnerData } from '@shared/hooks/useOwnerData';  // shared logic

export const OwnerCard = (props) => {
  const { data, actions } = useOwnerData(props);
  return <GenericCard {...data} actions={actions} />;
};
```

---

### 4.3 TIER 3 — Browser/Native API Dependent (10 components)

These components use **platform-specific APIs** beyond just UI rendering. They need separate implementations, but their **form logic, validation schemas, and business rules** (TanStack Form + Zod + react-query) are **fully shared**.

| # | Component | Platform-Specific APIs | Shared Logic (in shared/) | Per-Platform UI |
|---|-----------|----------------------|--------------------------|-----------------|
| 1 | **Titles (TitleBar)** | `window.innerWidth`, `resize` listener | Title/acronym formatting | Web: resize listener → Mobile: `useWindowDimensions` |
| 2 | **FilterBar** | Radix Popover, HTML `<input>` | Filter state, column config, search logic | Web: Popover → Mobile: BottomSheet |
| 3 | **Signature** | Canvas API, `MutationObserver`, `getComputedStyle` | Signature data format (base64), clear/save logic | Web: react-signature-canvas → Mobile: react-native-signature-canvas |
| 4 | **UploadDocuments** | `URL.createObjectURL`, `document.createElement`, `Blob` | File validation (type, size), document type configs | Web: Blob download → Mobile: DocumentPicker + FileSystem |
| 5 | **PaymentDetails** | `URL.createObjectURL`, `Blob` download | Payment verification logic, override form (TanStack Form + Zod) | Web: Blob link → Mobile: Share/FileSystem |
| 6 | **AuditRemarks** | `window.open()` for document downloads | Audit data display logic, remarks validation | Web: window.open → Mobile: Linking.openURL / Share |
| 7 | **ViewPlotDetail** | `URL.createObjectURL` for images | Plot data hooks (react-query), bilingual display | Web: blob image → Mobile: `<Image uri>` |
| 8 | **OwnerSearch** | RadioCard (web), web form composition | Search type logic, owner type selection | Web: RadioCard → Mobile: RN RadioButton |
| 9 | **SearchPlot** | RadioCard, complex web forms | **TanStack Form logic, Zod schemas, react-query hooks, tab definitions** | Web: Radix tabs → Mobile: TabView |
| 10 | **Payment** | Multi-step HTML `<form>` elements | **TanStack Form step logic, Zod schemas, payment type definitions, all validation** | Web: HTML forms → Mobile: RN form views |

> **Subtotal:** 10 components × 2 platforms = **20 platform-specific UI builds**  
> **But:** Significant logic is shared for each (see column 4)

#### Shared Logic Extraction — Payment & SearchPlot (Biggest Wins)

These two components benefit the most from TanStack Form + Zod being cross-platform:

**Payment (shared/forms/payment.form.ts):**
```
- Zod schemas for Contract, Measurement, Insurance, Rent
- TanStack Form field definitions and step configuration
- Payment vs No-Payment branching logic
- Validation rules and error messages
- Step navigation state machine
```

**SearchPlot (shared/forms/search-plot.form.ts):**
```
- Zod schemas for plot search, company search, owner search
- TanStack Form field definitions per search type
- Tab definitions and search type enum
- API query hooks (react-query) for search endpoints
- Result mapping and transformation logic
```

---

### 4.4 Layout — Independent Per Platform (1 component)

| # | Component | Reason |
|---|-----------|--------|
| 1 | **Layout** | App shell (Header, Footer, Sidebar, Toast). Web uses CSS flexbox layout with sidebar navigation. Mobile uses fundamentally different patterns (Tab Navigator, Stack Navigator, Drawer). **Should be built independently per platform.** |

> **Subtotal:** 1 component × 2 platforms = **2 independent builds**

---

## 5. Summary Dashboard

| Category | Components | Web Builds | Mobile Builds | Shared (Alias) | Shared Logic |
|----------|-----------|------------|---------------|-----------------|-------------|
| **Tier 1** — Primitives | 19 | 19 | 19 | — | Configs + Schemas |
| **Tier 2** — Composed | 13 | —* | —* | **13** ✅ | Full component (all migrated) |
| **Tier 3** — API Dependent | 10 | 10 | 10 | — | Forms + Hooks + Schemas |
| **Layout** | 1 | 1 | 1 | — | — |
| **Totals** | **43** | **30** | **30** | **13** ✅ | See below |

*\*Tier 2 components live in `shared/` — built once, consumed on both platforms via alias.*

### Shared Logic Modules (extracted from all tiers)

| Shared Asset | Source | Count |
|-------------|--------|-------|
| Component configs (`.config.ts`) | All components | 44 files |
| TypeScript prop interfaces | All components | 44+ interfaces |
| Zod validation schemas | Form components + Payment + SearchPlot | ~20 schemas |
| TanStack Form definitions | Payment, SearchPlot, form wrappers | ~15 form configs |
| react-query hooks | Data-fetching components | ~10 hooks |
| Utility functions | transform-dls-config, validators, formatters | ~5 modules |
| Icon registry mappings | icon-registry.ts | 1 file |
| date-fns formatting | DateSelect, ApplicationDetail | shared helpers |

---

## 6. Build Effort Estimate

### Per Platform

| Effort Level | Web (refactor existing) | Mobile (build new) |
|-------------|------------------------|-------------------|
| **Low** (1–2 days each) | 10 primitives (Typography, Breadcrumb, Prompt, etc.) | 10 simple components |
| **Medium** (2–4 days each) | 12 components (Buttons, Pagination, CardTitle, etc.) | 12 medium components |
| **High** (4–7 days each) | 8 components (Signature, FilterBar, Payment UI, etc.) | 8 complex components |

### Shared Layer (one-time)

| Task | Effort |
|------|--------|
| Extract all configs to `shared/configs/` | 1–2 days |
| Extract Zod schemas to `shared/schemas/` | 2–3 days |
| Extract TanStack Form definitions to `shared/forms/` | 3–4 days |
| Extract react-query hooks to `shared/hooks/` | 2–3 days |
| Set up `@platform` alias resolution (Vite/Metro) | 1–2 days |
| Refactor Tier 2 components to use alias imports | 3–5 days |

---

## 7. Migration Priority (Recommended Order)

### Phase 1 — Foundation
1. Set up monorepo structure with `@platform` alias resolution
2. Move all `.config.ts` files and types to `shared/`
3. Extract Zod schemas and TanStack Form logic to `shared/`

### Phase 2 — Primitives
4. Build Tier 1 primitives for web (refactor from existing)
5. Build Tier 1 primitives for mobile (new implementations)
6. Ensure both platforms pass the same prop interface tests

### Phase 3 — Shared Composition
7. Refactor Tier 2 components to use `@platform` alias imports
8. Verify Tier 2 components render correctly on both platforms

### Phase 4 — Complex Components
9. Build Tier 3 components per platform with shared hooks/forms
10. Build Layout independently per platform

---

## 8. Key Recommendations

1. **TanStack Form + Zod = biggest shared win.** Payment and SearchPlot have the heaviest business logic — all of it is cross-platform. Extract form definitions and validation schemas to `shared/` immediately.

2. **Form components follow a uniform pattern.** All 12 form components use the same Label → Field → Caption structure. Build a shared `FormField` wrapper in `shared/` that accepts platform-aliased primitives. This reduces 24 implementations to 12 platform primitives + 1 shared wrapper.

3. **react-query hooks are fully shared.** Every component that fetches data (ViewPlotDetail, NewApplicationSummary, ApplicationSummary, SearchPlot) can share the exact same hooks. Only the UI layer differs.

4. **Signature is the highest-risk component.** Canvas API (web) vs SVG-based drawing (mobile) are fundamentally different. Plan for completely independent implementations with only the data format (base64 output) shared.

5. **Icon strategy: lucide-react → lucide-react-native.** Both packages share the same icon names. Create a shared icon registry that maps icon names, and let the alias resolve to the correct package per platform.

6. **Layout should NOT be shared.** Web navigation (sidebar + breadcrumbs) and mobile navigation (tab bar + stack navigator) are fundamentally different paradigms. Build independently from day one.
