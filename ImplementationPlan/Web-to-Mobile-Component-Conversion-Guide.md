# Web-to-Mobile Component Conversion Guide

## Cross-Platform UI Components Monorepo — Implementation Plan

---

## 1. Objective

We maintain a **monorepo** (`cross-platform-ui-components-v2`) with shared Storybook-driven UI components. Each component exists in two platform-specific implementations:

| Package | Platform | Alias | Tech |
|---------|----------|-------|------|
| `web/src/ui/` | Web | `@/` | React DOM, Vite, shadcn/ui |
| `mobile/src/ui/` | Mobile | `~/` | React Native, Expo, NativeWind |

Both platforms **share the same prop types** from `shared/types/ui/` (accessed via `@shared/types`) so that shared components using the `@platform/*` alias can render on either platform without changes.

**Goal:** For every component already implemented in `web/src/ui/`, produce a functionally equivalent React Native counterpart in `mobile/src/ui/` that:

1. Imports and respects the **same shared prop types** from `@shared/types`.
2. Maintains **identical public API** (same props, same behavior, same callbacks).
3. Uses **React Native primitives** and platform-appropriate UX patterns.
4. Follows the **established patterns** already proven in the `Fields` component conversion.

---

## 2. Repository Structure Reference

```
alias_based_monorepo/
├── shared/
│   ├── types/
│   │   ├── index.ts              # ContainerProps, BaseComponentProps, re-exports ui/*
│   │   └── ui/
│   │       ├── index.ts          # Re-exports all UI component prop types
│   │       ├── Fields.ts         # FormFieldProps, Option
│   │       ├── Buttons.ts        # ButtonsProps
│   │       ├── Avatar.ts         # AvatarProps
│   │       └── ...               # One file per component
│   ├── components/               # Shared cross-platform components (use @platform/*)
│   ├── hooks/
│   ├── configs/
│   └── utils/
├── web/
│   └── src/ui/
│       ├── Fields/               # Fields.tsx, Fields.stories.tsx, index.ts
│       ├── Buttons/              # Buttons.tsx, Buttons.stories.tsx, index.ts
│       └── ...                   # 24 component folders
├── mobile/
│   └── src/ui/
│       ├── Fields/               # Fields.tsx, index.ts (DONE — reference impl)
│       ├── Buttons/              # Buttons.tsx, index.ts
│       └── ...                   # Mirrors web structure
└── package.json                  # Workspaces: [mobile, web]
```

---

## 3. Component Status Matrix

Below is the current status. Components marked **Needs Review** already exist in mobile but may not have been fully validated against the web version using this guide's standards.

| # | Component | Web | Mobile | Status |
|---|-----------|-----|--------|--------|
| 1 | AddButton | Done | Exists | Needs Review |
| 2 | Avatar | Done | Exists | Needs Review |
| 3 | Bot | Done | Exists | Needs Review |
| 4 | Breadcrumb | Done | Exists | Needs Review |
| 5 | Buttons | Done | Exists | Needs Review |
| 6 | Caption | Done | Exists | Needs Review |
| 7 | Checkbox | Done | Exists | Needs Review |
| 8 | CheckRadioLabel | Done | Exists | Needs Review |
| 9 | Container | Done | Exists | Needs Review |
| 10 | CustomDrawer | Done | Exists | Needs Review |
| 11 | DateInput | Done | Exists | Needs Review |
| 12 | **Fields** | **Done** | **Done** | **Reference Implementation** |
| 13 | Footer | Done | Exists | Needs Review |
| 14 | Header | Done | Exists | Needs Review |
| 15 | IconButton | Done | Exists | Needs Review |
| 16 | Label | Done | Exists | Needs Review |
| 17 | Layout | Done | Exists | Needs Review |
| 18 | Logo | Done | Exists | Needs Review |
| 19 | ProfileIconStatus | Done | Exists | Needs Review |
| 20 | RadioCard | Done | Exists | Needs Review |
| 21 | Text | Done | Exists | Needs Review |
| 22 | TextInput | Done | Exists | Needs Review |
| 23 | Tooltip | Done | Exists | Needs Review |

> **Note:** The `Fields` component is the fully validated reference. All other mobile components should be reviewed and refined using the patterns documented below.

---

## 4. Conversion Principles

### 4.1 Golden Rules

1. **Same props, same behavior.** The component must accept the same shared type from `@shared/types` and produce the same visual/functional result.
2. **No web leakage.** Never import `react-dom`, HTML elements, or browser-only APIs in mobile code.
3. **No mobile leakage.** Never import `react-native` in web code.
4. **Shared logic stays shared.** If you find yourself duplicating complex business logic, consider extracting it to `shared/hooks/` or `shared/utils/`.
5. **Platform UX is respected.** Use native patterns (bottom-sheet modals instead of popovers, `TouchableOpacity` instead of `<button>`, etc.).

