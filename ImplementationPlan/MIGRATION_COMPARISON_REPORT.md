# Migration Comparison Report
**Date:** 2026-02-23  
**Source:** `ADREC_ComponentLib` → `alias_based_monorepo`  
**Scope:** All migrated components compared prop-by-prop, functionality-by-functionality against the source library.

---

## Overall Status Summary

| Component | Location | Prop Parity | Functional Parity | Style Parity | Severity |
|---|---|---|---|---|---|
| `Payment` | `mobile/web/components` | ❌ Missing | ❌ Missing | ❌ Missing | 🔴 Critical |
| `SearchPlot` | `mobile/web/components` | ❌ Missing | ❌ Missing | ❌ Missing | 🔴 Critical |
| `ViewPlotDetail` | `mobile/web/components` | ❌ Missing | ❌ Missing | ❌ Missing | 🔴 Critical |
| `ApplicationDetail` | `shared/components` | ❌ Missing | ❌ Missing | ❌ Missing | 🔴 Critical |
| `ApplicationMessage` | `shared/components` | ❌ Missing | ❌ Missing | ❌ Missing | 🔴 Critical |
| `GenericCard` | `shared/components` | ⚠️ Simplified | ⚠️ Simplified | ⚠️ Simplified | 🟠 Major |
| `GenericCards` | `shared/components` | ⚠️ Simplified | ⚠️ Simplified | ⚠️ Simplified | 🟠 Major |
| `CustomDrawer` (Web) | `web/ui` | ✅ Identical | ⚠️ Bug | ✅ Identical | 🟡 Minor |
| `CustomDrawer` (Mobile) | `mobile/ui` | ✅ Identical | ✅ Different platform | N/A | ✅ OK |
| `Footer` (Web) | `web/ui` | ⚠️ botStatus unused | ⚠️ Minor diffs | ⚠️ Diffs | 🟡 Minor |
| `Footer` (Mobile) | `mobile/ui` | ⚠️ botStatus unused | ✅ Different platform | N/A | 🟡 Minor |

---

## 1. Payment Component

### Source (`src/stories/payment/payment.tsx`)
The source is a full **multi-step form** with Payment / No Payment branching, 4 step sub-forms, navigation buttons, and payload construction.

### Migrated (`mobile/src/components/Payment/Payment.tsx` + `web/src/components/Payment/Payment.tsx`)
The migrated versions are **shell placeholders** — they render step buttons (1–4) and Save/Submit buttons but contain no actual form content.

---

#### Props Comparison

| Prop | Source Type | Migrated Type | Status |
|---|---|---|---|
| `applicationId` | `string?` | `string?` | ✅ Match |
| `stepInfo` | `StepInfo` (rich, with `TenancyContractInfo`) | `PaymentStepInfo` (simplified) | ⚠️ Simplified |
| `isStepInfoPending` | `boolean?` | `boolean?` | ✅ Match |
| `isPaymentSubmitting` | `boolean?` | `boolean?` | ✅ Match |
| `onPaymentSubmit` | `(val: { payload: PaymentSubmitPayload; meta: { applicationId?, values: CombinedForm, paymentType } }) => void` | Same (web only) / **Missing on mobile** | ❌ Mobile missing |
| `onSubmit` | `(data: CombinedForm) => void` | `(eventData: unknown) => void` | ❌ Type mismatch |
| `onSaveDraft` | `() => void` (no args) | `(eventData: unknown) => void` | ❌ Signature mismatch |
| `onSuccess` | Not in source | `(eventData: unknown) => void` | ⚠️ Added in migrated (not source) |
| `paymentIcon` | `ReactNode` (default: `<PaymentIcon/>`) | **Missing** | ❌ Missing |
| `noPaymentIcon` | `ReactNode` (default: `<NoPaymentIcon/>`) | **Missing** | ❌ Missing |
| `stepTitles` | `string[]?` | **Missing** | ❌ Missing |
| `stepTitles_ar` | `string[]?` | **Missing** | ❌ Missing |
| `language` | `"en" \| "ar"` | `"en" \| "ar"` | ✅ Match |

**Source `StepInfo.result.tenancyContract` missing fields in migrated:**  
`requestLandClassificationId`, `plotId`, `tenancyContractId`, `contractDuration`, `type`, `unitTypeValue` — all required to build `PaymentSubmitPayload`.

