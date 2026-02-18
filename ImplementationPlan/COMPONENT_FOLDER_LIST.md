# Component Folder List — Alias-Based Monorepo

> Follows the pattern from `alias_based_monorepo/`  
> Total: **45 components** across **3 packages** (`web`, `mobile`, `shared`)

## Migration status

| Component | Status |
|-----------|--------|
| **Pagination** | ✅ Migrated (web + mobile) |

---

## Alias Resolution

| Alias | Web resolves to | Mobile resolves to |
|-------|-----------------|--------------------|
| `@platform/*` | `web/src/ui/*` | `mobile/src/ui/*` |
| `@shared/*` | `shared/*` | `shared/*` |

```
// shared/components/OwnerCard.tsx
import { Button } from '@platform/Button';       // → web/src/ui/Button  OR  mobile/src/ui/Button
import { Container } from '@platform/Container'; // → web/src/ui/Container  OR  mobile/src/ui/Container
import { useOwnerData } from '@shared/hooks/useOwnerData';
```

---

## Project Structure

```
alias_based_monorepo/
├── web/
│   └── src/
│       ├── ui/              ← @platform/* resolves here on web (Tier 1 — 19 components)
│       ├── components/      ← Complex web-only components (Tier 3 — 12 components)
│       └── layout/          ← Web app shell (1 component)
│
├── mobile/
│   └── src/
│       ├── ui/              ← @platform/* resolves here on mobile (Tier 1 — 19 components)
│       ├── components/      ← Complex mobile-only components (Tier 3 — 12 components)
│       └── layout/          ← Mobile app shell (1 component)
│
└── shared/
    ├── components/          ← Shared composed components via @platform alias (Tier 2 — 13 components)
    ├── configs/             ← All 45 .config.ts files
    ├── types/               ← TypeScript interfaces
    ├── schemas/             ← Zod validation schemas
    ├── forms/               ← TanStack Form definitions
    ├── hooks/               ← react-query data hooks
    └── utils/               ← Pure utility functions
```

---

## web/src/ui/ — 19 components
> Resolved by `@platform/*` on web. HTML elements + Tailwind CSS + Radix UI.

### General UI (7)

| # | File | Source (current) | Web Implementation | Status |
|---|------|-----------------|-------------------|--------|
| 1 | `Button.tsx` | `src/stories/buttons/` | `<button>` + Tailwind + mouse events | — |
| 2 | `Typography.tsx` | `src/revamp/typography/` | `<h1>`–`<h4>`, `<p>` + Tailwind variants | — |
| 3 | `Breadcrumb.tsx` | `src/stories/breadcrumb/` | `<nav>` / `<ol>` / `<li>` | — |
| 4 | `Pagination.tsx` | `src/stories/pagination/` | `<nav>` + `<button>` page controls | ✅ Migrated |
| 5 | `ScreenLoader.tsx` | `src/stories/screenLoader/` | `fixed inset-0`, backdrop-blur, GIF | — |
| 6 | `Prompt.tsx` | `src/stories/prompt/` | Dialog with yes/no buttons | — |
| 7 | `AddMoreButton.tsx` | `src/stories/addMoreButton/` | `<div>` + lucide-react icon | — |

### Form Primitives (12)

| # | File | Source (current) | Web Implementation |
|---|------|-----------------|-------------------|
| 8 | `TextInput.tsx` | `src/stories/textInput/` | HTML `<input>` + Label + Caption |
| 9 | `TextArea.tsx` | `src/stories/TextAreaFormElemet/` | HTML `<textarea>` + Label + Caption |
| 10 | `Select.tsx` | `src/stories/DropdownSingleSelect/` | Radix Select / HTML `<select>` |
| 11 | `MultiSelect.tsx` | `src/stories/DropdownMultiSelect/` | Radix multi-select dropdown |
| 12 | `CurrencyInput.tsx` | `src/stories/CurrencyFormElement/` | Styled `<input>` with currency formatting |
| 13 | `NumberInput.tsx` | `src/stories/numberFormElemet/` | `<input type="number">` |
| 14 | `DateSelect.tsx` | `src/stories/dateSelect/` | react-day-picker + HTML date input |
| 15 | `CheckboxField.tsx` | `src/stories/checkboxField/` | Radix Checkbox (single) |
| 16 | `CheckboxInput.tsx` | `src/stories/CheckboxInput/` | Radix Checkbox group with Label/Caption |
| 17 | `RadioField.tsx` | `src/stories/RadioField/` | Radix Radio (single) |
| 18 | `RadioInput.tsx` | `src/stories/RadioInput/` | Radix Radio group with Label/Caption |
| 19 | `PhoneInput.tsx` | `src/stories/phoneField/` | Styled `<input>` + country code select |