### 4.2 File Structure Per Component

Every mobile component folder must contain **exactly** these files:

```
mobile/src/ui/ComponentName/
├── ComponentName.tsx    # Main component implementation
└── index.ts             # Barrel export
```

The `index.ts` should follow this pattern:

```typescript
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";  // if re-exported from the component
```

> **Web also has `ComponentName.stories.tsx` (Storybook).** Mobile currently does not have Storybook — stories are only in the web package.

---

## 5. Element & API Mapping Reference

### 5.1 HTML Element to React Native Component

| HTML (Web) | React Native (Mobile) | Notes |
|---|---|---|
| `<div>` | `<View>` | General container |
| `<span>` | `<Text>` or `<View>` | Use `<Text>` when wrapping text content; `<View>` for layout-only wrappers |
| `<p>` | `<Text>` | All visible text must be in `<Text>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` | Prefer `<TouchableOpacity>` for standard buttons; `<Pressable>` for checkboxes/toggles |
| `<input type="text">` | `<TextInput>` | From `react-native` |
| `<input type="number">` | `<TextInput keyboardType="numeric">` | No `type="number"` in RN |
| `<textarea>` | `<TextInput multiline>` | Add `multiline` prop |
| `<img>` | `<Image source={{ uri }}>` | Requires `source` object, not `src` string |
| `<label>` | `<View>` with `<Text>` | No native `<label>`, pair manually |
| `<select>` | Custom `<Modal>` dropdown | No native select; build with `Modal` + `ScrollView` + `TouchableOpacity` |
| `<svg>` (inline) | `react-native-svg` components | Use `Svg`, `Path`, `Polyline`, etc. |

### 5.2 Event Handler Mapping

| Web Event | React Native Equivalent | Notes |
|---|---|---|
| `onClick` | `onPress` | On `TouchableOpacity` / `Pressable` |
| `onChange` (input) | `onChangeText` or `onChange` | `onChangeText` gives `string` directly; `onChange` gives `NativeSyntheticEvent` |
| `onMouseEnter` / `onMouseLeave` | **Remove** | No hover on mobile — use press-based toggle if tooltip needed |
| `onKeyDown` | **Remove** | No physical keyboard handling needed |
| `onFocus` / `onBlur` | `onFocus` / `onBlur` | Same API on `TextInput` |
| `onSubmit` (form) | **Manual** | No `<form>` in RN — handle submit via button `onPress` |

### 5.3 Prop Mapping

| Web Prop | React Native Prop | Notes |
|---|---|---|
| `disabled` (on `<input>`) | `editable={!disabled}` | `TextInput` uses `editable` |
| `disabled` (on `<button>`) | `disabled` | Works on `TouchableOpacity` / `Pressable` |
| `placeholder` | `placeholder` | Same API |
| `maxLength` | `maxLength` | Same API |
| `type="number"` | `keyboardType="numeric"` | Or `"number-pad"` for integer-only |
| `type="tel"` | `keyboardType="phone-pad"` | |
| `type="email"` | `keyboardType="email-address"` | |
| `autoFocus` | `autoFocus` | Same API |
| `rows` (textarea) | `numberOfLines` | Approximate equivalent |
| `className` | `className` | NativeWind supports this |
| `style` (CSS object) | `style` (RN StyleSheet) | Different property names (see 5.5) |
| `tabIndex` | **Remove** | Not applicable on mobile |
| `role` | `accessibilityRole` | See accessibility section |
| `data-testid` | `testID` | Note: camelCase `testID`, not `data-testid` |

### 5.4 Accessibility Mapping

| Web (ARIA) | React Native | Notes |
|---|---|---|
| `role="button"` | `accessibilityRole="button"` | |
| `role="checkbox"` | `accessibilityRole="checkbox"` | |
| `role="combobox"` | `accessibilityRole="combobox"` | |
| `role="option"` | `accessibilityRole="button"` | No direct "option" role |
| `aria-checked` | `accessibilityState={{ checked }}` | |
| `aria-disabled` | `accessibilityState={{ disabled }}` | |
| `aria-expanded` | `accessibilityState={{ expanded }}` | |
| `aria-selected` | `accessibilityState={{ selected }}` | |
| `aria-label` | `accessibilityLabel` | |
| `aria-haspopup` | **Remove** | No equivalent |

### 5.5 Common CSS to RN Style Differences