#### Functional Gaps

| Feature | Source | Mobile | Web |
|---|---|---|---|
| Payment / No Payment RadioCard toggle | ✅ | ❌ | ❌ |
| Step 0 – Contract form | ✅ (full form fields) | ❌ (empty) | ❌ (empty) |
| Step 1 – Measurement form | ✅ (rent fee calc API) | ❌ (empty) | ❌ (empty) |
| Step 2 – Insurance form | ✅ | ❌ (empty) | ❌ (empty) |
| Step 3 – Rent form | ✅ | ❌ (empty) | ❌ (empty) |
| No Payment flow with remarks textarea | ✅ | ❌ | ❌ |
| Back button (disabled on step 0) | ✅ | ❌ | ❌ |
| Continue Later (delete-type button) | ✅ | ❌ | ❌ |
| PaymentSubmitPayload construction | ✅ | ❌ | ❌ |
| CardTitle showing "Step N of 4" | ✅ | ❌ | ❌ |
| TanStack Form integration | ✅ | ❌ | ❌ |
| Remarks error validation | ✅ | ❌ | ❌ |
| Arabic digit formatting | ✅ | ❌ | ❌ |

#### Style Gaps
- Source uses `flex flex-col flex-1 rounded-md` form wrapper with `dir` attribute.
- Migrated uses basic `View` / `div` wrappers with hardcoded colors — no design token classes.
- No `CardTitle` with step counter, no `SharedLanguageSwitchRenderer`.

---

## 2. SearchPlot Component

### Source (`src/stories/searchPlot/searchPlot.tsx`)
The source renders **RadioCards** with icons for tab selection and renders full search forms (`ByPlot`, `ByOwner`, `ByCompanyOwner`) with results tables, pagination, and a drawer.

### Migrated (`mobile/src/components/SearchPlot/SearchPlot.tsx` + `web/src/components/SearchPlot/SearchPlot.tsx`)
Migrated versions render plain buttons/tabs with no form content inside each tab.

---

#### Props Comparison

| Prop | Source Type | Migrated Type | Status |
|---|---|---|---|
| `title` | `string?` | `string?` | ✅ Match |
| `title_ar` | `string?` | `string?` | ✅ Match |
| `subtitle` | `string?` | `string?` | ✅ Match |
| `subtitle_ar` | `string?` | `string?` | ✅ Match |
| `language` | `"en" \| "ar"` | `"en" \| "ar"` | ✅ Match |
| `initialOwnerType` | `"plot" \| "company" \| "owner" \| "randomAllocation"` | `"plot" \| "company" \| "owner"` | ❌ Missing `randomAllocation` |
| `selected` | `SearchResult[] \| null` | `unknown` | ❌ Weakly typed |
| `onSubmit` | `(val: SearchResult \| IOwnerPlotsSearchResult) => void` | `(eventData: unknown) => void` | ❌ Weakly typed |
| `enabledTabs.randomAllocation` | `boolean?` | **Missing** | ❌ Missing tab |
| `args` | `string?` | **Missing** | ❌ Missing |
| `theme` | `"light" \| "dark"` | **Missing** | ❌ Missing |
| `ownerTypeOptions.randomAllocation` | `string` | **Missing** | ❌ Missing |
| `ownerTypeOptions.randomAllocation_ar` | `string` | **Missing** | ❌ Missing |

#### Functional Gaps

| Feature | Source | Mobile | Web |
|---|---|---|---|
| RadioCard-based tab selection with icons | ✅ (PlotSVG, CompanyIcon, OwnerIcon) | ❌ (plain buttons) | ❌ (plain buttons) |
| Random Allocation tab (disabled) | ✅ | ❌ | ❌ |
| ByPlot form with dynamic fields | ✅ | ❌ | ❌ |
| ByOwner form with dynamic fields | ✅ | ❌ | ❌ |
| ByCompanyOwner form with dynamic fields | ✅ | ❌ | ❌ |
| Search results table with pagination | ✅ | ❌ | ❌ |
| Plot detail drawer from results | ✅ | ❌ | ❌ |
| `args` passed to sub-forms | ✅ | ❌ | ❌ |
| `selected` pre-selection in forms | ✅ | ❌ | ❌ |
| Tab changes reset form state | ✅ | N/A | N/A |

---

