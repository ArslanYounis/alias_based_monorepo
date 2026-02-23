# TypeScript Type Errors Report — alias_based_monorepo

**Generated:** February 2026  
**Scope:** Root `tsc --noEmit` (web + shared; mobile included when type-checked via workspace)  
**Mobile standalone:** `tsc --noEmit` fails with TS5098 (customConditions / moduleResolution).

---

## Summary

| Area      | Error count (approx) | Main causes |
|-----------|----------------------|-------------|
| **Mobile** | ~600+               | Module resolution (`~/`), `className` on RN primitives |
| **Shared** | 18                  | Typography variant, operator mix, duplicates, types |
| **Web**    | ~90+                | Module resolution (`@/`), missing `lib: dom`, config types |

**Total:** 700+ type errors across the monorepo.

---

## 1. Mobile (`mobile/`)

### 1.1 Module not found (TS2307)

**Cause:** Alias `~/*` may not resolve the same way for `tsc` as for Metro.

| Missing module | Used in (examples) |
|----------------|--------------------|
| `~/components/shared/SharedLanguageSwitchRenderer` | AddMoreButton, bk_DateInput, Bot, Breadcrumb, Buttons, Caption, CheckRadioLabel, Fields, Header, Label, Pagination, Prompt, RadioCard, Tooltip, Typography |
| `~/assets/svg/icons/Plus` | AddButton |
| `~/assets/svg/icons/Info`, `SelectArrow` | bk_DateInput, Label |
| `~/assets/svg/icons/PullyUp`, `PullyDown` | Footer |
| `~/assets/svg/icons/OneHub` | Logo |
| `~/assets/svg/icons/StatusUp`, `Settings`, `SelectArrow` | Header |
| `~/assets/svg/statusSvg/Away`, `Arrow`, `Online`, `failed` | ProfileIconStatus |

**Fix:** Ensure `mobile/tsconfig.json` has `baseUrl` and `paths` so `~/*` resolves to `./*` (or correct path). Run typecheck with the same config Metro uses.

### 1.2 `className` does not exist (TS2322 / TS2769)

**Cause:** React Native’s `View`, `Text`, `Pressable`, `TouchableOpacity`, `ScrollView`, `TextInput` don’t declare `className` in their types. NativeWind adds it at runtime.

**Affected:** Most of `mobile/src/ui/` (AddButton, AddMoreButton, Avatar, bk_DateInput, Bot, Breadcrumb, Buttons, Caption, Checkbox, CheckRadioLabel, Container, CustomDrawer, Fields, Footer, Header, IconButton, Label, Pagination, RadioCard, TextInput, Tooltip, etc.).

**Fix (pick one):**

- Extend RN types to include `className` (e.g. in `nativewind-env.d.ts` or a global `.d.ts`).
- Or use `style` instead of `className` for type-safe code and keep `className` only where types are extended.

### 1.3 TS5098 — mobile tsconfig

```
Option 'customConditions' can only be used when 'moduleResolution' is set to 'node16', 'nodenext', or 'bundler'.
```

**Fix:** In `mobile/tsconfig.json` (or inherited config), set `"moduleResolution": "bundler"` (or `"node16"` / `"nodenext"`) if you use `customConditions`.

---

## 2. Shared (`shared/`)

### 2.1 ApplicationMessage (TS2820)

- **File:** `shared/components/ApplicationMessage/ApplicationMessage.tsx` (line 77)
- **Error:** `"text-s"` is not assignable to `TypographyVariant`. Suggestion: use `"text-xs"` or add `"text-s"` to the variant type.

### 2.2 CardTitle (TS5076)

- **File:** `shared/components/CardTitle/CardTitle.tsx` (line 139)
- **Error:** `'||' and '??' operations cannot be mixed without parentheses.`
- **Fix:** Add parentheses, e.g. `(a ?? b) || c` or `a ?? (b || c)`.

### 2.3 GenericCard (TS2322)

- **File:** `shared/components/GenericCard/GenericCard.tsx` (lines 150, 151)
- **Error:** `Type 'string | undefined' is not assignable to type 'string'.`
- **Fix:** Ensure `title_ar`/`title` (or the props passed to CardTitle) are typed as `string` or provide a default (e.g. `?? ""`).