| CSS (Web/Tailwind) | React Native / NativeWind | Notes |
|---|---|---|
| `cursor-pointer` | **Remove** | Not applicable |
| `cursor-not-allowed` | **Remove** | Use `opacity-60` instead |
| `hover:bg-...` | **Remove** | No hover state |
| `resize-none` | **Remove** | RN TextInput doesn't resize |
| `outline-none` / `focus:outline-none` | **Remove** | No outline concept |
| `pointer-events-none` | `pointerEvents="none"` | Prop on `<View>`, not a class |
| `border-radius: 50%` | `borderRadius: size / 2` | Must compute numerically |
| `flex` (on div) | `flex-row` | RN default is column; explicitly set `flex-row` for horizontal |

---

## 6. Platform-Specific Substitutions

### 6.1 Popover / Dropdown → Modal Bottom Sheet

**Web** uses shadcn `Popover` (positioned dropdown attached to trigger).
**Mobile** uses a full-screen `Modal` with a bottom sheet pattern.

**Pattern:**

```tsx
// WEB
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

<Popover open={isOpen} onOpenChange={setIsOpen}>
  <PopoverTrigger asChild>
    <div>...</div>
  </PopoverTrigger>
  <PopoverContent>
    {/* dropdown items */}
  </PopoverContent>
</Popover>
```

```tsx
// MOBILE
import { Modal, TouchableOpacity, ScrollView } from "react-native";

<TouchableOpacity onPress={() => setIsOpen(true)}>
  {/* trigger content */}
</TouchableOpacity>

<Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
  <TouchableOpacity
    activeOpacity={1}
    className="flex-1 justify-end bg-black/50"
    onPress={() => setIsOpen(false)}
  >
    <TouchableOpacity activeOpacity={1} onPress={() => {}} className="max-h-[70%] rounded-t-xl bg-white p-l dark:bg-neutral-900">
      {/* Search input */}
      <TextInput
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Search..."
        className="mb-m w-full rounded-[5px] border ..."
      />
      {/* Options list */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {options.map(option => (
          <TouchableOpacity key={option.value} onPress={() => handleSelect(option.value)}>
            ...
          </TouchableOpacity>
        ))}
      </ScrollView>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
```

### 6.2 Calendar / Date Picker

**Web** uses shadcn `Calendar` inside a `Popover`.
**Mobile** uses `@react-native-community/datetimepicker`.

```tsx
// MOBILE
import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform } from "react-native";

// iOS: Wrap in Modal with "Done" button
// Android: Shows natively when triggered, no Modal needed
{Platform.OS === "ios" ? (
  <Modal visible={showPicker} transparent animationType="slide">
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white rounded-t-xl p-l">
        <TouchableOpacity onPress={() => setShowPicker(false)}>
          <Text>Done</Text>
        </TouchableOpacity>
        <DateTimePicker mode="date" display="spinner" value={date} onChange={handleChange} />
      </View>
    </View>
  </Modal>
) : (
  showPicker && <DateTimePicker mode="date" display="default" value={date} onChange={handleChange} />
)}
```

### 6.3 Icons

**Web** uses `lucide-react` icons.
**Mobile** uses custom SVG icon components from `~/assets/svg/icons/`.

```tsx
// WEB
import { CalendarIcon } from "lucide-react";
<CalendarIcon className="h-4 w-4 text-gray-500" />

// MOBILE
import CalendarIcon from "~/assets/svg/icons/CalendarIcon";
<CalendarIcon width={16} height={16} color="#6b7280" />
```

> When converting, check if the SVG icon already exists in `mobile/src/assets/svg/icons/`. If not, create it using `react-native-svg`.

### 6.4 Tooltip / Hover Interactions

**Web** uses CSS `:hover` or `onMouseEnter`/`onMouseLeave`.
**Mobile** uses a press-toggle pattern.

```tsx
// MOBILE — press-based tooltip
const [tooltipVisible, setTooltipVisible] = useState(false);

<TouchableOpacity onPress={() => setTooltipVisible(!tooltipVisible)}>
  <InfoIcon />
</TouchableOpacity>
{tooltipVisible && (
  <View className="absolute ...">
    <Text>Tooltip content</Text>
  </View>
)}
```

---

## 7. Step-by-Step Conversion Process

Follow this checklist for **each** component you convert or review:

### Step 1: Read the Web Component

- Open `web/src/ui/ComponentName/ComponentName.tsx`.
- Identify the **shared prop type** imported from `@shared/types`.
- Note all sub-components, icons, and utilities it imports.
- List every HTML element, event handler, and ARIA attribute used.

### Step 2: Check the Shared Types