## 3. ViewPlotDetail Component

### Source (`src/stories/viewPlotDetail/viewPlotDetail.tsx`)
Full detail view: fetches data for **all provided plotIds**, renders a structured layout with plot image, left/bottom detail grids, and a rich owner section with many fields.

### Migrated (`mobile/web/components/ViewPlotDetail/ViewPlotDetail.tsx`)
Only renders `plotNumber`, a loading state, and a plain `ownerText` string.

---

#### Props Comparison

| Prop | Source Type | Migrated Type | Status |
|---|---|---|---|
| `plotIds` | `string[]?` | `string[]?` | ✅ Match |
| `plotTitle` | `string?` | `string?` | ✅ Match |
| `plotTitle_ar` | `string?` | `string?` | ✅ Match |
| `theme` | `"light" \| "dark"` | `"light" \| "dark"` (web only) | ⚠️ Mobile missing |
| `language` | `"en" \| "ar"` | `"en" \| "ar"` | ✅ Match |
| `ownerText` | `string?` | `string?` | ✅ Match |
| `ownerText_ar` | `string?` | `string?` | ✅ Match |
| `showOwnerDetails` | `boolean?` | `boolean?` | ✅ Match |
| `plotCode` | `string?` | **Missing** | ❌ Missing |
| `plotCode_ar` | `string?` | **Missing** | ❌ Missing |
| `plotImage` | `string?` | **Missing** | ❌ Missing |
| `plotLeftDetails` | `PlotInfoItem[]?` | **Missing** | ❌ Missing |
| `plotBottomDetails` | `PlotInfoItem[]?` | **Missing** | ❌ Missing |
| `owner` | `OwnerInfo?` | **Missing** | ❌ Missing |
| `viewButtonText` | `string?` | **Missing** | ❌ Missing |
| `viewButtonText_ar` | `string?` | **Missing** | ❌ Missing |
| `documentsText` | `string?` | **Missing** | ❌ Missing |
| `documentsText_ar` | `string?` | **Missing** | ❌ Missing |
| `uaeIdText` | `string?` | **Missing** | ❌ Missing |
| `uaeIdText_ar` | `string?` | **Missing** | ❌ Missing |
| `passportText` | `string?` | **Missing** | ❌ Missing |
| `passportText_ar` | `string?` | **Missing** | ❌ Missing |

#### Functional Gaps

| Feature | Source | Mobile | Web |
|---|---|---|---|
| Renders ALL plotIds (multiple plots) | ✅ | ❌ (only first) | ❌ (only first) |
| Plot image fetch (`useGetPlotImage`) | ✅ | ❌ | ❌ |
| Plot left details section (Address, Zone, Sector) | ✅ | ❌ | ❌ |
| Plot bottom details grid (9 fields) | ✅ | ❌ | ❌ |
| Owner section with detail rows | ✅ | ❌ | ❌ |
| "View" button on owner section | ✅ | ❌ | ❌ |
| Static fallback props (`plotLeftDetails`, `owner`) | ✅ | ❌ | ❌ |
| "No plots found" empty state | ✅ | ❌ | ❌ |
| Bilingual owner name display | ✅ | ❌ | ❌ |

---

## 4. ApplicationDetail Component

### Source (`src/stories/applicationDetails/applicationDetails.tsx`)
Shows Application Number, Date, Reference (editable input), an **Owner section** (with View/Plots/Edit Contact buttons), a **Plot section** (with View button), an **Interaction History** timeline, and a **Documents** upload section.

### Migrated (`shared/components/ApplicationDetail/ApplicationDetail.tsx`)
Shows only Application Number, Date, and a Reference `TextInput`. No owner, no plot, no history, no documents.

---

#### Props Comparison

| Prop | Source | Migrated | Status |
|---|---|---|---|
| `title` | `string?` | `string?` | ✅ Match |
| `title_ar` | `string?` | `string?` | ✅ Match |
| `language` | `"en" \| "ar"` | `"en" \| "ar"` | ✅ Match |
| `applicationNumber` | `string?` | `string?` | ✅ Match |
| `applicationDate` | `string?` | `string?` | ✅ Match |
| `referenceNumber` | `string?` | `string?` | ✅ Match |
| `onReferenceNumberChange` | `(value: string) => void` | `(value: string) => void` | ✅ Match |
| `ownerName` | `string?` | **Missing** | ❌ Missing |
| `plotNumber` | `string?` | **Missing** | ❌ Missing |
| `theme` | `"light" \| "dark"` | **Missing** | ❌ Missing |
| `applicationNumber_ar` | Not in source | Added | ⚠️ Extended (fine) |
| `applicationDate_ar` | Not in source | Added | ⚠️ Extended (fine) |
| `referenceNumber_ar` | Not in source | Added | ⚠️ Extended (fine) |
| `buttonTitle` / `showButton` | Not in source | Added | ⚠️ Extended (fine) |