---

## web/src/components/ — 12 components
> Complex components with browser-specific APIs. Not aliased — web only.

| # | File | Source (current) | Browser API Used |
|---|------|-----------------|-----------------|
| 1 | `TitleBar.tsx` | `src/stories/titles/` | `window.innerWidth`, `resize` listener |
| 2 | `FilterBar.tsx` | `src/stories/filterbar/` | Radix Popover, HTML `<input>` |
| 3 | `Signature.tsx` | `src/stories/signature/` | Canvas API, `MutationObserver`, `getComputedStyle` |
| 4 | `UploadDocuments.tsx` | `src/stories/uploadDocuments/` | `URL.createObjectURL`, `Blob`, `document.createElement` |
| 5 | `PaymentDetails.tsx` | `src/stories/paymentDetails/` | `URL.createObjectURL`, `Blob` download link |
| 6 | `AuditRemarks.tsx` | `src/stories/auditRemarks/` | `window.open()` for document downloads |
| 7 | `ViewPlotDetail.tsx` | `src/stories/viewPlotDetail/` | `URL.createObjectURL` for blob images |
| 8 | `OwnerSearch.tsx` | `src/stories/NewApplicationSearchOwner/` | RadioCard (web), web form composition |
| 9 | `SearchPlot.tsx` | `src/stories/searchPlot/` | Radix tabs, web form layout |
| 10 | `Payment.tsx` | `src/stories/payment/` | Multi-step HTML `<form>` elements |
| 11 | `NewApplicationSummary.tsx` | `src/revamp/newApplicationSummary/` | HTML checkbox, CSS expand/collapse |
| 12 | `ApplicationSummary.tsx` | `src/stories/applicationSummary/` | CSS Grid, HTML form elements |

---

## web/src/layout/ — 1 component
> Web app shell. Independent — not shared.

| # | File | Source (current) | Notes |
|---|------|-----------------|-------|
| 1 | `Layout.tsx` | `src/stories/layout/` | Header, Sidebar, Footer, Toast, Breadcrumbs |

---
---

## mobile/src/ui/ — 19 components
> Resolved by `@platform/*` on mobile. Same prop interface as `web/src/ui/`. React Native implementations.

### General UI (7)

| # | File | `web/src/ui/` counterpart | React Native Implementation | Status |
|---|------|--------------------------|----------------------------|--------|
| 1 | `Button.tsx` | `Button.tsx` | `<Pressable>` + StyleSheet | — |
| 2 | `Typography.tsx` | `Typography.tsx` | `<Text>` with style variants | — |
| 3 | `Breadcrumb.tsx` | `Breadcrumb.tsx` | `<View>` + `<Text>` chain | — |
| 4 | `Pagination.tsx` | `Pagination.tsx` | `<Pressable>` row / list footer | ✅ Migrated |
| 5 | `ScreenLoader.tsx` | `ScreenLoader.tsx` | `<Modal>` + `<ActivityIndicator>` | — |
| 6 | `Prompt.tsx` | `Prompt.tsx` | `<Modal>` or `Alert.alert()` | — |
| 7 | `AddMoreButton.tsx` | `AddMoreButton.tsx` | `<Pressable>` + lucide-react-native | — |

### Form Primitives (12)