### 2.4 GenericTableCard (TS5076, TS2304)

- **File:** `shared/components/GenericTableCard/GenericTableCard.tsx`
- **Errors:** Multiple `'||' and '??' operations cannot be mixed without parentheses` (lines 72, 73, 84, 95, 103). `Cannot find name 'pageSize'` (line 113).
- **Fix:** Add parentheses where `||` and `??` are mixed; define or import `pageSize`.

### 2.5 PlotSearch (TS2322)

- **File:** `shared/components/PlotSearch/PlotSearch.tsx` (lines 56, 94, 96)
- **Error:** `className` / type not assignable to `IntrinsicAttributes & TextProps`.
- **Fix:** Shared component should not rely on `className` for `Typography`/Text if the platform type doesn’t support it, or use a type that includes `className`.

### 2.6 dateSelect.config (TS2353)

- **File:** `shared/configs/dateSelect.config.ts` (line 13)
- **Error:** `'showInfoIcon' does not exist in type ...`
- **Fix:** Add `showInfoIcon` to the config type for DateInput/DateSelect or remove it from the config.

### 2.7 shared/hooks (TS2300, TS2345)

- **File:** `shared/hooks/index.ts`
  - **Error:** Duplicate identifier `useGetSearchByCompanyOwner` and `getSearchByCompanyOwner` (exported twice).
- **File:** `shared/hooks/useSearchPlot.ts` (line 57)
  - **Error:** `Argument of type 'PlotSearchParams' is not assignable to parameter of type 'Record<string, unknown>'` (index signature).
- **Fix:** Remove duplicate exports from `hooks/index.ts`. Fix `filterParams` or call site to accept `PlotSearchParams` or a compatible type.

---

## 3. Web (`web/`)

### 3.1 Compiler / lib (TS2584, TS2812, TS2304, TS5097)

- **document / window / DOM:** `document`, `window`, `HTMLCanvasElement.getContext`, `width`/`height`, `toDataURL`, `offsetWidth`, `tagName`, `focus` not found.
- **Cause:** Web tsconfig may be missing `"lib": ["DOM", "DOM.Iterable", ...]` or equivalent so DOM types are available.
- **main.tsx:** Import path ending in `.tsx` (TS5097) — enable `allowImportingTsExtensions` or use extension-less imports.

**Fix:** In `web/tsconfig.json` (or base), add `"lib": ["ES2020", "DOM", "DOM.Iterable"]` and ensure the web app is built with this config.

### 3.2 Module not found (TS2307) — `@/` alias

Many web files use `@/` (e.g. `@/lib/utils`, `@/components/shared/SharedLanguageSwitchRenderer`, `@/assets/...`, `@/components/ui/...`, `@/utils/...`). TypeScript doesn’t resolve them if `paths` are wrong or the config used for `tsc` doesn’t match Vite.

**Examples:**

| Missing / wrong path | Used in |
|----------------------|--------|
| `@/lib/utils` | button, calendar, drawer, dropdown-menu, popover, bk_DateInput |
| `@/components/shared/SharedLanguageSwitchRenderer` | AddMoreButton, bk_DateInput, Bot, Breadcrumb, Buttons, Caption, CheckRadioLabel, DateSelect, Fields, Label, Pagination, Prompt, RadioCard, Tooltip, Typography |
| `@/components/ui/popover`, `button`, `calendar`, `drawer`, `dropdown-menu` | FilterBar, bk_DateInput, DateSelect, Fields, Label, Header |
| `@/assets/svg/...`, `@/assets/icons/...` | CustomDrawer, Footer, Header, Label, Logo, Pagination, ProfileIconStatus, icon-registry |
| `@/utils/transform-dls-config`, `transform-renderer-config` | federation configs |
| `@/ui/Layout` | federation/public-component |

**Fix:** Ensure `web/tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }` (or your real structure). Run `tsc` from `web/` so this config is used.

### 3.3 Named vs default export (TS2614)

