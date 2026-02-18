# Cross-Platform UI Components (Monorepo)

A monorepo for shared UI components that run on **web** (Vite + React) and **mobile** (Expo / React Native). Components are implemented per platform in `web/src/ui` and `mobile/src/ui`, with shared prop types and shared composite components that resolve to the correct platform via the `@platform` alias.

## Project structure

```
alias_based_monorepo/
├── package.json              # Root workspace config, scripts
├── tsconfig.json             # Base TS config, path aliases
├── scripts/
│   └── generate-platform-types.js   # Generates shared/__platform_types__/*.d.ts
│
├── shared/                   # Shared code (not an npm workspace)
│   ├── types/                # Shared TypeScript types
│   │   ├── index.ts          # ContainerProps, BaseComponentProps, re-exports ui/*
│   │   └── ui/               # One file per UI component’s props (AddButton, Avatar, …)
│   ├── components/           # Components that use @platform (resolve per app)
│   │   ├── DummyComponent/
│   │   ├── LargeComponent/
│   │   └── PlotSearch/
│   ├── hooks/                # Shared hooks (e.g. useGetSearchByCompanyOwner)
│   ├── __platform_types__/   # Generated .d.ts for platform components (optional)
│   └── tsconfig.json
│
├── web/                     # Web app + library (Vite)
│   ├── package.json
│   ├── index.ts              # Library entry: re-exports src/ui + shared components
│   ├── src/
│   │   ├── app/              # App shell, App.tsx
│   │   ├── ui/               # Web implementations (one folder per component)
│   │   │   ├── AddButton/
│   │   │   ├── Avatar/
│   │   │   ├── Layout/       # Web-only (no mobile counterpart)
│   │   │   └── …
│   │   └── …
│   └── dist/                 # Build output (when BUILD_LIB=true)
│
└── mobile/                  # Mobile app + library (Expo)
    ├── package.json         # @adrec/mobile-ui-base, publishable
    ├── index.ts              # App entry (Expo)
    ├── lib-index.ts         # Library entry: re-exports src/ui + shared components
    ├── src/
    │   ├── app/              # App.tsx, main.tsx
    │   ├── ui/               # Mobile implementations (one folder per component)
    │   ├── lib/              # constants, utils, useColorScheme
    │   └── …
    ├── scripts/
    │   └── build-lib.js      # Builds lib-index → dist/
    └── dist/                 # Library build output
```

## How it works

- **Platform-specific UI**  
  Each named component (e.g. `AddButton`, `Avatar`, `Buttons`) exists in both:
  - `web/src/ui/<ComponentName>/`
  - `mobile/src/ui/<ComponentName>/`  
  Same props contract; implementation is HTML/CSS vs React Native.

- **Shared prop types**  
  All UI component prop types live in `shared/types/` (e.g. `shared/types/ui/AddButton.ts`). Web and mobile components import from `@shared/types` and re-export types so both platforms share one API (e.g. `onClick`, `clicked` on web; mobile maps these to `onPress` / `pressed` internally where needed).

- **Shared components**  
  Components under `shared/components/` (e.g. `DummyComponent`, `LargeComponent`, `PlotSearch`) import primitives from `@platform/Container`, `@platform/Text`, etc. When the app runs in **web**, the bundler resolves `@platform/*` to `web/src/ui/*`; in **mobile**, to `mobile/src/ui/*`. No per-component config.

- **Library surface**  
  - **Web:** `web/index.ts` re-exports all `src/ui` components and shared components.  
  - **Mobile:** `mobile/lib-index.ts` re-exports all `src/ui` components and shared components; `scripts/build-lib.js` builds this to `mobile/dist/` for publishing or local consumption.

## Path aliases

| Alias       | In web                    | In mobile              |
|------------|---------------------------|------------------------|
| `@platform/*` | `./src/ui/*`            | `./src/ui/*`           |
| `@shared/*`   | `../shared/*`           | `../shared/*`           |
| `@/*`         | `./src/*` (web only)    | —                      |
| `~/*`         | —                        | `./*` (mobile root)    |

Root `tsconfig.json` defines `@platform` and `@shared` for the repo; each app’s tsconfig points them at the right folders.

## Scripts

### Root (from repo root)

| Script | Description |
|--------|-------------|
| `npm install` | Install dependencies for all workspaces |
| `npm run dev:web` | Start web dev server (Vite) |
| `npm run dev:mobile` | Start Expo (mobile) |
| `npm run dev:all` | Run web and mobile dev servers concurrently |
| `npm run build:web` | Build web app + library (`BUILD_LIB=true`) → `web/dist/` |
| `npm run build:mobile` | Build mobile app (Expo export) → `mobile/dist/` |
| `npm run build:all` | Run both builds |
| `npm run preview:web` | Preview web production build |
| `npm run storybook` | Start Storybook (from `web`) |
| `npm run build-storybook` | Build Storybook |
| `npm run generate:platform-types` | Generate `shared/__platform_types__/*.d.ts` from web + mobile UI |
| `npm run publish:lib` | Publish mobile library (runs from `mobile/`) |

### Web (`cd web`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + Vite build |
| `npm run preview` | Preview production build |
| `npm run storybook` | Storybook on port 6006 |
| `npm run build-storybook` | Build Storybook |

### Mobile (`cd mobile`)

| Script | Description |
|--------|-------------|
| `npm start` | Expo start |
| `npm run ios` | Run on iOS |
| `npm run android` | Run on Android |
| `npm run build:lib` | Build `lib-index.ts` → `dist/lib-index.js` + `.d.ts` |
| `npm run build:lib:watch` | Watch build for library |
| `npm run publish:lib` | Publish to configured registry |

## Development

1. **Install**
   ```bash
   npm install
   ```

2. **Run web**
   ```bash
   npm run dev:web
   ```

3. **Run mobile**
   ```bash
   npm run dev:mobile
   ```
   Then use Expo Go or a simulator.

4. **Run both**
   ```bash
   npm run dev:all
   ```

## Building

- **Web:** `npm run build:web` — builds app and library to `web/dist/`.
- **Mobile app:** `npm run build:mobile` — Expo export to `mobile/dist/`.
- **Mobile library:** `cd mobile && npm run build:lib` — builds `lib-index.ts` to `mobile/dist/` for publishing or local use.

## Components overview

- **Platform primitives** (in both `web/src/ui` and `mobile/src/ui`): AddButton, Avatar, Bot, Breadcrumb, Buttons, Caption, Checkbox, CheckRadioLabel, Container, CustomDrawer, DateInput, Fields, Footer, Header, IconButton, Label, Logo, ProfileIconStatus, RadioCard, Text, TextInput, Tooltip.
- **Web-only:** Layout (`web/src/ui/Layout`).
- **Shared (use `@platform`):** DummyComponent, LargeComponent, PlotSearch.

Prop types for all of these are defined in `shared/types` and imported in each component so web and mobile stay in sync.

## Optional: regenerating platform types

If you add or rename UI components in both `web/src/ui` and `mobile/src/ui`, you can regenerate the declaration files under `shared/__platform_types__/`:

```bash
npm run generate:platform-types
```

This script only generates types for components that exist in **both** web and mobile UI folders.
