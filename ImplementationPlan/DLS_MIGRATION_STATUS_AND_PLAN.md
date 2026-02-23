# DLS Migration — Status Report & Action Plan

> **Project:** ADREC_ComponentLib → alias-based-monorepo  
> **Branch:** `dls-migration-ai`  
> **Date:** February 23, 2026  
> **Scope:** Mobile + Web — migrating components from `ADREC_ComponentLib` to alias-based cross-platform structure

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [What Is Working](#2-what-is-working-)
3. [Structural Gaps](#3-structural-gaps-)
4. [Component Bug Report](#4-component-bug-report)
5. [Migration Plan](#5-migration-plan)
6. [Execution Checklist](#6-execution-checklist)

---

## 1. Architecture Overview

The alias system is the foundation of this migration. It allows a single shared component to resolve platform-specific primitives at build time.

```
alias_based_monorepo/
├── shared/
│   ├── components/     ← Tier 2: shared via @platform alias (13 planned + 3 extra)
│   ├── configs/        ← All .config.ts files (44/45 present)
│   ├── types/          ← TypeScript interfaces (complete)
│   ├── hooks/          ← react-query hooks (1/10 present)
│   ├── utils/          ← Utility functions (2/7 present)
│   ├── schemas/        ← Zod schemas (MISSING — 0/18)
│   ├── forms/          ← TanStack Form definitions (MISSING — 0/5)
│   └── __platform_types__/  ← Type stubs for @platform alias (27/38)
│
├── web/
│   ├── src/ui/         ← @platform/* on web (39 components, 19 planned)
│   └── src/components/ ← Tier 3 web-only (12 components)
│
└── mobile/
    ├── src/ui/         ← @platform/* on mobile (40 components, 19 planned)
    └── src/components/ ← Tier 3 mobile-only (12 components)
```

### Alias Resolution

| Alias | Web resolves to | Mobile resolves to |
|-------|-----------------|--------------------|
| `@platform/*` | `web/src/ui/*` | `mobile/src/ui/*` |
| `@shared/*` | `shared/*` | `shared/*` |

**Alias configs status:**
- Vite (`web/vite.config.ts`) — `@platform` and `@shared` both configured ✅
- Metro (`mobile/metro.config.js`) — `@platform` and `@shared` both configured via `extraNodeModules` ✅
- Mobile TypeScript (`mobile/tsconfig.json`) — both aliases mapped ✅
- Web TypeScript — resolved via `vite-tsconfig-paths` plugin at build time ✅

---

## 2. What Is Working ✅

### Infrastructure
- Alias resolution fully configured (Vite + Metro + tsconfig) ✅
- Module federation configured on web (6 endpoints exposed) ✅
- Mobile publishing pipeline (`@adrec/mobile-ui-base` to private registry) ✅
- NativeWind v4 configured for mobile styling ✅
- Storybook configured for web component documentation ✅

### Tier 1 — Platform Primitives
All 19 planned primitives exist in both `mobile/src/ui/` and `web/src/ui/` ✅  
Both folders contain 39–40 components (20 additional beyond the plan also migrated)

### Tier 2 — Shared Components
All 13 planned components present in `shared/components/` ✅  
All use `@platform/*` alias imports as intended ✅  
3 additional unplanned components also present: `DummyComponent`, `LargeComponent`, `PlotSearch`

### Tier 3 — Platform-Specific Complex Components
All 12 planned components present in both `mobile/src/components/` and `web/src/components/` ✅

### Shared Configs
44 of 45 planned `.config.ts` files present in `shared/configs/` ✅

### Shared Types
- `shared/types/ui/` — all 37 UI component prop interfaces defined ✅
- `shared/types/components/` — all 12 Tier 3 component types defined ✅

---

## 3. Structural Gaps ❌

### 3.1 — Missing Entire Folders

| Folder | Planned | Actual | Gap |
|--------|---------|--------|-----|
| `shared/schemas/` | 18 Zod schemas | **Folder does not exist** | 18 missing |
| `shared/forms/` | 5 TanStack Form files | **Folder does not exist** | 5 missing |

### 3.2 — Incomplete Folders

| Folder | Planned | Actual | Missing |
|--------|---------|--------|---------|
| `shared/hooks/` | 10 hooks | 1 hook | 9 hooks |
| `shared/utils/` | 7 files | 2 files | 5 files |
| `shared/configs/` | 45 files | 44 files | `icon-registry.ts` |
| `shared/__platform_types__/` | 38 stubs | 27 stubs | 11 form primitive stubs |

#### Missing `shared/hooks/` (9 of 10)
| Hook | Used By |
|------|---------|
| `useSearchPlot.ts` | SearchPlot |
| `useOwnerSearch.ts` | OwnerSearch |
| `useViewPlotDetail.ts` | ViewPlotDetail |
| `useNewApplicationSummary.ts` | NewApplicationSummary |
| `useApplicationSummary.ts` | ApplicationSummary |
| `usePayment.ts` | Payment |
| `usePaymentDetails.ts` | PaymentDetails |
| `useAuditRemarks.ts` | AuditRemarks |
| `useUploadDocuments.ts` | UploadDocuments |
| `useApplicationDetail.ts` | ApplicationDetail |

#### Missing `shared/utils/` (5 of 7)
| File | Source |
|------|--------|
| `expose.components.ts` | Currently in `mobile/src/configs/` and `web/src/federation/` (platform-split, not shared) |
| `expose.form-components.ts` | Same as above |
| `date-helpers.ts` | Extract from DateSelect, ApplicationDetail |
| `file-validators.ts` | Extract from UploadDocuments |
| `currency-formatter.ts` | Extract from CurrencyInput |

#### Missing `shared/__platform_types__/` stubs (11 form primitives)
CheckboxField, CheckboxInput, CurrencyInput, DateSelect, MultiSelect, NumberInput, PhoneInput, RadioField, RadioInput, Select, TextArea

Without these stubs, shared components that import form primitives via `@platform` will have TypeScript errors in the shared compilation context.

### 3.3 — Structural Inconsistencies

| Issue | Current State | Expected State |
|-------|--------------|----------------|
| Layout folder | Inside `mobile/src/ui/Layout/` and `web/src/ui/Layout/` — resolved via `@platform` alias | Should be in `mobile/src/layout/` and `web/src/layout/` — **not** aliased, per the plan |
| `App.tsx` imports | Uses `../ui/ComponentName` direct paths | Should use `@platform/ComponentName` to validate alias system |
| Plan count discrepancy | `COMPONENT_FOLDER_LIST.md` says 45, `MONOREPO_MIGRATION_REPORT.md` says 44 | Must be reconciled |
| Backup files | `mobile/src/ui/bk_DateInput/` and `mobile/src/ui/bk_TextInput/` exist | Should be removed after verification |

---

## 4. Component Bug Report

> Bugs discovered during live component testing. Organized by tier and severity.

### Severity Key
- 🔴 **Critical** — App crash, not rendering, fundamentally broken
- 🟠 **High** — Core functionality broken, wrong behavior
- 🟡 **Medium** — Styling/color issues, degraded UX
- 🟢 **Low** — Minor issues, deprecated props

---

### 4.1 — Tier 2: Shared Components (`shared/components/`)

| Component | Severity | Issues |
|-----------|----------|--------|
| **ApplicationDetails** | 🔴 Critical | Not rendering, crashing the app, code is irrelevant / incorrect |
| **ApplicationMessage** | 🔴 Critical | Status colors, borders, and all styling not applied; code does not match expected output |
| **GenericCard** | 🔴 Critical | Type errors, missing styles, props missing, component not rendering, buttons not showing, documents not showing |
| **GenericCards** | 🔴 Critical | Type errors, component not rendering (inherits GenericCard issues) |
| **CardTitle** | 🔴 Critical | Type error in file, styles missing, icon missing, wrong structure/UI |
| **GenericTableCard** | 🔴 Critical | Type errors, `defaultShowMore` prop to be removed, styles missing, buttons not showing, `showRowButtons` prop missing, button types missing |
| **OwnerCard** | 🟠 High | Title and buttons not showing (until owner's name), styles missing, `title` prop missing in toggle case |
| **PlotCard** | 🟠 High | Same issues as OwnerCard |
| **Table** | 🟠 High | Data type is `unknown`, additional column props/interface missing, styles missing, application cards missing, cards missing, data not rendering properly |
| **ViewOwnerDetail** | 🟠 High | Document props missing, styles missing |
| **PlotSearch** | 🟠 High | Tabs missing (by plot, by owner, by company owner), only 1 field rendering, all other fields missing, validations missing, drawer missing, full search flow missing |

---

### 4.2 — Tier 1: Platform Primitives (`mobile/src/ui/` + `web/src/ui/`)

#### Non-Rendering / Fully Broken

| Component | Severity | Issues |
|-----------|----------|--------|
| **CustomDrawer** | 🔴 Critical | Not working or rendering at all |
| **Footer** | 🔴 Critical | Not working/rendering properly; Logo and Bot not showing |
| **RadioInput** | 🔴 Critical | Only renders a label — no radio button or option group rendered |

#### Core Functionality Broken

| Component | Severity | Issues |
|-----------|----------|--------|
| **CurrencyInput** | 🟠 High | Accepting alphabets (no character filter), disabled not working (color + functionality), info text not showing on icon, required symbol color wrong |
| **NumberInput** | 🟠 High | Accepting alphabets, disabled color issue, required icon color issue, tooltip issue |
| **PhoneInput** | 🟠 High | Accepting alphabets, disabled color issue, required icon color issue, tooltip issue |
| **MultiSelect** | 🟠 High | `onChange` not working, disabled color issue, required color issue, tooltip issue |
| **RadioCard** | 🟠 High | `disabled` and `clicked` props not applying styles |
| **Header** | 🟠 High | Breadcrumb items rendering before the header, not inside it |

#### Styling / Color Issues

| Component | Severity | Issues |
|-----------|----------|--------|
| **Tooltip** | 🟡 Medium | Text color issue (root cause for all tooltip failures below) |
| **Label** | 🟡 Medium | Required icon color issue, disabled color not applying, tooltip not working |
| **CheckboxField** | 🟡 Medium | Required symbol color issue |
| **CheckboxInput** | 🟡 Medium | Required symbol color issue |
| **SelectInput** | 🟡 Medium | Width issue, required icon color issue, tooltip text issue |
| **DateSelect** | 🟡 Medium | Width issue, disabled not changing color of placeholder/value |
| **bk_DateInput** | 🟡 Medium | Full-width issue for input, disabled color not applying to input text/placeholder |
| **bk_TextInput** | 🟡 Medium | Disabled color not applying to input text, required symbol color issue, tooltip text issue, date/textarea/select/multi-select type width issues |

#### Minor / Deprecated

| Component | Severity | Issues |
|-----------|----------|--------|
| **Bot** | 🟢 Low | Bot message `onClick` position issue |
| **Prompt** | 🟢 Low | `subtiltle` prop has a typo — should be `subtitle` (deprecated prop) |
| **AddMoreButton** | 🟢 Low | Error in config file |

---

### 4.3 — Common Root Causes (Cross-Cutting Issues)

| Root Cause | Affected Components | Fix Strategy |
|------------|--------------------|----|
| **Tooltip broken** | Tooltip, Label, MultiSelect, NumberInput, PhoneInput, SelectInput, bk_TextInput | Fix `Tooltip` component first — all consumers will inherit the fix |
| **Required symbol color wrong** | CheckboxField, CheckboxInput, CurrencyInput, Label, MultiSelect, NumberInput, PhoneInput, RadioInput, SelectInput | Fix color token in `Label` / `Caption` base component — cascades to all form fields |
| **Disabled state styling missing** | bk_TextInput, bk_DateInput, CurrencyInput, DateSelect, MultiSelect, RadioCard, Label | Standardize disabled color token; ensure `disabled` prop forwards to native input element |
| **Numeric inputs accepting alphabets** | CurrencyInput, NumberInput, PhoneInput | Add `keyboardType` on mobile and input type/filter on web |
| **Width not filling container** | DateSelect, SelectInput, bk_DateInput, bk_TextInput | Ensure `w-full` / `flex: 1` propagates to inner element, not just wrapper |

---

## 5. Migration Plan

### Phase 0 — Emergency Fixes (Blocking All Testing) 🔴

Fix first. These components crash or render nothing.

#### 0.1 — Rewrite ApplicationDetails
- **Source:** `ADREC_ComponentLib/src/ranch/applicationDetail/`
- **Action:** Full rewrite using `@platform/CardTitle` and `@platform/TextInput`
- **Must render:** application number, date, reference fields with correct styles

#### 0.2 — Rewrite ApplicationMessage
- **Source:** `ADREC_ComponentLib/src/stories/applicationMessage/`
- **Action:** Full rewrite implementing all 3 status variants: success, error, info
- **Must render:** correct status color, border, icon, and message using `@platform/Button` and `@platform/Typography`

#### 0.3 — Rewrite GenericCard
- **Source:** `ADREC_ComponentLib/src/stories/genericCard/`
- **Action:** Full rewrite — this is the foundation for OwnerCard, PlotCard, Table, GenericCards
- **Must render:** header, expand/collapse, row data, action buttons, document slots
- **Fix first** — unblocks Phase 1.3, 1.4, 1.2, 0.4

#### 0.4 — Fix GenericCards
- **Depends on:** 0.3 (GenericCard)
- **Action:** Fix after GenericCard is working; inherits its issues

#### 0.5 — Fix CustomDrawer
- **Source:** `ADREC_ComponentLib/src/revamp/customDrawer/`
- **Action:** Rewrite both platforms
  - Web: Radix Dialog / Sheet
  - Mobile: `@gorhom/bottom-sheet` or equivalent
- **Unblocks:** PlotSearch (Phase 1.7)

#### 0.6 — Fix Footer
- **Action:** Fix rendering logic; verify Logo and Bot imports resolve and render correctly in both web and mobile implementations

---

### Phase 1 — Tier 2 Shared Component Rewrites 🟠

#### 1.1 — Rewrite CardTitle
- **Source:** `ADREC_ComponentLib/src/revamp/cardTitle/`
- **Must implement:** expand/collapse toggle, badge, action button, icon slot
- **Fix type errors** and restore full styling using `@platform/Button` and `@platform/Typography`

#### 1.2 — Rewrite GenericTableCard
- **Source:** `ADREC_ComponentLib/src/stories/genericTableCard/`
- **Remove:** `defaultShowMore` deprecated prop
- **Add:** `showRowButtons` prop and correct button type definitions
- **Fix** styles and button rendering using `@platform/Pagination` and `@platform/Typography`

#### 1.3 — Fix OwnerCard
- **Depends on:** GenericCard (0.3), CardTitle (1.1)
- **Action:** Add missing `title` prop to toggle variant; restore button rendering and styles

#### 1.4 — Fix PlotCard
- **Depends on:** GenericCard (0.3), CardTitle (1.1)
- **Action:** Same fixes as OwnerCard (1.3)

#### 1.5 — Rewrite Table
- **Source:** `ADREC_ComponentLib/src/stories/table/`
- **Action:** Define proper column and row TypeScript interfaces (replace `unknown`)
- **Add:** missing column props/interface in `shared/types/components/`
- **Restore:** card sub-renderers, application card slots, data rendering

#### 1.6 — Fix ViewOwnerDetail
- **Source:** `ADREC_ComponentLib/src/stories/viewOwnerDetail/`
- **Action:** Restore missing document-related props; re-apply missing styles using `@platform/Typography`

#### 1.7 — Rebuild PlotSearch
- **Source:** `ADREC_ComponentLib/src/stories/searchPlot/`
- **Depends on:** CustomDrawer (0.5), shared hooks (Phase 3.3), shared forms (Phase 3.2)
- **Must implement:**
  - 3 tabs: By Plot, By Owner, By Company Owner
  - Per-tab field sets with add/remove field support
  - Field-level Zod validation (from Phase 3.1)
  - Search drawer/modal using CustomDrawer
  - Full search → results → selection flow

---

### Phase 2 — Tier 1 Primitive Bug Fixes 🟡

Fix in this order to maximize cascading benefits.

#### 2.1 — Fix Tooltip (unblocks 7 components)
- Fix text color in `Tooltip` (both web and mobile)
- Verify content slot and positioning
- After fix: re-test Label, MultiSelect, NumberInput, PhoneInput, SelectInput, bk_TextInput

#### 2.2 — Fix Required Symbol Color (unblocks 9 components)
- Fix color token / Tailwind class in `Label` and `Caption` base components
- Cascades to: CheckboxField, CheckboxInput, CurrencyInput, MultiSelect, NumberInput, PhoneInput, RadioInput, SelectInput

#### 2.3 — Fix Disabled State Styling (unblocks 7 components)
- Standardize disabled color token across all form inputs
- Ensure `disabled` prop is forwarded to the native input element (not just the wrapper)
- For CurrencyInput: also block input via `editable={false}` (mobile) and `readOnly` + `pointer-events: none` (web)
- Affected: bk_TextInput, bk_DateInput, CurrencyInput, DateSelect, MultiSelect, RadioCard, Label

#### 2.4 — Fix Numeric Input Validation (3 components)
- **Mobile:** add `keyboardType="numeric"` or `"phone-pad"` to native `<TextInput>`
- **Web:** add `type="number"` or `onKeyDown` character filter
- PhoneInput: allow `+` and digits only
- CurrencyInput: allow digits, decimal, and currency symbol only
- Affected: CurrencyInput, NumberInput, PhoneInput

#### 2.5 — Fix Width Issues (4 components)
- Web: ensure `w-full` Tailwind class reaches the inner `<input>` / `<select>`, not just the wrapper `<div>`
- Mobile: ensure `flex: 1` or `width: '100%'` reaches the inner component
- Affected: DateSelect, SelectInput, bk_DateInput, bk_TextInput

#### 2.6 — Fix CurrencyInput Info Icon
- Wire `infoText` prop to the Tooltip component
- Note: may self-resolve after Tooltip fix (2.1) — verify first

#### 2.7 — Fix RadioCard Disabled/Clicked Styles
- Verify `disabled` and `selected`/`clicked` conditional style logic reaches the element
- Ensure conditional class is applied directly to the Pressable/button, not a wrapper

#### 2.8 — Rebuild RadioInput Structure
- **Source:** `ADREC_ComponentLib/src/stories/RadioInput/`
- Current state renders only a label — must render a full radio option group
- Use `@platform/RadioField` for each individual option

#### 2.9 — Fix Header Breadcrumb Order
- Fix render order: Breadcrumb must appear inside the header layout block, after logo/title

#### 2.10 — Fix Bot Message onClick Position
- Fix event handler binding or touch/click target area on message bubble

#### 2.11 — Fix Prompt `subtitle` Typo
- Rename `subtiltle` prop to `subtitle` (fix typo)
- Add backward-compatible alias with deprecation warning if needed
- Update `App.tsx` call to use corrected prop name

#### 2.12 — Fix AddMoreButton Config
- Identify and fix the error in the config file (`mobile/src/ui/AddMoreButton/config.ts` or `shared/configs/addMoreButton.config.ts`)

---

### Phase 3 — Build the Missing Shared Logic Layer 🔴

This is the most important structural work. Until this is done, Tier 3 components duplicate all business logic across platforms.

#### 3.1 — Create `shared/schemas/` (18 Zod schemas)

**Form field schemas (12):**

| Schema File | Component |
|------------|-----------|
| `textInput.schema.ts` | TextInput |
| `textArea.schema.ts` | TextArea |
| `select.schema.ts` | Select |
| `multiSelect.schema.ts` | MultiSelect |
| `currency.schema.ts` | CurrencyInput |
| `number.schema.ts` | NumberInput |
| `dateSelect.schema.ts` | DateSelect |
| `checkboxField.schema.ts` | CheckboxField |
| `checkboxGroup.schema.ts` | CheckboxInput |
| `radioField.schema.ts` | RadioField |
| `radioGroup.schema.ts` | RadioInput |
| `phone.schema.ts` | PhoneInput |

**Business logic schemas (6):**

| Schema File | Component | Key Rules |
|------------|-----------|-----------|
| `payment.schema.ts` | Payment | Contract, Measurement, Insurance, Rent variants |
| `searchPlot.schema.ts` | SearchPlot | Plot, Company, Owner, RandomAllocation search |
| `auditRemarks.schema.ts` | AuditRemarks | Remarks field, agent info |
| `uploadDocuments.schema.ts` | UploadDocuments | File type, size, required rules |
| `paymentDetails.schema.ts` | PaymentDetails | Override form validation |
| `signature.schema.ts` | Signature | Base64 output format, required |

#### 3.2 — Create `shared/forms/` (5 TanStack Form files)

| Form File | Component | Contents |
|-----------|-----------|---------|
| `payment.form.ts` | Payment | Step definitions, payment type branching, field configs, step navigation logic |
| `searchPlot.form.ts` | SearchPlot | Tab definitions, search type enum, per-tab field configs, react-query hooks |
| `ownerSearch.form.ts` | OwnerSearch | Owner type selection, conditional search fields |
| `paymentDetails.form.ts` | PaymentDetails | Override form field definitions |
| `auditRemarks.form.ts` | AuditRemarks | Remarks field config |

#### 3.3 — Complete `shared/hooks/` (9 missing hooks)

Build in this priority order:

| Priority | Hook | Component |
|----------|------|-----------|
| 1 | `useSearchPlot.ts` | SearchPlot |
| 2 | `useOwnerSearch.ts` | OwnerSearch |
| 3 | `useViewPlotDetail.ts` | ViewPlotDetail |
| 4 | `useApplicationSummary.ts` | ApplicationSummary |
| 5 | `useNewApplicationSummary.ts` | NewApplicationSummary |
| 6 | `usePayment.ts` | Payment |
| 7 | `usePaymentDetails.ts` | PaymentDetails |
| 8 | `useAuditRemarks.ts` | AuditRemarks |
| 9 | `useUploadDocuments.ts` | UploadDocuments |
| 10 | `useApplicationDetail.ts` | ApplicationDetail |

#### 3.4 — Complete `shared/utils/` (3 helpers)

| File | Extract From |
|------|-------------|
| `date-helpers.ts` | DateSelect, ApplicationDetail in ADREC_ComponentLib |
| `file-validators.ts` | UploadDocuments in ADREC_ComponentLib |
| `currency-formatter.ts` | CurrencyInput in ADREC_ComponentLib |

---

### Phase 4 — Wire Tier 3 Components to Shared Logic

After Phase 3 is complete, update both `mobile/src/components/` and `web/src/components/` to consume shared logic:

- Replace inline `useQuery` calls → `@shared/hooks/`
- Replace inline TanStack Form setup → `@shared/forms/`
- Replace inline Zod schemas → `@shared/schemas/`

**Order:**

| Priority | Component | Shared Assets Needed |
|----------|-----------|---------------------|
| 1 | Payment | `usePayment`, `payment.form.ts`, `payment.schema.ts` |
| 2 | SearchPlot | `useSearchPlot`, `searchPlot.form.ts`, `searchPlot.schema.ts` |
| 3 | PaymentDetails | `usePaymentDetails`, `paymentDetails.form.ts`, `paymentDetails.schema.ts` |
| 4 | AuditRemarks | `useAuditRemarks`, `auditRemarks.form.ts`, `auditRemarks.schema.ts` |
| 5 | OwnerSearch | `useOwnerSearch`, `ownerSearch.form.ts` |
| 6 | UploadDocuments | `useUploadDocuments`, `uploadDocuments.schema.ts`, `file-validators.ts` |
| 7 | ViewPlotDetail | `useViewPlotDetail` |
| 8 | Signature | `signature.schema.ts` |
| 9 | FilterBar | (filter state logic) |
| 10 | TitleBar | (no shared logic needed) |

---

### Phase 5 — Structural Fixes & Cleanup

#### 5.1 — Add 11 missing `__platform_types__` stubs
Create `.d.ts` stubs in `shared/__platform_types__/` for all form primitive components:
- CheckboxField, CheckboxInput, CurrencyInput, DateSelect, MultiSelect
- NumberInput, PhoneInput, RadioField, RadioInput, Select, TextArea

Each stub re-exports the type from `shared/types/ui/`.

#### 5.2 — Fix Layout folder placement
- Move `mobile/src/ui/Layout/` → `mobile/src/layout/`
- Move `web/src/ui/Layout/` → `web/src/layout/`
- Update all imports
- Remove from `@platform` alias resolution — Layout is intentionally not shared

#### 5.3 — Add `icon-registry.ts` to `shared/configs/`
Consolidate from `mobile/src/configs/icon-registry.ts` and `web/src/federation/icon-registry.ts` if content is shared

#### 5.4 — Update `App.tsx` to use `@platform` aliases
Replace all `../ui/ComponentName` → `@platform/ComponentName`  
Expand test coverage from 6 to all 19 planned Tier 1 primitives

#### 5.5 — Remove backup files
Delete `mobile/src/ui/bk_DateInput/` and `mobile/src/ui/bk_TextInput/` after verifying the real implementations are stable

#### 5.6 — Evaluate DummyComponent and LargeComponent
Document as official test fixtures or remove from `shared/components/`

---

### Phase 6 — Documentation Update

- Fix count discrepancy: `COMPONENT_FOLDER_LIST.md` (45) vs `MONOREPO_MIGRATION_REPORT.md` (44)
- Update migration status table — remove ✅ from schemas, forms, and hooks (not yet migrated)
- Document the 20 bonus components in `mobile/src/ui/` and `web/src/ui/` beyond the planned 19
- Add PlotSearch as an official Tier 2 component in `COMPONENT_FOLDER_LIST.md`

---

## 6. Execution Checklist

### 6.0 — Done vs Pending Summary

| Phase | Done | Pending |
|-------|------|---------|
| **Phase 0** — Emergency Fixes | **6/6** ✅ (0.1–0.6) | — |
| **Phase 1** — Tier 2 Rewrites | — | 7 (1.1–1.7) |
| **Phase 2** — Tier 1 Bug Fixes | — | 12 (2.1–2.12) |
| **Phase 3** — Shared Logic Layer | **22/22** ✅ (schemas, forms, hooks, utils) | — |
| **Phase 4** — Wire Tier 3 | **3** (Payment, SearchPlot, ViewPlotDetail) | 7 (PaymentDetails, AuditRemarks, OwnerSearch, UploadDocuments, Signature, FilterBar, TitleBar) |
| **Phase 5** — Structural Cleanup | **1** (5.1 stubs) | 5 (5.2–5.6) |
| **Phase 6** — Documentation | — | 4 |

**Done (completed in this migration):**
- Phase 0: ApplicationDetail, ApplicationMessage, GenericCard, GenericCards, CustomDrawer, Footer
- Phase 3: `shared/schemas/` (6 form-level), `shared/forms/` (5), `shared/hooks/` (10 hooks), `shared/utils/` (3)
- Phase 4: Payment & SearchPlot & ViewPlotDetail wired to shared (mobile + web)
- Phase 5.1: 11 `__platform_types__` stubs for form primitives

**Pending (next steps):**
- Phase 1: CardTitle, GenericTableCard, OwnerCard, PlotCard, Table, ViewOwnerDetail, PlotSearch
- Phase 2: Tooltip, Label/Caption colors, disabled styling, numeric inputs, width issues, RadioInput, Header, Bot, Prompt, AddMoreButton
- Phase 4: PaymentDetails, AuditRemarks, OwnerSearch, UploadDocuments, Signature, FilterBar, TitleBar
- Phase 5.2–5.6: Layout move, icon-registry, App.tsx aliases, remove backups, DummyComponent/LargeComponent
- Phase 6: Documentation updates

---

### Phase 0 — Emergency Fixes
- [x] 0.1 Rewrite ApplicationDetails (shared/components/ApplicationDetail — CardTitle, Typography, TextInput, Buttons; onReferenceNumberChange)
- [x] 0.2 Rewrite ApplicationMessage (status variants: success, error, information, action; Typography + Buttons; optional icon; className for status styling)
- [x] 0.3 Rewrite GenericCard (header, expand/collapse, row data, show more, action buttons, document slots, footer buttons)
- [x] 0.4 Fix GenericCards (after 0.3) — pass cardTitleValue, isExpandable, showBorder, showButtons, buttons, defaultShowMore
- [x] 0.5 Fix CustomDrawer (mobile + web) — web: drop unsupported `dismissible` prop for vaul; mobile: add showCloseButton, BottomSheetModalProvider in App
- [x] 0.6 Fix Footer (mobile + web) — web: semantic footer, hidden/sm:flex for Logo/Bot, accessible toggle; mobile: layout and a11y

### Phase 1 — Tier 2 Structural Rewrites
- [ ] 1.1 Rewrite CardTitle
- [ ] 1.2 Rewrite GenericTableCard
- [ ] 1.3 Fix OwnerCard (after 0.3 + 1.1)
- [ ] 1.4 Fix PlotCard (after 0.3 + 1.1)
- [ ] 1.5 Rewrite Table
- [ ] 1.6 Fix ViewOwnerDetail
- [ ] 1.7 Rebuild PlotSearch (after Phase 3 + 0.5)

### Phase 2 — Tier 1 Primitive Bug Fixes
- [ ] 2.1 Fix Tooltip → verify in all consumers
- [ ] 2.2 Fix required symbol color (Label/Caption → cascade)
- [ ] 2.3 Fix disabled state styling
- [ ] 2.4 Fix numeric-only input filtering (CurrencyInput, NumberInput, PhoneInput)
- [ ] 2.5 Fix width issues (DateSelect, SelectInput, bk_DateInput, bk_TextInput)
- [ ] 2.6 Fix CurrencyInput info icon (verify after 2.1)
- [ ] 2.7 Fix RadioCard disabled/clicked styles
- [ ] 2.8 Rebuild RadioInput structure
- [ ] 2.9 Fix Header breadcrumb order
- [ ] 2.10 Fix Bot onClick position
- [ ] 2.11 Fix Prompt subtitle typo/prop rename
- [ ] 2.12 Fix AddMoreButton config error

### Phase 3 — Shared Logic Layer
- [x] 3.1 Create `shared/schemas/` — 6 form-level business schemas (payment, searchPlot, auditRemarks, uploadDocuments, paymentDetails, signature)
- [x] 3.2 Create `shared/forms/payment.form.ts`
- [x] 3.2 Create `shared/forms/searchPlot.form.ts`
- [x] 3.2 Create `shared/forms/ownerSearch.form.ts`
- [x] 3.2 Create `shared/forms/paymentDetails.form.ts`
- [x] 3.2 Create `shared/forms/auditRemarks.form.ts`
- [x] 3.3 Create `shared/hooks/useSearchPlot.ts`
- [x] 3.3 Create `shared/hooks/useOwnerSearch.ts`
- [x] 3.3 Create `shared/hooks/useViewPlotDetail.ts`
- [x] 3.3 Create `shared/hooks/useApplicationSummary.ts`
- [x] 3.3 Create `shared/hooks/useNewApplicationSummary.ts`
- [x] 3.3 Create `shared/hooks/usePayment.ts`
- [x] 3.3 Create `shared/hooks/usePaymentDetails.ts`
- [x] 3.3 Create `shared/hooks/useAuditRemarks.ts`
- [x] 3.3 Create `shared/hooks/useUploadDocuments.ts`
- [x] 3.3 Create `shared/hooks/useApplicationDetail.ts`
- [x] 3.4 Create `shared/utils/date-helpers.ts`
- [x] 3.4 Create `shared/utils/file-validators.ts`
- [x] 3.4 Create `shared/utils/currency-formatter.ts`

### Phase 4 — Wire Tier 3 to Shared Logic
- [x] Wire Payment (web + mobile) — usePayment, getPaymentDefaultValues, PAYMENT_STEP_COUNT
- [x] Wire SearchPlot (web + mobile) — getSearchPlotDefaultValues, getSearchPlotValidator, SearchPlotTabKey
- [x] Wire ViewPlotDetail (web + mobile) — useViewPlotDetail
- [ ] Wire PaymentDetails (web + mobile)
- [ ] Wire AuditRemarks (web + mobile)
- [ ] Wire OwnerSearch (web + mobile)
- [ ] Wire UploadDocuments (web + mobile)
- [ ] Wire Signature (web + mobile)
- [ ] Wire FilterBar (web + mobile)
- [ ] Wire TitleBar (web + mobile)

### Phase 5 — Structural Cleanup
- [x] 5.1 Add 11 missing `__platform_types__` stubs (form primitives)
- [ ] 5.2 Move Layout to `*/src/layout/` (out of ui/)
- [ ] 5.3 Add `icon-registry.ts` to `shared/configs/`
- [ ] 5.4 Update `App.tsx` to use `@platform` aliases + expand to 19 primitives
- [ ] 5.5 Remove `bk_DateInput` and `bk_TextInput` backup folders
- [ ] 5.6 Document or remove DummyComponent + LargeComponent

### Phase 6 — Documentation
- [ ] Fix component count discrepancy (44 vs 45)
- [ ] Update migration status table (schemas/forms/hooks are NOT done)
- [ ] Document 20 bonus components in ui/ folders
- [ ] Add PlotSearch to official Tier 2 component list

---

## Summary

| Phase | Work Items | Status | Estimated Effort |
|-------|-----------|--------|------------------|
| Phase 0 — Emergency fixes | 6 items (4 rewrites) | **Done** ✅ | High |
| Phase 1 — Tier 2 rewrites | 7 items (5 rewrites) | Pending | High |
| Phase 2 — Tier 1 bug fixes | 12 items | Pending | Medium |
| Phase 3 — Shared logic layer | 22 files (schemas, forms, hooks, utils) | **Done** ✅ | High |
| Phase 4 — Wire Tier 3 | 10 components × 2 platforms | 3 done, 7 pending | Medium |
| Phase 5 — Structural cleanup | 6 items | 1 done (5.1), 5 pending | Low |
| Phase 6 — Documentation | 4 items | Pending | Low |

> **Done so far:** Phase 0 (6/6), Phase 3 (22/22), Phase 4 (3/10), Phase 5.1 (1/6).  
> **Pending:** Phase 1 (7), Phase 2 (12), Phase 4 (7), Phase 5.2–5.6 (5), Phase 6 (4).  
> Execute remaining work in phase order; Phase 1 (Tier 2 rewrites) is the next priority.