#### Functional Gaps

| Feature | Source | Migrated |
|---|---|---|
| Owner section with View/Plots/Edit Contact buttons | ✅ | ❌ |
| Plot section with View button | ✅ | ❌ |
| Interaction History (inProgress/completed cards) | ✅ | ❌ |
| Documents upload section (`UploadDocument`) | ✅ | ❌ |
| Theme support (dark/light styles) | ✅ | ❌ |

---

## 5. ApplicationMessage Component

### Source (`src/stories/applicationMessage/applicationMessage.tsx`)
Renders a status-colored banner with **SVG status icons** and optional **embedded form inputs** (text, checkbox, radio, button, select). `title` and `description` are **required** props.

### Migrated (`shared/components/ApplicationMessage/ApplicationMessage.tsx`)
Renders a basic status message with text-only indicators. **No embedded inputs rendered.** `title` and `description` are optional with defaults.

---

#### Props Comparison

| Prop | Source Type | Migrated Type | Status |
|---|---|---|---|
| `title` | `string` **(required)** | `string?` (optional, has default) | ❌ Requirement weakened |
| `description` | `string` **(required)** | `string?` (optional, has default) | ❌ Requirement weakened |
| `status` | `"success" \| "error" \| "information" \| "action"` | Same | ✅ Match |
| `language` | `"en" \| "ar"` | `"en" \| "ar"` | ✅ Match |
| `type` | `"text" \| "checkbox" \| "radio" \| "button"` | Same (defined, unused) | ❌ Not rendered |
| `fieldType` | `"text" \| "date" \| "select" \| ...` | Same (defined, unused) | ❌ Not rendered |
| `selectType` | `"single" \| "multi"` | Same (defined, unused) | ❌ Not rendered |
| `label` / `label_ar` | `string?` | `string?` | ✅ Match |
| `value` | `string \| string[]` | `unknown` | ❌ Type weakened |
| `options` | `{ label, label_ar?, value }[]` | Same | ✅ Match |
| `onInputChange` | `(value: string \| string[]) => void` | `(value: unknown) => void` | ❌ Type weakened |
| `hasError` | `boolean?` | `boolean?` (defined, unused) | ⚠️ Defined but not rendered |
| `errorMessage` | `string?` | `string?` (defined, unused) | ⚠️ Defined but not rendered |
| `errorMessage_ar` | `string?` | `string?` (defined, unused) | ⚠️ Defined but not rendered |
| `disabled` | `boolean?` | `boolean?` (defined, unused) | ⚠️ Defined but not rendered |
| `required` | `boolean?` | `boolean?` (defined, unused) | ⚠️ Defined but not rendered |
| `onClick` | `() => void` | `() => void` | ✅ Match |
| `icon` | Not in source | `ReactNode?` | ⚠️ Added (fine) |
| `className` | Not in source | `string?` | ⚠️ Added (fine) |

#### Functional Gaps

| Feature | Source | Migrated |
|---|---|---|
| Status-specific SVG icons (4 icons) | ✅ | ❌ (text char fallback) |
| Embedded text input (`type="text"`) | ✅ | ❌ |
| Embedded checkbox group (`type="checkbox"`) | ✅ | ❌ |
| Embedded radio group (`type="radio"`) | ✅ | ❌ |
| Embedded button (`type="button"`) | ✅ | ❌ |
| Embedded select (`fieldType="select"`) | ✅ | ❌ |
| Error state rendering on inputs | ✅ | ❌ |
| Status-specific bg/border CSS classes | ✅ | ❌ (uses generic `application-message--*` classes) |

---

## 6. GenericCard Component

### Source (`src/stories/genericCard/genericCard.tsx`)
Uses `CardRow` component for each row, `UploadDocument` for documents, and renders with detailed design-token class names.

