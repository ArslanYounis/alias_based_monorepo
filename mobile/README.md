# @adrec/mobile-ui-base

Reusable UI components for Expo and React Native applications. Built with NativeWind for styling.

## Installation

```bash
npm install @adrec/mobile-ui-base
```

## Peer Dependencies

Make sure you have these peer dependencies installed in your project:

```bash
npm install react react-native react-native-reanimated react-native-safe-area-context react-native-svg
```

Optional peer dependencies:

- `expo` (>=49.0.0)
- `nativewind` (>=4.0.0) - Required for className styling support

## Usage

```tsx
import {
  Avatar,
  Button,
  Container,
  Text,
  Tooltip,
  Bot,
  Logo,
  Caption,
  AddButton,
  CheckRadioLabel,
  ProfileIconStatus,
} from "@adrec/mobile-ui-base";

// For NativeWind styles
import "@adrec/mobile-ui-base/global.css";
```

## Components

### Avatar

Display user avatars with optional status indicators.

```tsx
<Avatar
  imageUrl="https://example.com/avatar.png"
  initials="JD"
  status="complete"
  avatarSize={32}
/>
```

### Buttons

Customizable button component with multiple variants.

```tsx
<Buttons
  label="Click me"
  onPress={() => console.log("Pressed")}
  disabled={false}
/>
```

### Container

Layout container component with flexible styling.

```tsx
<Container className="bg-white p-4">
  <Text>Content here</Text>
</Container>
```

### Text

Typography component for consistent text styling.

```tsx
<Text className="text-lg font-bold">Hello World</Text>
```

### Tooltip

Tooltip component for displaying additional information.

```tsx
<Tooltip content="This is a tooltip">
  <Text>Hover me</Text>
</Tooltip>
```

### Bot

Bot avatar/icon component.

```tsx
<Bot
  imageUrl="https://example.com/bot.png"
  onPress={() => console.log("Bot pressed")}
/>
```

### Logo

Logo component with customizable dimensions.

```tsx
<Logo width={100} height={40} />
```

### Caption

Caption text component for subtitles and descriptions.

```tsx
<Caption title="Title" subtitle="Subtitle" />
```

### AddButton

Button component for add actions.

```tsx
<AddButton onPress={() => console.log("Add pressed")} />
```

### CheckRadioLabel

Labeled checkbox/radio component.

```tsx
<CheckRadioLabel label="Option 1" onPress={() => console.log("Selected")} />
```

### ProfileIconStatus

Profile icon with status indicator.

```tsx
<ProfileIconStatus status="inProgress" />
```

## NativeWind Setup (Required)

This library uses NativeWind for styling. You **must** configure your Tailwind to include the library's theme colors. Choose one of the two options below:

---

### Option 1: Use the Tailwind Preset (Recommended)

The easiest way to set up the theme is to use the included preset.

**Update your `tailwind.config.js`:**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    // Required: scan the library's components for class names
    "./node_modules/@adrec/mobile-ui-base/dist/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [
    require("nativewind/preset"),
    // Add the library's theme preset
    require("./node_modules/@adrec/mobile-ui-base/tailwind.preset"),
  ],
  theme: {
    extend: {
      // Your custom theme extensions here
    },
  },
  plugins: [],
};
```

---

### Option 2: Copy Theme Config Manually

If you prefer more control or need to customize the theme, you can copy the theme configuration from the library's source.

**Step 1:** Copy the theme from `node_modules/@adrec/mobile-ui-base/tailwind.preset.js`

**Step 2:** Paste it into your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    // Required: scan the library's components for class names
    "./node_modules/@adrec/mobile-ui-base/dist/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Copy all colors from tailwind.preset.js
        "base-black": "#000000",
        "base-white": "#ffffff",
        "secondary-5": "#008dcb",
        "button-primary-default-bg": "#008dcb",
        "button-primary-default-text": "#ffffff",
        "text-dimmed": "#9d9da1",
        "text-link": "#008dcb",
        // ... see tailwind.preset.js for complete list
      },
      spacing: {
        none: "0px",
        xxs: "4px",
        xs: "8px",
        s: "12px",
        m: "16px",
        l: "24px",
        xl: "32px",
        xxl: "48px",
        xxxl: "64px",
      },
      // ... copy other theme values as needed
    },
  },
  plugins: [],
};
```

> **Tip:** The full theme configuration is available in `tailwind.preset.js` included in the package. You can view it at `node_modules/@adrec/mobile-ui-base/tailwind.preset.js`

---

### After Setup: Restart Dev Server

After configuring your Tailwind, restart your dev server with cache cleared:

```bash
npx expo start --clear
```

The theme includes all custom colors used by the components:

- **Button colors:** `button-primary-*`, `button-secondary-*`, `button-tertiary-*`, `button-delete-*`
- **Text colors:** `text-default`, `text-dimmed`, `text-primary`, `text-link`
- **Status colors:** `status-success-*`, `status-failed-*`, `status-pending-*`, `status-action-*`
- **Form colors:** `form-fields-*`
- **Structure colors:** `structure-primary-*`, `structure-menu-*`, `structure-modal-*`
- **Color scales:** `secondary-0` to `secondary-10`, `dark-0` to `dark-10`, `light-0` to `light-10`, etc.

## TypeScript

This library is written in TypeScript and includes type definitions out of the box.

## License

MIT