| # | File | `web/src/ui/` counterpart | React Native Implementation |
|---|------|--------------------------|----------------------------|
| 8 | `TextInput.tsx` | `TextInput.tsx` | RN `<TextInput>` + Label + Caption |
| 9 | `TextArea.tsx` | `TextArea.tsx` | RN `<TextInput multiline>` |
| 10 | `Select.tsx` | `Select.tsx` | RN Picker / Bottom Sheet |
| 11 | `MultiSelect.tsx` | `MultiSelect.tsx` | Multi-select modal / Bottom Sheet |
| 12 | `CurrencyInput.tsx` | `CurrencyInput.tsx` | RN `<TextInput>` with currency mask |
| 13 | `NumberInput.tsx` | `NumberInput.tsx` | RN `<TextInput keyboardType="numeric">` |
| 14 | `DateSelect.tsx` | `DateSelect.tsx` | RN `DateTimePicker` |
| 15 | `CheckboxField.tsx` | `CheckboxField.tsx` | RN Checkbox or custom `<Pressable>` |
| 16 | `CheckboxInput.tsx` | `CheckboxInput.tsx` | RN Checkbox group |
| 17 | `RadioField.tsx` | `RadioField.tsx` | RN Radio or custom `<Pressable>` |
| 18 | `RadioInput.tsx` | `RadioInput.tsx` | RN Radio group |
| 19 | `PhoneInput.tsx` | `PhoneInput.tsx` | RN `<TextInput>` + country picker modal |

---

## mobile/src/components/ — 12 components
> Mirror of `web/src/components/` with React Native APIs. Not aliased — mobile only.

| # | File | `web/src/components/` counterpart | React Native API |
|---|------|----------------------------------|-----------------|
| 1 | `TitleBar.tsx` | `TitleBar.tsx` | `useWindowDimensions` hook |
| 2 | `FilterBar.tsx` | `FilterBar.tsx` | Bottom Sheet |
| 3 | `Signature.tsx` | `Signature.tsx` | `react-native-signature-canvas` (SVG) |
| 4 | `UploadDocuments.tsx` | `UploadDocuments.tsx` | `DocumentPicker` + `expo-file-system` |
| 5 | `PaymentDetails.tsx` | `PaymentDetails.tsx` | `Share` API + `FileSystem` |
| 6 | `AuditRemarks.tsx` | `AuditRemarks.tsx` | `Linking.openURL` / `Share` |
| 7 | `ViewPlotDetail.tsx` | `ViewPlotDetail.tsx` | RN `<Image source={{ uri }}>` |
| 8 | `OwnerSearch.tsx` | `OwnerSearch.tsx` | RN RadioButton group |
| 9 | `SearchPlot.tsx` | `SearchPlot.tsx` | `react-native-tab-view` |
| 10 | `Payment.tsx` | `Payment.tsx` | RN `<View>` step form |
| 11 | `NewApplicationSummary.tsx` | `NewApplicationSummary.tsx` | RN `<Switch>` + `<View>` collapse |
| 12 | `ApplicationSummary.tsx` | `ApplicationSummary.tsx` | RN `<SectionList>` / `<FlatList>` |

---

## mobile/src/layout/ — 1 component
> Mobile app shell. Independent — not shared.

| # | File | `web/src/layout/` counterpart | Notes |
|---|------|------------------------------|-------|
| 1 | `Layout.tsx` | `Layout.tsx` | Tab Navigator, Stack Navigator, Drawer |

---
---

## shared/components/ — 13 components
> Composed using `@platform` alias. Single file — runs on both platforms.