- **File:** `web/src/ui/AddMoreButton/addMoreButton.config.ts` — use default import for `AddMoreButton`.
- **File:** `web/src/ui/Pagination/pagination.config.ts`, `Pagination.stories.tsx` — use default import for `Pagination`.
- **File:** `web/src/ui/Prompt/prompt.config.ts` — use default import for `Prompt`.
- **File:** `web/src/ui/ScreenLoader/screenLoader.config.ts` — use default import for `ScreenLoader`.
- **File:** `web/src/ui/Typography/typography.config.ts`, `Typography.stories.tsx` — use default import for `Typography`.

**Fix:** Use `import AddMoreButton from "./AddMoreButton"` (and similarly for the others) or add matching named exports to the component files.

### 3.4 Config vs component props (TS2345)

Web UI configs pass `FC<...Props>` into `createConfig`, but the props type comes from the config file (e.g. `unknown[]`) while the component expects a specific type (e.g. `RowDataItem[]`, `ButtonType[]`). Types are incompatible.

**Affected:** ApplicationMessage, CardTitle, GenericCard, GenericCards, GenericTableCard, OwnerCard, PlotCard configs.

**Fix:** Have configs use the same types as the component (import from shared component or shared types). Replace `unknown[]` with the correct interface (e.g. `RowDataItem[]`, `ButtonType[]`) in the config type.

### 3.5 Other web issues

- **App.tsx:** No exported member `DateInput` from `"../../index"` — export or import `Bk_DateInput` / correct name.
- **FilterBar, Signature, TitleBar, UploadDocuments, Fields:** `EventTarget` / `HTMLInputElement` `value` or `files` — use correct type (e.g. `(e.target as HTMLInputElement).value`).
- **TitleBar:** `Buttons` received `theme` which is not in `ButtonsProps` — add `theme` to `ButtonsProps` or stop passing it.
- **useDarkMode, Footer:** `window` not found — ensure DOM lib is included.
- **expose.components.ts:** Many `@/ui/...` and `@/ui/configs/...` paths not found — align paths with actual layout (e.g. `@/ui/` vs `src/ui/`) and fix filenames (e.g. casing: `addMoreButton.config` vs `AddMoreButton.config`).

---

## 4. Recommended fix order

1. **Config**
   - **Mobile:** Set `moduleResolution` to `bundler` (or node16/nodenext) if using `customConditions`; ensure `paths` for `~/*` match Metro.
   - **Web:** Add DOM to `lib`; set `baseUrl` and `paths` for `@/*`; run `tsc` from `web/` so this config is used.

2. **Shared (quick wins)**
   - Fix ApplicationMessage Typography variant (`"text-s"` → `"text-xs"` or add variant).
   - Fix CardTitle / GenericTableCard `||` and `??` mixing (add parentheses).
   - Fix GenericCard `string | undefined` (defaults or types).
   - Fix GenericTableCard `pageSize` (define or pass prop).
   - Remove duplicate exports in `shared/hooks/index.ts` and fix `useSearchPlot` / `filterParams` type.

3. **Mobile**
   - Add/update global typings so RN primitives accept `className` (NativeWind), or stop using `className` in typed props.
   - Verify `~/*` resolution (paths in tsconfig and Metro) and fix any remaining module paths.

4. **Web**
   - Fix `@/` resolution (paths and tsc run from `web/`).
   - Fix default vs named exports for AddMoreButton, Pagination, Prompt, ScreenLoader, Typography.
   - Align config types with component props (no `unknown[]` where a concrete type is required).
   - Fix DOM / event types (e.g. `(e.target as HTMLInputElement).value`) and add DOM lib if still missing.

---

## 5. Commands used

- Root (includes web + shared; mobile may appear due to references):  
  `cd /Users/apple/Desktop/Practice/alias_based_monorepo && npx tsc --noEmit`
- Web only:  
  `cd /Users/apple/Desktop/Practice/alias_based_monorepo/web && npx tsc --noEmit`  
  (exit code 0 in last run — web may be clean when type-checked with its own tsconfig.)
- Mobile only:  
  `cd /Users/apple/Desktop/Practice/alias_based_monorepo/mobile && npx tsc --noEmit`  
  (fails with TS5098 re customConditions.)

---

*End of report. Re-run `tsc --noEmit` from root and from `web/` and `mobile/` after fixes to confirm.*