### Migrated (`shared/components/GenericCard/GenericCard.tsx`)
Uses `Typography` + `Container` for rows and `Buttons` for downloads. No `UploadDocument`. Simplified row data type.

---

#### Props Comparison

| Prop | Source Type | Migrated Type | Status |
|---|---|---|---|
| `rowsData` | `ICardRowProps[]` (rich, supports `rowVariant`) | `RowDataItem[]` (`{label?, label_ar?, value?, value_ar?}`) | ⚠️ Simplified |
| `showTitleSection` | `boolean?` | `boolean?` | ✅ Match |
| `title`, `title_ar` | `string?` | `string?` | ✅ Match |
| `variant` | `"large" \| "medium" \| "small"` | Same | ✅ Match |
| `isExpandable` | `boolean?` | `boolean?` | ✅ Match |
| `handleToggleInternally` | `boolean?` | `boolean?` | ✅ Match |
| `isExpanded` | `boolean?` | `boolean?` | ✅ Match |
| `onToggleExpand` | `VoidFunction?` | `() => void?` | ✅ Match |
| `showMoreButton` | `boolean?` | `boolean?` | ✅ Match |
| `defaultShowMore` | `boolean?` | `boolean?` | ✅ Match |
| `hasDocuments` | `boolean?` | `boolean?` | ✅ Match |
| `documents` | `IDocument[]` (has `fileType`, `uploadedDate`, `size`, `downloadUrl`, `isUploaded` per-doc) | Simplified (only `id`, `documentName`, `documentName_ar`, `isUploaded`, `onDownloadClick`) | ⚠️ Simplified |
| `document_type` | `"default" \| "base"` (card-level) | `"default" \| "base"` | ✅ Match |
| `isUploaded` | `boolean?` (card-level, applied to all docs) | `boolean?` | ✅ Match |
| `buttons` | `ButtonType[]` (from CardTitle) | `ButtonType[]` | ✅ Match |
| `footerButton` | `ButtonType[]?` | `ButtonType[]?` | ✅ Match |
| `showFooterButtons` | `boolean?` | `boolean?` | ✅ Match |
| `subText`, `subText_ar` | `string?` | `string?` | ✅ Match |
| `status`, `status_ar` | `string?` | `string?` | ✅ Match |
| `showBorder` | `boolean?` | `boolean?` | ✅ Match |

#### Functional Gaps