| # | File | Source (current) | `@platform` Imports Used |
|---|------|-----------------|--------------------------|
| 1 | `ModalTitle.tsx` | `src/stories/modalTitle/` | `@platform/Typography` |
| 2 | `ModalSteps.tsx` | `src/stories/modalSteps/` | `@platform/Typography` |
| 3 | `CardTitle.tsx` | `src/revamp/cardTitle/` | `@platform/Button`, `@platform/Typography` |
| 4 | `GenericCard.tsx` | `src/stories/genericCard/` | `@platform/CardTitle`, `@platform/Button`, `@platform/Typography` |
| 5 | `GenericCards.tsx` | `src/stories/genericCards/` | `@platform/GenericCard` |
| 6 | `GenericTableCard.tsx` | `src/stories/genericTableCard/` | `@platform/Pagination`, `@platform/Typography` |
| 7 | `OwnerCard.tsx` | `src/stories/ownerCard/` | `@platform/GenericCard`, `@platform/Button` |
| 8 | `PlotCard.tsx` | `src/stories/plotCard/` | `@platform/GenericCard`, `@platform/Button` |
| 9 | `ViewOwnerDetail.tsx` | `src/stories/viewOwnerDetail/` | `@platform/Typography` |
| 10 | `ApplicationDetail.tsx` | `src/ranch/` | `@platform/CardTitle`, `@platform/TextInput` |
| 11 | `ApplicationMessage.tsx` | `src/stories/applicationMessage/` | `@platform/Button`, `@platform/Typography` |
| 12 | `Table.tsx` | `src/stories/table/` | `@platform/GenericCard`, `@platform/Typography` |
| 13 | `TestComponent.tsx` | `src/revamp/testComponent/` | `@platform/TextInput`, `@platform/Button` |

---

## shared/configs/ — 45 files
> All `.config.ts` files. Pure data — zero platform-specific code. Move as-is.

### Service Component Configs (32)

| # | File | Source (current) |
|---|------|-----------------|
| 1 | `button.config.ts` | `src/stories/buttons/buttons.configs.ts` |
| 2 | `cardTitle.config.ts` | `src/revamp/cardTitle/cardTitle.config.ts` |
| 3 | `breadcrumb.config.ts` | `src/stories/breadcrumb/breadcrumb.config.ts` |
| 4 | `table.config.ts` | `src/stories/table/table.config.ts` |
| 5 | `pagination.config.ts` | `src/stories/pagination/pagination.config.ts` |
| 6 | `titleBar.config.ts` | `src/stories/titles/titleBar.config.ts` |
| 7 | `ownerSearch.config.ts` | `src/stories/NewApplicationSearchOwner/NewApplicationSearchOwner.config.ts` |
| 8 | `modalTitle.config.ts` | `src/stories/modalTitle/modalTitle.config.ts` |
| 9 | `modalSteps.config.ts` | `src/stories/modalSteps/modalSteps.config.ts` |
| 10 | `addMoreButton.config.ts` | `src/stories/addMoreButton/addMoreButton.config.ts` |
| 11 | `ownerCard.config.ts` | `src/stories/ownerCard/ownerCard.config.ts` |
| 12 | `filterBar.config.ts` | `src/stories/filterbar/filterbar.config.ts` |
| 13 | `plotCard.config.ts` | `src/stories/plotCard/plotCard.config.ts` |
| 14 | `searchPlot.config.ts` | `src/stories/searchPlot/searchPlot.config.ts` |
| 15 | `payment.config.ts` | `src/stories/payment/payment.config.ts` |
| 16 | `applicationDetail.config.ts` | `src/ranch/applicationDetail.config.ts` |
| 17 | `auditRemarks.config.ts` | `src/stories/auditRemarks/auditRemarks.config.ts` |
| 18 | `signature.config.ts` | `src/stories/signature/signature.config.ts` |
| 19 | `uploadDocuments.config.ts` | `src/stories/uploadDocuments/uploadDocuments.config.ts` |
| 20 | `viewOwnerDetail.config.ts` | `src/stories/viewOwnerDetail/viewOwnerDetail.config.ts` |
| 21 | `viewPlotDetail.config.ts` | `src/stories/viewPlotDetail/viewPlotDetail.config.ts` |
| 22 | `prompt.config.ts` | `src/stories/prompt/prompt.config.ts` |
| 23 | `typography.config.ts` | `src/revamp/typography/typography.config.ts` |
| 24 | `newApplicationSummary.config.ts` | `src/revamp/newApplicationSummary/newApplicationSummary.config.ts` |
| 25 | `paymentDetails.config.ts` | `src/stories/paymentDetails/paymentDetails.config.ts` |
| 26 | `testComponent.config.ts` | `src/revamp/testComponent/TestComponent.config.ts` |
| 27 | `screenLoader.config.ts` | `src/stories/screenLoader/ScreenLoader.config.ts` |
| 28 | `applicationMessage.config.ts` | `src/stories/applicationMessage/applicationMessage.config.ts` |
| 29 | `applicationSummary.config.ts` | `src/stories/applicationSummary/applicationSummary.config.ts` |
| 30 | `genericCard.config.ts` | `src/stories/genericCard/genericCard.config.ts` |
| 31 | `genericCards.config.ts` | `src/stories/genericCards/genericCards.config.ts` |
| 32 | `genericTableCard.config.ts` | `src/stories/genericTableCard/genericTableCard.config.ts` |

