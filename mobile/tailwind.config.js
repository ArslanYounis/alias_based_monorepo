// const { hairlineWidth } = require("nativewind/theme");

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: ["./src/**/*.{ts,tsx}", "../shared/**/*.{ts,tsx}"],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//       borderWidth: {
//         hairline: hairlineWidth(),
//       },
//     },
//   },
//   plugins: [],
// };

const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "../shared/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ==== Extended Color Scales ==== */
        /* Base */
        "base-black": "#000000",
        "base-white": "#ffffff",
        "base-transparent": "transparent",

        /* Set */
        "set-primary": "#7d99a6",
        "set-secondary": "#008dcb",

        /* Secondary scale */
        "secondary-10": "var(--color-Secondary-10)",
        "secondary-9": "var(--color-Secondary-9)",
        "secondary-8": "var(--color-Secondary-8)",
        "secondary-7": "var(--color-Secondary-7)",
        "secondary-6": "var(--color-Secondary-6)",
        "secondary-5": "var(--color-Secondary-5)",
        "secondary-4": "var(--color-Secondary-4)",
        "secondary-3": "var(--color-Secondary-3)",
        "secondary-2": "var(--color-Secondary-2)",
        "secondary-1": "var(--color-Secondary-1)",
        "secondary-0": "var(--color-Secondary-0)",

        /* Primary Chrome scale */

        "primary-chrome-light-saturated":
          "var(--color-Primary-Chrome-Light-Saturated)",
        "primary-chrome-light": "var(--color-Primary-Chrome-Light)",
        "primary-chrome-18": "var(--color-Primary-Chrome-18)",
        "primary-chrome-17": "var(--color-Primary-Chrome-17)",
        "primary-chrome-16": "var(--color-Primary-Chrome-16)",
        "primary-chrome-15": "var(--color-Primary-Chrome-15)",
        "primary-chrome-14": "var(--color-Primary-Chrome-14)",
        "primary-chrome-13": "var(--color-Primary-Chrome-13)",
        "primary-chrome-12": "var(--color-Primary-Chrome-12)",
        "primary-chrome-11": "var(--color-Primary-Chrome-11)",
        "primary-chrome-10": "var(--color-Primary-Chrome-10)",
        "primary-chrome-9": "var(--color-Primary-Chrome-9)",
        "primary-chrome-8": "var(--color-Primary-Chrome-8)",
        "primary-chrome-7": "var(--color-Primary-Chrome-7)",
        "primary-chrome-6": "var(--color-Primary-Chrome-6)",
        "primary-chrome-5": "var(--color-Primary-Chrome-5)",
        "primary-chrome-4": "var(--color-Primary-Chrome-4)",
        "primary-chrome-3": "var(--color-Primary-Chrome-3)",
        "primary-chrome-2": "var(--color-Primary-Chrome-2)",
        "primary-chrome-1": "var(--color-Primary-Chrome-1)",
        "primary-chrome-0": "var(--color-Primary-Chrome-0)",
        "primary-chrome-faded": "var(--color-Primary-Chrome-Faded)",

        /* Blue scale */
        "blue-saturated-20": "var(--color-Blue-Saturated-20)",
        "blue-saturated": "var(--color-Blue-Saturated)",
        "blue-9": "var(--color-Blue-9)",
        "blue-8": "var(--color-Blue-8)",
        "blue-7": "var(--color-Blue-7)",
        "blue-6": "var(--color-Blue-6)",
        "blue-5": "var(--color-Blue-5)",
        "blue-4": "var(--color-Blue-4)",
        "blue-3": "var(--color-Blue-3)",
        "blue-2": "var(--color-Blue-2)",
        "blue-1": "var(--color-Blue-1)",
        "blue-0": "var(--color-Blue-0)",

        /* Red scale */
        "red-9-20": "var(--color-Red-9-20)",
        "red-9": "var(--color-Red-9)",
        "red-8": "var(--color-Red-8)",
        "red-7": "var(--color-Red-7)",
        "red-6": "var(--color-Red-6)",
        "red-5": "var(--color-Red-5)",
        "red-4": "var(--color-Red-4)",
        "red-3": "var(--color-Red-3)",
        "red-2": "var(--color-Red-2)",
        "red-1": "var(--color-Red-1)",
        "red-0": "var(--color-Red-0)",

        /* Dark scale */
        "dark-10": "var(--color-Dark-10)",
        "dark-9": "var(--color-Dark-9)",
        "dark-8": "var(--color-Dark-8)",
        "dark-7": "var(--color-Dark-7)",
        "dark-6": "var(--color-Dark-6)",
        "dark-5": "var(--color-Dark-5)",
        "dark-4": "var(--color-Dark-4)",
        "dark-3": "var(--color-Dark-3)",
        "dark-2": "var(--color-Dark-2)",
        "dark-1": "var(--color-Dark-1)",
        "dark-0": "var(--color-Dark-0)",
        "dark-faded": "var(--color-Dark-Faded)",

        /* Light scale */
        "light-10": "var(--color-Light-10)",
        "light-9": "var(--color-Light-9)",
        "light-8": "var(--color-Light-8)",
        "light-7": "var(--color-Light-7)",
        "light-6": "var(--color-Light-6)",
        "light-5": "var(--color-Light-5)",
        "light-4": "var(--color-Light-4)",
        "light-3": "var(--color-Light-3)",
        "light-2": "var(--color-Light-2)",
        "light-1": "var(--color-Light-1)",
        "light-0": "var(--color-Light-0)",
        "light-faded": "var(--color-Light-Faded)",

        /* Green scale */
        "green-9": "var(--color-Green-9)",
        "green-8": "var(--color-Green-8)",
        "green-7": "var(--color-Green-7)",
        "green-6": "var(--color-Green-6)",
        "green-5": "var(--color-Green-5)",
        "green-4": "var(--color-Green-4)",
        "green-3": "var(--color-Green-3)",
        "green-2": "var(--color-Green-2)",
        "green-1": "var(--color-Green-1)",
        "green-0": "var(--color-Green-0)",

        /* Indigo scale */
        "indigo-9": "var(--color-Indigo-9)",
        "indigo-8": "var(--color-Indigo-8)",
        "indigo-7": "var(--color-Indigo-7)",
        "indigo-6": "var(--color-Indigo-6)",
        "indigo-5": "var(--color-Indigo-5)",
        "indigo-4": "var(--color-Indigo-4)",
        "indigo-3": "var(--color-Indigo-3)",
        "indigo-2": "var(--color-Indigo-2)",
        "indigo-1": "var(--color-Indigo-1)",
        "indigo-0": "var(--color-Indigo-0)",
        "indigo-faded": "var(--color-Indigo-faded)",

        /* Teal scale */
        "teal-9": "var(--color-Teal-9)",
        "teal-8": "var(--color-Teal-8)",
        "teal-7": "var(--color-Teal-7)",
        "teal-6": "var(--color-Teal-6)",
        "teal-5": "var(--color-Teal-5)",
        "teal-4": "var(--color-Teal-4)",
        "teal-3": "var(--color-Teal-3)",
        "teal-2": "var(--color-Teal-2)",
        "teal-1": "var(--color-Teal-1)",
        "teal-0": "var(--color-Teal-0)",
        "teal-faded": "var(--color-Teal-faded)",

        /* Gold scale */
        "gold-9": "var(--color-Gold-9)",
        "gold-8": "var(--color-Gold-8)",
        "gold-7": "var(--color-Gold-7)",
        "gold-6": "var(--color-Gold-6)",
        "gold-5": "var(--color-Gold-5)",
        "gold-4": "var(--color-Gold-4)",
        "gold-3": "var(--color-Gold-3)",
        "gold-2": "var(--color-Gold-2)",
        "gold-1": "var(--color-Gold-1)",
        "gold-0": "var(--color-Gold-0)",
        "gold-faded": "var(--color-Gold-faded)",

        /* Yellow scale */
        "yellow-9": "var(--color-Yellow-9)",
        "yellow-8": "var(--color-Yellow-8)",
        "yellow-7": "var(--color-Yellow-7)",
        "yellow-6": "var(--color-Yellow-6)",
        "yellow-5": "var(--color-Yellow-5)",
        "yellow-4": "var(--color-Yellow-4)",
        "yellow-3": "var(--color-Yellow-3)",
        "yellow-2": "var(--color-Yellow-2)",
        "yellow-1": "var(--color-Yellow-1)",
        "yellow-0": "var(--color-Yellow-0)",

        /*  Drop shadow modal layer 1 */
        "drop-shadow-modal-1": "var(--drop-shadow-modal-1)",

        /* Form colors */
        "form-back": "var(--color-Form-Back)",
        "form-border": "var(--color-Form-Border)",

        "form-fields-active-input-text-active":
          "var(--Form-Fields-Active-Input-text-active)",
        "form-fields-error": "var(--Form-Fields-Error)",
        "form-fields-checkbox-radio-cbr-border":
          "var(--Form-Fields-Checkbox-Radio-CbR-border)",
        "form-fields-checkbox-radio-cbr-border-selected":
          "var(--Form-Fields-Checkbox-Radio-CbR-border-selected)",
        "form-fields-checkbox-radio-cb-icon":
          "var(--Form-Fields-Checkbox-Radio-Cb-icon)",
        "form-fields-checkbox-radio-cb-icon-selected":
          "var(--Form-Fields-Checkbox-Radio-Cb-icon-selected)",
        "form-fields-checkbox-radio-cbr-bg":
          "var(--Form-Fields-Checkbox-Radio-CbR-bg)",
        "form-fields-checkbox-radio-cbr-bg-selected":
          "var(--Form-Fields-Checkbox-Radio-CbR-bg-selected)",
        "form-fields-checkbox-radio-cbr-select-disable":
          "var(--Form-Fields-Checkbox-Radio-CbR-select-disable)",

        "form-fields-disabled-input-bg-disabled":
          "var(--Form-Fields-Disabled-input-bg-disabled)",
        "form-fields-disabled-input-border-disabled":
          "var(--Form-Fields-Disabled-input-border-disabled)",
        "form-fields-disabled-label-disabled":
          "var(--Form-Fields-Disabled-label-disabled)",
        "form-fields-disabled-icon-disabled":
          "var(--Form-Fields-Disabled-icon-disabled)",

        "form-fields-input-form-bg": "var(--Form-Fields-Input-Form-bg)",
        "form-fields-input-form-border": "var(--Form-Fields-Input-Form-border)",
        "form-fields-input-form-icon": "var(--Form-Fields-Input-Form-icon)",
        "form-fields-input-form-placeholder":
          "var(--Form-Fields-Input-Form-placeholder)",
        "form-fields-input-form-label": "var(--Form-Fields-Input-Form-label)",
        "form-fields-captions-text-color":
          "var(--Form-Fields-Captions-Text-color)",
        "form-fields-captions-text-color":
          "var(--Form-Fields-Captions-Text-color)",

        "form-fields-label-text": "var(--Form-Fields-Label-Text)",
        "form-fields-label-icon": "var(--Form-Fields-Label-icon)",
        "form-fields-label-disabled": "var(--Form-Fields-Label-disabled)",

        "form-fields-file-upload-default":
          "var(--Form-Fields-File-Upload-Default)",
        "form-fields-file-upload-uploaded":
          "var(--Form-Fields-File-Upload-Uploaded)",
        "form-fields-file-upload-uploaded-l1":
          "var(--Form-Fields-File-Upload-Uploaded-L1)",

        /* Filter */
        "filter-search-placeholder": "var(--Filter-Search-placeholder)",
        "filter-search-icon": "var(--Filter-Search-icon)",
        "filter-search-bg": "var(--Filter-Search-bg)",
        "filter-search-stroke": "var(--Filter-Search-stroke)",
        "filter-search-selected-icon": "var(--Filter-Search-selected-icon)",
        "filter-search-selected-bg": "var(--Filter-Search-selected-bg)",
        "filter-search-selected-stroke": "var(--Filter-Search-selected-stroke)",

        "filter-button-text": "var(--Filter-Button-text)",
        "filter-button-bg-selected": "var(--Filter-Button-bg-selected)",
        "filter-button-stroke-selected": "var(--Filter-Button-stroke-selected)",
        "filter-button-badge": "var(--Filter-Button-badge)",

        "filter-dropdown-bg": "var(--Filter-Dropdown-bg)",

        /* Cards */
        "cards-base-l1": "var(--Cards-Base-L1)",
        "cards-base-l2": "var(--Cards-Base-L2)",
        "cards-stroke": "var(--Cards-Stroke)",
        "cards-searchResult": "var(--Cards-SearchResult)",
        "cards-searchResult-selected": "var(--Cards-SearchResult-selected)",
        "cards-process-card-text-light": "var(--color-Base-White)",
        "cards-process-card-text-dark": "var(--color-Base-Black)",

        /* Status colors */
        "status-theme-light": "var(--Status-Theme-light)",
        "status-theme-solid": "var(--Status-Theme-solid)",
        "status-default-light": "var(--Status-Default-light)",
        "status-default-solid": "var(--Status-Default-solid)",
        "status-pending-light": "var(--Status-Pending-light)",
        "status-pending-fade": "var(--Status-Pending-fade)",
        "status-pending-solid": "var(--Status-Pending-solid)",
        "status-success-light": "var(--Status-Success-light)",
        "status-success-fade": "var(--Status-Success-fade)",
        "status-success-solid": "var(--Status-Success-solid)",
        "status-failed-light": "var(--Status-Failed-light)",
        "status-failed-fade": "var(--Status-Failed-fade)",
        "status-failed-solid": "var(--Status-Failed-solid)",
        "status-action-light": "var(--Status-Action-light)",
        "status-action-fade": "var(--Status-Action-fade)",
        "status-action-solid": "var(--Status-Action-solid)",

        /* Border colors */
        "border-default": "var(--Border-Default)",
        "border-dimmed": "var(--Border-Dimmed)",
        "border-light": "var(--Border-Light)",

        /* text colors */
        "text-default": "var(--Text-Default)",
        "text-dimmed": "var(--Text-Dimmed)",
        "text-primary": "var(--Text-Primary)",
        "text-link": "var(--Text-Link)",
        "text-hover": "var(--Text-Hover)",

        /* Button colors */
        "button-primary-default-bg": "var(--Button-Primary-Default-bg)",
        "button-primary-default-text": "var(--Button-Primary-Default-Text)",
        "button-primary-hover": "var(--Button-Primary-Hover)",
        "button-primary-disabled": "var(--Button-Primary-Disabled)",
        "button-secondary-default-disabled-bg":
          "var(--Button-Secondary-Default-Disabled-bg)",
        "button-secondary-default-text-stroke":
          "var(--Button-Secondary-Default-Text-Stroke)",
        "button-secondary-hover-bg": "var(--Button-Secondary-Hover-bg)",
        "button-secondary-disabled-stroke":
          "var(--Button-Secondary-Disabled-Stroke)",
        "button-tertiary-default-bg": "var(--Button-Tertiary-Default-bg)",
        "button-tertiary-default-text": "var(--Button-Tertiary-Default-Text)",
        "button-tertiary-hover": "var(--Button-Tertiary-Hover)",
        "button-tertiary-disabled-bg": "var(--Button-Tertiary-Disabled-bg)",
        "button-delete-stroke": "var(--Button-Delete-Stroke)",
        "button-delete-hover-bg": "var(--Button-Delete-Hover-bg)",
        "button-radio-card-selected-disabled":
          "var(--Button-Radio-Card-Selected-Disabled)",
        "button-radio-card-default": "var(--Button-Radio-Card-Default)",

        /* Structure colors */
        "structure-primary-0": "var(--Structure-Primary-0)",
        "structure-primary-1": "var(--Structure-Primary-1)",
        "structure-primary-2": "var(--Structure-Primary-2)",
        "structure-primary-3": "var(--Structure-Primary-3)",
        "structure-primary-4": "var(--Structure-Primary-4)",
        "structure-primary-5": "var(--Structure-Primary-5)",
        "structure-primary-6": "var(--Structure-Primary-6)",
        "structure-primary-7": "var(--Structure-Primary-7)",
        "structure-primary-8": "var(--Structure-Primary-8)",
        "structure-primary-9": "var(--Structure-Primary-9)",
        "structure-primary-9-dark": "var(--Structure-Primary-9-Dark)",

        "structure-warning-light": "var(--Structure-Warning-Light)",
        "structure-warning-mid-light": "var(--Structure-Warning-Mid-Light)",
        "structure-main-background": "var(--Structure-Main-Background)",

        "structure-modal-level-1": "var(--Structure-Modal-Level-1)",
        "structure-modal-level-2": "var(--Structure-Modal-Level-2)",
        "structure-modal-level-3": "var(--Structure-Modal-Level-3)",

        "structure-menu-background": "var(--Structure-Menu-Background)",
        "structure-menu-text": "var(--Structure-Menu-Text)",
        "structure-menu-icon": "var(--Structure-Menu-Icon)",
        "structure-menu-select-background":
          "var(--Structure-Menu-Select-Background)",
        "structure-menu-select-text": "var(--Structure-Menu-Select-Text)",
        "structure-footer-background": "var(--Structure-Footer-Background)",

        /* Chart colors */
        "chart-1": "hsl(var(--chart-1))",
        "chart-2": "hsl(var(--chart-2))",
        "chart-3": "hsl(var(--chart-3))",
        "chart-4": "hsl(var(--chart-4))",
        "chart-5": "hsl(var(--chart-5))",

        /* Sidebar colors */
        sidebar: "hsl(var(--sidebar))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "sidebar-primary": "hsl(var(--sidebar-primary))",
        "sidebar-primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        "sidebar-accent": "hsl(var(--sidebar-accent))",
        "sidebar-accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        "sidebar-border": "hsl(var(--sidebar-border))",
        "sidebar-ring": "hsl(var(--sidebar-ring))",
      },

      spacing: {
        none: "var(--spacing-none)",
        xxs: "var(--spacing-xxs)",
        xs: "var(--spacing-xs)",
        s: "var(--spacing-s)",
        m: "var(--spacing-m)",
        l: "var(--spacing-l)",
        xl: "var(--spacing-xl)",
        xxl: "var(--spacing-xxl)",
        xxxl: "var(--spacing-xxxl)",
      },

      padding: {
        none: "var(--padding-none)",
        xxs: "var(--padding-xxs)",
        xs: "var(--padding-xs)",
        s: "var(--padding-s)",
        m: "var(--padding-m)",
        l: "var(--padding-l)",
        xl: "var(--padding-xl)",
        xxl: "var(--padding-xxl)",
        xxxl: "var(--padding-xxxl)",
      },

      borderRadius: {
        none: "var(--radius-none)",
        xxs: "var(--radius-xxs)",
        xs: "var(--radius-xs)",
        s: "var(--radius-s)",
        m: "var(--radius-m)",
        l: "var(--radius-l)",
        xl: "var(--radius-xl)",
        xxl: "var(--radius-xxl)",
        xxxl: "var(--radius-xxxl)",
      },

      opacity: {
        0: "var(--opacity-0)",
        10: "var(--opacity-10)",
        20: "var(--opacity-20)",
        30: "var(--opacity-30)",
        40: "var(--opacity-40)",
        50: "var(--opacity-50)",
        60: "var(--opacity-60)",
        70: "var(--opacity-70)",
        80: "var(--opacity-80)",
        90: "var(--opacity-90)",
      },

      fontSize: {
        xxs: ["var(--text-10)", "var(--lh-12)"],
        xs: ["var(--text-12)", "var(--lh-16)"],
        s: ["var(--text-14)", "var(--lh-18)"],
        m: ["var(--text-16)", "var(--lh-20)"],
        l: ["var(--text-20)", "var(--lh-24)"],
        "heading-h1-shouting": ["var(--text-80)", "var(--lh-auto)"],
        "heading-h1-hero": ["var(--text-64)", "var(--lh-auto)"],
        "heading-h1": ["var(--text-48)", "var(--lh-56)"],
        "heading-h2": ["var(--text-32)", "var(--lh-36)"],
        "heading-h3": ["var(--text-24)", "var(--lh-28)"],
        "heading-h4": ["var(--text-16)", "var(--lh-20)"],
      },

      boxShadow: {
        "modal-light": "var(--shadow-modal-light)",
        "modal-dark": "var(--shadow-modal-dark)",
      },

      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
