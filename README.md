# Cross-Platform UI Components V2

A monorepo setup for building cross-platform UI components that can be shared between web and mobile (React Native) applications using alias-based resolution.

## Project Structure

```
POC_WITH_ALIAS_2/
├── mobile/          # Mobile package (Expo app + library)
│   ├── src/
│   │   ├── ui/      # Platform-specific mobile components
│   │   └── app/     # Mobile app code
│   ├── dist/        # Build output (auto-created)
│   └── index.ts     # App entry point
├── web/             # Web package (Vite app + library)
│   ├── src/
│   │   ├── ui/      # Platform-specific web components
│   │   └── app/     # Web app code
│   ├── dist/        # Build output (auto-created)
│   └── index.ts     # Library exports
└── shared/          # Shared components and types
    ├── components/  # Components using @platform alias
    └── types/       # Shared TypeScript interfaces
```

## How It Works

- **Platform-specific components** live in `mobile/src/ui/` and `web/src/ui/`
- **Shared components** in `shared/components/` use the `@platform` alias to import platform-specific components
- During build/development, the bundler resolves `@platform` to the appropriate directory based on the platform
- **Dist folders are automatically created** when running build commands

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Servers

**Mobile (Expo):**
```bash
npm run dev:mobile
```

**Web (Vite):**
```bash
npm run dev:web
```

**Both (concurrently):**
```bash
npm run dev:all
```

## Building

**Build Web Package:**
```bash
npm run build:web
```
Builds library to `web/dist/`

**Build Mobile Package:**
```bash
npm run build:mobile
```
Builds app to `mobile/dist/`

**Build Both:**
```bash
npm run build:all
```

## Components

### Container
A simple container component that adapts to each platform:
- **Mobile**: Uses React Native `View`
- **Web**: Uses HTML `div`

### Text
A text component for each platform:
- **Mobile**: Uses React Native `Text`
- **Web**: Uses HTML `span`

### LargeComponent
A shared component that uses `Container` and `Text` via the `@platform` alias, demonstrating how shared components can work across platforms.

## Alias Configuration

- `@platform` - Resolves to `mobile/src/ui/` or `web/src/ui/` based on the platform
- `@shared` - Resolves to `shared/`

This system scales to 100+ components without individual configuration.