| Feature | Source | Migrated |
|---|---|---|
| `CardRow` with `rowVariant="moreLink"` for Show more | ✅ | ❌ (uses plain Buttons instead) |
| `UploadDocument` in documents section | ✅ | ❌ (uses Buttons for download only) |
| `dir` RTL on root element | ✅ | ❌ (missing, Container doesn't add it) |
| Collapsed state clickable to expand | ✅ (click on collapsed div) | ❌ (collapsed state is not clickable) |
| Design-token class names on card body | ✅ (`bg-cards-base-l1`, `border-cards-stroke`, etc.) | ❌ (platform components used instead) |
| Full document metadata (size, dates, fileType, downloadUrl) | ✅ | ❌ (simplified) |

---

## 7. GenericCards Component

### Source (`src/stories/genericCards/genericCards.tsx`)
Tracks per-card expanded state via `expandedIndices`, renders a CSS grid, and uses `GenericCardsButtonType` with `onClick(card, index)`.

### Migrated (`shared/components/GenericCards/GenericCards.tsx`)
Uses `Container` wrapper (no CSS grid), no per-card expand tracking, weakly typed buttons.

---

#### Props Comparison

| Prop | Source Type | Migrated Type | Status |
|---|---|---|---|
| `cardsData` | `IGenericCardItem[]` **(required)** | `CardDataItem[]?` (optional) | ⚠️ Requirement weakened |
| `cardsData.rowsData` | `ICardRowProps[]` **(required per item)** | `RowDataItem[]?` (optional) | ❌ Type mismatch |
| `itemsPerRow` | `"1" \| "2" \| "3"` | `string` | ⚠️ Loosely typed |
| `title`, `title_ar` | `string?` | `string?` | ✅ Match |
| `language` | `"en" \| "ar"` | `"en" \| "ar"` | ✅ Match |
| `isExpandable` | `boolean?` | `boolean?` | ✅ Match |
| `defaultShowMore` | `boolean?` | `boolean?` | ✅ Match |
| `showBorder` | `boolean?` | `boolean?` | ✅ Match |
| `showButtons` | `boolean?` | `boolean?` | ✅ Match |
| `buttons` | `GenericCardsButtonType[]` (`onClick(card, idx)`) | `unknown[]` | ❌ Completely untyped |
| `variant` | `IGenericCardProps["variant"]` | `string` | ⚠️ Loosely typed |
| `showTitleSection` | `boolean?` | `boolean?` | ✅ Match |

#### Functional Gaps

| Feature | Source | Migrated |
|---|---|---|
| CSS grid layout (1/2/3 columns) | ✅ | ❌ (no grid, just stacked) |
| Per-card expand/collapse state (`expandedIndices`) | ✅ | ❌ (cards manage internally only) |
| Button `onClick(card, index)` pattern | ✅ | ❌ |
| `gridAutoFlow: "dense"` for multi-column | ✅ | ❌ |

---

## 8. CustomDrawer (Web)

### Source vs Migrated

The web `CustomDrawer` is **nearly identical** to the source. One critical prop is not passed through:

| Issue | Source | Migrated |
|---|---|---|
| `dismissible` prop on `<Drawer>` | `<Drawer dismissible={dismissible} ...>` | `<Drawer open={open} onOpenChange={onOpenChange} direction={dir}>` — **`dismissible` not passed** |

**Effect:** The drawer cannot be dismissed by clicking the backdrop even when `dismissible={true}` is passed.

All other props (including `direction`, `size`, `backgroundClassName`, `showCloseButton`, `closeButtonOffsetClass`, `className`, `header`) are correctly implemented.

---

## 9. CustomDrawer (Mobile)

The mobile implementation uses `@gorhom/bottom-sheet` — a **correct and expected** platform-specific replacement for `vaul`. Props are functionally equivalent:

| Source Prop | Mobile Equivalent | Notes |
|---|---|---|
| `open` | `useEffect` to `present()`/`dismiss()` | ✅ Correct |
| `onOpenChange` | `onDismiss` callback | ✅ Correct |
| `dismissible` | `enablePanDownToClose` + `pressBehavior` | ✅ Correct |
| `size` | `snapPoints` mapped via `drawerSnapPoints` | ✅ Correct |
| `showCloseButton` | Manual close button rendered | ✅ Correct |
| `header` | Rendered inside sheet | ✅ Correct |
| `direction` | Not applicable (bottom sheet) | ⚠️ Accepted |

---

## 10. Footer (Web)

### Source vs Migrated — Key Differences

| Area | Source | Migrated Web | Verdict |
|---|---|---|---|
| Root element | `<div>` | `<footer role="contentinfo">` | ⚠️ Semantically better but different |
| Desktop visibility class | `!hidden sm:!flex` | `hidden sm:flex` | ⚠️ Different (no `!` importance) |
| Mobile section class | `sm:!hidden !flex` | `flex sm:hidden` | ⚠️ Different |
| Pully button | Plain `<div onClick>` | `<button>` with accessibility attrs | ✅ Improvement |
| Height | `h-[98px]` (fixed) | `min-h-[98px]` | ⚠️ Different |
| Border | None | `border-t border-neutral-200` | ⚠️ Added (not in source) |
| `botStatus` prop | Defined in interface, unused internally | Defined in interface, unused internally | ✅ Matches source behavior |

---

## 11. Footer (Mobile)

The mobile implementation is correctly platform-specific (React Native). Key difference: uses `Pressable` (accessible) instead of `TouchableOpacity` for the pully button. `botStatus` is ignored in favor of internal state — consistent with web/source behavior.

---

## Schema Comparison

### Payment Schemas (`shared/schemas/payment.schema.ts` vs `src/stories/payment/helper.ts`)

| Schema | Source | Migrated | Status |
|---|---|---|---|
| `ContractSchema` fields | Identical | Identical | ✅ |
| `MeasurementSchema` fields | Identical | Identical | ✅ |
| `InsuranceSchema` fields | Identical | Identical | ✅ |
| `RentSchema` fields | Identical | Identical | ✅ |
| Arabic error messages | ✅ Exported | ❌ Not migrated | ⚠️ Missing |
| `getXErrorMessages` helpers | ✅ Exported | ❌ Not migrated | ⚠️ Missing |
| Validation: `.nonempty()` vs `.min(1, ...)` | `.nonempty(...)` | `.min(1, ...)` | ⚠️ Different (both valid, `.nonempty` deprecated in new Zod) |

### SearchPlot Schemas (`shared/schemas/searchPlot.schema.ts` vs `src/stories/searchPlot/constants.ts`)

The schemas and default values are **correct and match** the source. ✅

---

## Action Plan

### Priority 1 — Critical (Breaks contract with source)

#### P1.1: Payment — Implement Full Component
- [ ] Add `paymentIcon` and `noPaymentIcon` props to both mobile and web
- [ ] Add `paymentType` state with RadioCard selection (Payment / No Payment)
- [ ] Port `Contract`, `Measurement`, `Insurance`, `Rent` sub-step forms from ADREC_ComponentLib into `shared/components/Payment/steps/` using `@platform/*` primitives
- [ ] Implement step navigation: Back, Continue Later (delete), Next/Submit buttons
- [ ] Implement No Payment flow with remarks textarea and validation
- [ ] Fix `onSubmit` signature to `(data: CombinedForm) => void`
- [ ] Fix `onSaveDraft` signature to `() => void`
- [ ] Add `onPaymentSubmit` prop to mobile `PaymentProps` type
- [ ] Extend `PaymentStepInfo` with full `TenancyContractInfo` fields (`requestLandClassificationId`, `plotId`, `tenancyContractId`, `contractDuration`, `type`, `unitTypeValue`)
- [ ] Port Arabic error message maps to `shared/schemas/payment.schema.ts`

#### P1.2: SearchPlot — Implement Full Component
- [ ] Add `randomAllocation` to `SearchPlotTabKey`, `enabledTabs`, `ownerTypeOptions`, `initialOwnerType`
- [ ] Add `args` and `theme` props to `SearchPlotProps`
- [ ] Type `selected` as `SearchResult[] | null` and `onSubmit` with proper return type
- [ ] Replace plain tab buttons with `RadioCard` components with icons (top iconLocation)
- [ ] Port `ByPlot`, `ByOwner`, `ByCompanyOwner` form components to `shared/components/SearchPlot/tabs/` using `@platform/*` primitives
- [ ] Implement results tables (platform-specific or shared)
- [ ] Implement plot detail drawer from results

#### P1.3: ViewPlotDetail — Implement Full Component
- [ ] Add missing props: `plotCode`, `plotCode_ar`, `plotImage`, `plotLeftDetails`, `plotBottomDetails`, `owner`, `viewButtonText`, `viewButtonText_ar`, `documentsText`, `documentsText_ar`, `uaeIdText`, `uaeIdText_ar`, `passportText`, `passportText_ar`
- [ ] Add `theme` prop to mobile `ViewPlotDetail`
- [ ] Handle multiple plotIds (iterate and render `SinglePlotDetail` for each)
- [ ] Port `SinglePlotDetail` sub-component to shared (using `@platform/*`)
- [ ] Add plot image fetching via `useGetPlotImage` hook (port to `shared/hooks/`)
- [ ] Render left details, bottom details, owner detail grids
- [ ] Add "View" button to owner section
- [ ] Add "No plots found" empty state

#### P1.4: ApplicationDetail — Complete the Component
- [ ] Add `ownerName` prop and render owner section (with View/Plots/Edit Contact buttons)
- [ ] Add `plotNumber` prop and render plot section (with View button)
- [ ] Add `theme` prop with dark/light conditional styling
- [ ] Add Interaction History section with `ProcessStatusRows` (or platform-equivalent)
- [ ] Add Documents section (using `UploadDocument` or `@platform` equivalent)

#### P1.5: ApplicationMessage — Fix Input Rendering and Types
- [ ] Make `title` and `description` required props (remove defaults)
- [ ] Port 4 SVG status icons (`ApplicationError`, `ApplicationAction`, `ApplicationSuccess`, `ApplicationInformation`) to both mobile and web `assets/svg/` and pass via `icon` prop or internal mapping
- [ ] Implement `renderInput()` for all types: `text`, `checkbox`, `radio`, `button`, `select`
- [ ] Connect `hasError`, `errorMessage`, `errorMessage_ar` to input components
- [ ] Fix `onInputChange` type: `(value: string | string[]) => void`
- [ ] Fix `value` type: `string | string[]`
- [ ] Add status-specific CSS classes with correct design tokens (`bg-status-success-light`, etc.)

### Priority 2 — Major (Degrades functionality)

#### P2.1: GenericCard — Restore Full Fidelity
- [ ] Introduce `CardRow`-equivalent component in `shared/components/CardRow/` using `@platform/*` primitives, supporting `rowVariant="moreLink"`
- [ ] Use `CardRow` in `GenericCard` instead of raw `Typography`+`Container`
- [ ] Restore `UploadDocument` in the documents section (or create `@platform/UploadDocument`)
- [ ] Add `dir={language === "ar" ? "rtl" : "ltr"}` to root Container (or pass `dir` prop)
- [ ] Make collapsed state clickable to toggle expansion
- [ ] Add full document props: `fileType`, `uploadedDate`, `uploadedDate_ar`, `size`, `downloadUrl`

#### P2.2: GenericCards — Restore Grid and State
- [ ] Restore `expandedIndices` state tracking per card
- [ ] Implement grid layout based on `itemsPerRow` ("1" / "2" / "3") — use platform-specific grid or CSS
- [ ] Type `buttons` as `GenericCardsButtonType[]` with `onClick(card, index)` pattern
- [ ] Type `itemsPerRow` as `"1" | "2" | "3"` (not `string`)
- [ ] Make `cardsData` required

### Priority 3 — Minor (Quick fixes)

#### P3.1: CustomDrawer (Web) — Fix `dismissible` Bug
- [ ] Pass `dismissible={dismissible}` to the `<Drawer>` component in `web/src/ui/CustomDrawer/CustomDrawer.tsx`

#### P3.2: Footer — Align Styles
- [ ] Decide whether to keep `<footer>` element or revert to `<div>` (semantic `<footer>` is preferred)
- [ ] Remove extra `border-t` if not in design (or confirm it's intentional)
- [ ] Consider whether `min-h-[98px]` vs `h-[98px]` is intentional

#### P3.3: Shared Types — Strengthen
- [ ] Tighten `GenericCardsProps.itemsPerRow` to `"1" | "2" | "3"`
- [ ] Tighten `GenericCardsProps.buttons` to `GenericCardsButtonType[]`
- [ ] Add `SearchPlotTabKey` to include `"randomAllocation"`
- [ ] Add `args` and `theme` to `SearchPlotProps`

---

## File Checklist for Next Steps

### Files to Create
```
shared/components/Payment/steps/Contract.tsx
shared/components/Payment/steps/Measurement.tsx
shared/components/Payment/steps/Insurance.tsx
shared/components/Payment/steps/Rent.tsx
shared/components/SearchPlot/tabs/ByPlot.tsx
shared/components/SearchPlot/tabs/ByOwner.tsx
shared/components/SearchPlot/tabs/ByCompanyOwner.tsx
shared/components/CardRow/CardRow.tsx
shared/components/CardRow/index.ts
shared/hooks/useGetPlotImage.ts
```

### Files to Modify
```
shared/types/components/Payment.ts          — extend PaymentStepInfo, fix callback types
shared/types/components/SearchPlot.ts       — add randomAllocation, args, theme, typed onSubmit
shared/types/components/ViewPlotDetail.ts   — add ~13 missing props
shared/schemas/payment.schema.ts            — add Arabic error messages
shared/components/ApplicationDetail/ApplicationDetail.tsx — add owner, plot, history, docs
shared/components/ApplicationMessage/ApplicationMessage.tsx — add inputs, icons, fix types
shared/components/GenericCard/GenericCard.tsx — CardRow, UploadDocument, dir, full docs
shared/components/GenericCards/GenericCards.tsx — grid, expandedIndices, typed buttons
web/src/ui/CustomDrawer/CustomDrawer.tsx    — pass dismissible prop
mobile/src/components/Payment/Payment.tsx   — full implementation
web/src/components/Payment/Payment.tsx      — full implementation
mobile/src/components/SearchPlot/SearchPlot.tsx — full implementation
web/src/components/SearchPlot/SearchPlot.tsx — full implementation
mobile/src/components/ViewPlotDetail/ViewPlotDetail.tsx — full implementation
web/src/components/ViewPlotDetail/ViewPlotDetail.tsx — full implementation
```