### Form Component Configs (12)

| # | File | Source (current) |
|---|------|-----------------|
| 33 | `textInput.config.ts` | `src/stories/textInput/textInput.configs.ts` |
| 34 | `phoneInput.config.ts` | `src/stories/phoneField/phoneField.config.ts` |
| 35 | `textArea.config.ts` | `src/stories/TextAreaFormElemet/textArea.configs.ts` |
| 36 | `select.config.ts` | `src/stories/DropdownSingleSelect/select.configs.ts` |
| 37 | `multiSelect.config.ts` | `src/stories/DropdownMultiSelect/multiSelect.configs.ts` |
| 38 | `currency.config.ts` | `src/stories/CurrencyFormElement/currency.configs.ts` |
| 39 | `number.config.ts` | `src/stories/numberFormElemet/number.configs.ts` |
| 40 | `dateSelect.config.ts` | `src/stories/dateSelect/dateSelect.configs.ts` |
| 41 | `checkboxField.config.ts` | `src/stories/checkboxField/checkboxField.configs.ts` |
| 42 | `checkboxInput.config.ts` | `src/stories/CheckboxInput/checkboxInput.configs.ts` |
| 43 | `radioField.config.ts` | `src/stories/RadioField/radioField.configs.ts` |
| 44 | `radioInput.config.ts` | `src/stories/RadioInput/radioInput.configs.ts` |

### Registry Config (1)

| # | File | Source (current) |
|---|------|-----------------|
| 45 | `icon-registry.ts` | `src/federation/icon-registry.ts` |

---

## shared/types/ — type definition files

| # | File | Source (current) | Contents |
|---|------|-----------------|----------|
| 1 | `dls.types.ts` | `src/types/dls.types.ts` | DLS control types, component config shapes |
| 2 | `component.types.ts` | Extracted from each component | All component prop interfaces |
| 3 | `api.types.ts` | Extracted from hooks | API response/request shapes |

---

## shared/schemas/ — Zod validation schemas

### Form Field Schemas (12)

| # | File | Extracted From |
|---|------|---------------|
| 1 | `textInput.schema.ts` | `TextInput` |
| 2 | `textArea.schema.ts` | `TextArea` |
| 3 | `select.schema.ts` | `Select` |
| 4 | `multiSelect.schema.ts` | `MultiSelect` |
| 5 | `currency.schema.ts` | `CurrencyInput` |
| 6 | `number.schema.ts` | `NumberInput` |
| 7 | `dateSelect.schema.ts` | `DateSelect` |
| 8 | `checkbox.schema.ts` | `CheckboxField` |
| 9 | `checkboxGroup.schema.ts` | `CheckboxInput` |
| 10 | `radio.schema.ts` | `RadioField` |
| 11 | `radioGroup.schema.ts` | `RadioInput` |
| 12 | `phone.schema.ts` | `PhoneInput` |

### Business Logic Schemas (6)

| # | File | Extracted From | Contents |
|---|------|---------------|----------|
| 13 | `payment.schema.ts` | `Payment` | Contract, Measurement, Insurance, Rent |
| 14 | `searchPlot.schema.ts` | `SearchPlot` | Plot, Company, Owner, RandomAllocation |
| 15 | `auditRemarks.schema.ts` | `AuditRemarks` | Remarks field, agent info |
| 16 | `uploadDocuments.schema.ts` | `UploadDocuments` | File type, size, required rules |
| 17 | `paymentDetails.schema.ts` | `PaymentDetails` | Override form validation |
| 18 | `signature.schema.ts` | `Signature` | Base64 output format, required rule |

