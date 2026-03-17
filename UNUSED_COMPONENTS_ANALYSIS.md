# Unused & Extra Components Analysis

**Project:** `alias_based_monorepo`
**Date:** 2026-03-17

---

## 1. Empty Component Directories (7 total)

These directories exist but contain no implementation files.

| # | Path | Platform |
|---|------|----------|
| 1 | `web/src/ui/LayoutFooter` | Web |
| 2 | `web/src/ui/LayoutHeader` | Web |
| 3 | `web/src/ui/LayoutSidebar` | Web |
| 4 | `mobile/src/ui/LayoutFooter` | Mobile |
| 5 | `mobile/src/ui/LayoutHeader` | Mobile |
| 6 | `mobile/src/ui/LayoutSidebar` | Mobile |
| 7 | `web/src/components/AuditRemarks` | Web |

---

## 2. Duplicate / Extra Components (4 total)

These exist in **both** `web/src/components/` and `shared/components/`. Only the **shared** versions are actually imported and used across the codebase. The web versions contain only stubs (stories files or helper files) and are redundant.

| # | Web (Unused) | Shared (Used) | What web version contains |
|---|-------------|---------------|--------------------------|
| 1 | `web/src/components/OwnerSearch` | `shared/components/OwnerSearch` | Stories + sub-components |
| 2 | `web/src/components/Payment` | `shared/components/Payment` | Only `helper.ts` |
| 3 | `web/src/components/SearchPlot` | `shared/components/SearchPlot` | Only stories file |
| 4 | `web/src/components/ViewPlotDetail` | `shared/components/ViewPlotDetail` | Only stories file |

---

## 3. Components in Active Use

- **All 53 `web/src/ui` components** — actively used
- **All 59 `mobile/src/ui` components** — actively used
- **All 26 `shared/components`** — actively used
- **`web/src/components/Signature`** — actively used in `App.tsx`
- **`web/src/components/TitleBar`** — actively used in `App.tsx`

---

## 4. Cleanup Recommendations

### Priority 1 — Remove Immediately (Empty / Non-functional)

| # | Directory | Reason |
|---|-----------|--------|
| 1 | `web/src/ui/LayoutFooter` | Empty directory |
| 2 | `web/src/ui/LayoutHeader` | Empty directory |
| 3 | `web/src/ui/LayoutSidebar` | Empty directory |
| 4 | `mobile/src/ui/LayoutFooter` | Empty directory |
| 5 | `mobile/src/ui/LayoutHeader` | Empty directory |
| 6 | `mobile/src/ui/LayoutSidebar` | Empty directory |
| 7 | `web/src/components/AuditRemarks` | Completely unused, empty |

### Priority 2 — Remove / Consolidate (Duplicates)

| # | Directory | Action |
|---|-----------|--------|
| 1 | `web/src/components/OwnerSearch` | Remove — use `shared/components/OwnerSearch` |
| 2 | `web/src/components/SearchPlot` | Remove — use `shared/components/SearchPlot` |
| 3 | `web/src/components/ViewPlotDetail` | Remove — use `shared/components/ViewPlotDetail` |
| 4 | `web/src/components/Payment` | Consolidate `helper.ts` into `shared/components/Payment` if needed, then remove |

---

## Summary

| Category | Count |
|----------|-------|
| Empty directories | 7 |
| Duplicate/extra components | 4 |
| **Total unused/extra** | **11** |