- Open `shared/types/ui/ComponentName.ts`.
- Confirm the prop interface covers everything the web component uses.
- If the web component defines extra local types, check whether they should be promoted to shared.

### Step 3: Create / Update the Mobile Component

- Create `mobile/src/ui/ComponentName/ComponentName.tsx` (if it doesn't exist).
- **Import the shared type:**
  ```typescript
  import type { ComponentNameProps } from "@shared/types";
  ```
- **Import React Native primitives:**
  ```typescript
  import { View, Text, TouchableOpacity, TextInput, ... } from "react-native";
  ```
- **Replace imports:**
  - `@/` path alias → `~/` path alias.
  - `lucide-react` icons → `~/assets/svg/icons/IconName`.
  - shadcn components (`Popover`, `Calendar`, etc.) → React Native equivalents (see Section 6).
  - `SharedLanguageSwitchRenderer` → same component but from `~/components/shared/...`.

### Step 4: Convert the JSX

Apply mappings from Section 5 systematically:

1. Replace all HTML elements with RN components.
2. Replace all event handlers (`onClick` → `onPress`, etc.).
3. Replace ARIA attributes with RN accessibility props.
4. Remove web-only concepts (`cursor-*`, `hover:`, `tabIndex`, `outline`, `pointer-events-none`).
5. Change `flex` containers: add `flex-row` where horizontal layout is needed (RN defaults to column).
6. For icons, ensure parent `<View>` has `z-50` class for absolute positioning (to ensure tap-through works).

### Step 5: Handle Platform UX Differences

- Dropdowns → Modal bottom sheets (Section 6.1).
- Date pickers → `@react-native-community/datetimepicker` (Section 6.2).
- Hover tooltips → press-based toggle (Section 6.4).
- Keyboard types → set `keyboardType` prop appropriately (Section 5.3).
- Disabled inputs → use `editable={!disabled}` on `TextInput`.

### Step 6: Create the Barrel Export

Create `mobile/src/ui/ComponentName/index.ts`:

```typescript
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

### Step 7: Validate

- [ ] Component accepts all props from the shared type.
- [ ] All branches/variants (e.g., field types, button variants) are handled.
- [ ] No `react-dom` or browser-only imports present.
- [ ] Accessibility props are mapped correctly.
- [ ] Error states display correctly (error messages render **below** the input, not inline).
- [ ] RTL support (`language === "ar"`) works with `style={{ direction: "rtl" }}`.
- [ ] Disabled state is visually distinct (`opacity-60`, `editable={false}`).
- [ ] The component renders without warnings in Expo dev environment.

---

## 8. Known Pitfalls & Lessons Learned from Fields Conversion

These issues were discovered during the Fields component conversion and should be actively avoided in future conversions:

### 8.1 `renderError()` Placement

**Bug:** In the mobile Fields component, `renderError()` was placed **inside** the `<View className="relative flex-row items-center">` for uaeid, currency/phone, and number types. This causes the error message to render alongside the input in a row layout instead of below it.

**Rule:** Always place error messages **outside** the inner flex-row container:

```tsx
// CORRECT
<View>
  <View className="relative flex-row items-center">
    {/* icon */}
    <TextInput ... />
  </View>
  {renderError()}   {/* Outside the flex-row */}
</View>

// WRONG
<View>
  <View className="relative flex-row items-center">
    <TextInput ... />
    {renderError()}   {/* Inside the flex-row — error shows beside input! */}
  </View>
</View>
```

### 8.2 `internalValue` Sync Behavior

The mobile Fields component guards against resetting select values:

```typescript
// Mobile — extra guard
useEffect(() => {
  if (type !== "select" || value !== "") {
    setInternalValue(value);
  }
}, [value, type]);
```

While web unconditionally syncs. **Be intentional** about whether your component should behave as controlled or semi-uncontrolled, and document the choice.

### 8.3 Multi-Select Split Regex

Web splits on comma only: `value.split(",")`.
Mobile splits on comma OR whitespace: `value.split(/,|\s/)`.

**Rule:** Keep the split logic consistent with web unless there's a documented reason. Splitting on whitespace can break multi-word values.

### 8.4 Missing Props Forwarding

The web DateInput receives an `icon` prop; the mobile version does not. **Always cross-reference** the web component's prop usage to ensure you're not dropping props.

### 8.5 Default Prop Values

Web Fields defaults `title = ""` and `title_ar = ""`. Mobile leaves them as `undefined`. While both work with truthiness checks, **keep defaults consistent** to avoid subtle differences in conditional rendering.

---

## 9. Import Convention Reference

### Path Aliases

| Alias | Resolves To | Used In |
|-------|-------------|---------|
| `@shared/*` | `shared/*` | Both platforms |
| `@platform/*` | `web/src/ui/*` or `mobile/src/ui/*` | Shared components |
| `@/*` | `web/src/*` | Web only |
| `~/*` | `mobile/src/*` | Mobile only |

### Standard Import Order (Mobile Component)

```typescript
// 1. Shared types
import type { ComponentNameProps } from "@shared/types";

// 2. React and React Native
import React, { useState, useEffect, ... } from "react";
import { View, Text, TouchableOpacity, ... } from "react-native";

// 3. Sibling UI components (from mobile/src/ui/)
import { Checkbox } from "../Checkbox";
import { AddButton } from "../AddButton";

// 4. Icons (from mobile assets)
import SomeIcon from "~/assets/svg/icons/SomeIcon";

// 5. Shared components/utilities
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
```

### Type Re-Export Convention

In the component file:

```typescript
export type { ComponentNameProps } from "@shared/types";
```

In `index.ts`:

```typescript
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

---

## 10. Testing & Quality Checklist

Before marking a mobile component as **Done**, verify:

- [ ] **Functional parity:** Every variant/branch in the web component has a mobile counterpart.
- [ ] **Shared type compliance:** Component imports and satisfies the shared prop type.
- [ ] **No TypeScript errors:** `npx tsc --noEmit` passes for the mobile package.
- [ ] **Layout correctness:** Error messages, labels, and icons are positioned correctly.
- [ ] **RTL support:** Arabic language direction renders properly.
- [ ] **Disabled state:** Visually distinct, non-interactive.
- [ ] **Accessibility:** `accessibilityRole`, `accessibilityState`, `accessibilityLabel` are set.
- [ ] **Event parity:** All callbacks (`onChange`, `onPress`, custom handlers) fire with the correct values.
- [ ] **No dropped props:** Cross-reference every prop the web component uses against your mobile implementation.
- [ ] **Consistent defaults:** Prop default values match the web component.
- [ ] **Consistent logic:** String splitting, formatting functions, and computed values match web behavior unless there's a documented platform reason to differ.

---

## 11. Quick Reference: Fields Conversion as a Model

The `Fields` component is the **reference implementation**. Here is a summary of the conversion decisions made:

| Aspect | Web | Mobile (Reference) |
|---|---|---|
| Container elements | `<div>` | `<View>` |
| Text elements | `<span>`, `<p>` | `<Text>` |
| Text input | `<input>`, `<textarea>` | `<TextInput>`, `<TextInput multiline>` |
| Dropdown | `<Popover>` | `<Modal>` bottom sheet |
| Clickable items | `<div onClick>` | `<TouchableOpacity onPress>` |
| Error display | `<p>` | `<Text>` |
| Icon wrapper | `<span>` with absolute positioning | `<View>` with absolute positioning + `z-50` |
| Select arrow | `<SelectArrow className={...}>` | `<SelectArrow />` inside colored `<View>` |
| Search in dropdown | Inline in trigger (replaces label) | Dedicated `TextInput` at top of modal |
| Disabled input | `disabled` prop | `editable={!disabled}` |
| Keyboard type (number) | `type="number"` | `keyboardType="numeric"` |
| Keyboard type (UAE ID) | `type="text"` + `maxLength` | `keyboardType="number-pad"` + `maxLength` |
| Test ID | `data-testid={testId}` | `testID={testId}` |
| ARIA/Accessibility | `role`, `aria-*` | `accessibilityRole`, `accessibilityState` |
| Path alias | `@/` | `~/` |
| Icon source | `@/assets/svg/selectArrow` | `~/assets/svg/icons/SelectArrow` |

---

## 12. Appendix: Component Dependency Graph

Some components are composed of others. When converting, ensure dependencies are converted first:

```
Fields
├── Checkbox
├── DateInput
├── AddButton
├── CheckRadioLabel
├── SelectArrow (SVG icon)
└── SharedLanguageSwitchRenderer

Buttons
├── SharedLanguageSwitchRenderer
└── Tooltip (for hover/press tooltip)

DateInput
├── DateTimePicker (mobile: @react-native-community/datetimepicker)
├── CalendarIcon (SVG icon)
└── SharedLanguageSwitchRenderer

Header
├── Logo
├── Avatar
├── ProfileIconStatus
└── Breadcrumb

Footer
└── (self-contained)

Layout
├── Header
├── Footer
└── Container
```

> **Convert leaf components first** (icons, CheckRadioLabel, Checkbox, AddButton) before tackling composite components (Fields, Header, Layout).