---

## shared/forms/ — TanStack Form definitions

| # | File | Consumed By (both platforms) | Contents |
|---|------|------------------------------|----------|
| 1 | `payment.form.ts` | `web/src/components/Payment`, `mobile/src/components/Payment` | Step definitions, payment type branching, field configs, step navigation |
| 2 | `searchPlot.form.ts` | `web/src/components/SearchPlot`, `mobile/src/components/SearchPlot` | Tab definitions, search type enum, per-tab field configs |
| 3 | `ownerSearch.form.ts` | `web/src/components/OwnerSearch`, `mobile/src/components/OwnerSearch` | Owner type selection, conditional search fields |
| 4 | `paymentDetails.form.ts` | `web/src/components/PaymentDetails`, `mobile/src/components/PaymentDetails` | Override form field definitions |
| 5 | `auditRemarks.form.ts` | `web/src/components/AuditRemarks`, `mobile/src/components/AuditRemarks` | Remarks field config |

---

## shared/hooks/ — react-query data hooks

| # | File | Consumed By (both platforms) | Fetches |
|---|------|------------------------------|---------|
| 1 | `useSearchPlot.ts` | `SearchPlot` | Plot / company / owner search endpoints |
| 2 | `useOwnerSearch.ts` | `OwnerSearch` | Owner lookup endpoint |
| 3 | `useViewPlotDetail.ts` | `ViewPlotDetail` | Plot details + raw image data |
| 4 | `useNewApplicationSummary.ts` | `NewApplicationSummary` | Summary data (plots, owners, documents) |
| 5 | `useApplicationSummary.ts` | `ApplicationSummary` | Full application data sections |
| 6 | `usePayment.ts` | `Payment` | Payment submission, contract types |
| 7 | `usePaymentDetails.ts` | `PaymentDetails` | Payment verification, override submission |
| 8 | `useAuditRemarks.ts` | `AuditRemarks` | Audit info, document list |
| 9 | `useUploadDocuments.ts` | `UploadDocuments` | Document upload, validation, fetch |
| 10 | `useApplicationDetail.ts` | `ApplicationDetail` | Application number, date, reference |

---

## shared/utils/ — utility functions

| # | File | Source (current) | Notes |
|---|------|-----------------|-------|
| 1 | `transform-dls-config.ts` | `src/utils/transform-dls-config.ts` | Transforms configs for service-builder |
| 2 | `transform-renderer-config.ts` | `src/utils/transform-renderer-config.ts` | Transforms configs for renderer |
| 3 | `expose.components.ts` | `src/utils/expose.components.ts` | Registry of all service components |
| 4 | `expose.form-components.ts` | `src/utils/expose.form-components.ts` | Registry of all form components |
| 5 | `date-helpers.ts` | Extracted from `DateSelect`, `ApplicationDetail` | date-fns formatting helpers |
| 6 | `file-validators.ts` | Extracted from `UploadDocuments` | File type, size validation logic |
| 7 | `currency-formatter.ts` | Extracted from `CurrencyInput` | Currency masking and parsing |

---

## Grand Total

| Package | Folder | Files |
|---------|--------|-------|
| `web` | `src/ui/` | 19 |
| `web` | `src/components/` | 12 |
| `web` | `src/layout/` | 1 |
| **web subtotal** | | **32** |
| `mobile` | `src/ui/` | 19 |
| `mobile` | `src/components/` | 12 |
| `mobile` | `src/layout/` | 1 |
| **mobile subtotal** | | **32** |
| `shared` | `components/` | 13 |
| `shared` | `configs/` | 45 |
| `shared` | `types/` | 3 |
| `shared` | `schemas/` | 18 |
| `shared` | `forms/` | 5 |
| `shared` | `hooks/` | 10 |
| `shared` | `utils/` | 7 |
| **shared subtotal** | | **101** |
| | | |
| **Component implementations** | **64 total** | 19 web/ui + 19 mobile/ui + 12 web/components + 12 mobile/components + 1 web/layout + 1 mobile/layout + **13 shared** (built once) |
