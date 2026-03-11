import type { Meta, StoryObj } from "@storybook/react";
import Prompt from "./Prompt";

const meta: Meta<typeof Prompt> = {
  component: Prompt,
  title: "UI/Prompt",
  parameters: {
    docs: {
      description: {
        component: `
A confirmation prompt component that displays a title, subtitle, and two action buttons.
Supports both English and Arabic languages with RTL layout, and includes light/dark themes.

Features:
- Bilingual support (English/Arabic) with RTL layout
- Light/Dark theme support
- Customizable text for all elements
- Proper button layout for both LTR and RTL
`,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Theme for the component",
      defaultValue: "dark",
    },
    title: {
      control: "text",
      description: "Main title in English",
    },
    title_ar: {
      control: "text",
      description: "Main title in Arabic",
    },
    subtiltle: {
      control: "text",
      description: "Subtitle text in English",
    },
    subtiltle_ar: {
      control: "text",
      description: "Subtitle text in Arabic",
    },
    yesText: {
      control: "text",
      description: "Text for the confirm button in English",
    },
    yesText_ar: {
      control: "text",
      description: "Text for the confirm button in Arabic",
    },
    noText: {
      control: "text",
      description: "Text for the cancel button in English",
    },
    noText_ar: {
      control: "text",
      description: "Text for the cancel button in Arabic",
    },
    onYesClick: {
      action: "Clicked",
      description: "Function called when confirm button is clicked",
      table: {
        category: "Events",
      },
    },
    onNoClick: {
      action: "Clicked",
      description: "Function called when cancel button is clicked",
      table: {
        category: "Events",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Prompt>;

type PromptArgs = Required<{
  title: string;
  title_ar: string;
  subtiltle: string;
  subtiltle_ar: string;
  yesText: string;
  yesText_ar: string;
  noText: string;
  noText_ar: string;
  theme: "dark" | "light";
  language: "en" | "ar";
}>;

// Base story that others can reference
export const Default: Story = {
  args: {
    language: "en",
    title: "Delete Application",
    title_ar: "حذف الطلب",
    subtiltle: "Are you sure you want to delete this application?",
    subtiltle_ar: "هل أنت متأكد أنك تريد حذف هذا الطلب؟",
    yesText: "Yes",
    yesText_ar: "نعم",
    noText: "No",
    noText_ar: "لا",
    theme: "dark",
  },
  render: (args: PromptArgs) => (
    <div
      style={{
        background: args.theme === "dark" ? "#12121B" : "white",
        minHeight: "100vh",
        padding: 32,
      }}
    >
      <Prompt {...args} />
    </div>
  ),
};

export const DeleteApplicationDark: Story = {
  args: {
    language: "en",
    title: "Delete Application",
    title_ar: "حذف الطلب",
    subtiltle: "Are you sure you want to delete this application?",
    subtiltle_ar: "هل أنت متأكد أنك تريد حذف هذا الطلب؟",
    yesText: "Yes",
    yesText_ar: "نعم",
    noText: "No",
    noText_ar: "لا",
    theme: "dark",
  },
  render: (args: PromptArgs) => (
    <div
      style={{
        background: args.theme === "dark" ? "#12121B" : "white",
        minHeight: "100vh",
        padding: 32,
      }}
    >
      <Prompt {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    ...Default.args,
    language: "ar",
  },
  render: Default.render,
};

export const Light: Story = {
  args: {
    ...Default.args,
    theme: "light",
  },
  render: Default.render,
};

export const ArabicLight: Story = {
  args: {
    ...Light.args,
    language: "ar",
  },
  render: Light.render,
};

export const RemovePlotDark: Story = {
  args: {
    language: "en",
    title: "Remove Plot",
    title_ar: "إزالة القطعة",
    subtiltle: "Are you sure you want to remove this plot?",
    subtiltle_ar: "هل أنت متأكد أنك تريد إزالة هذه القطعة؟",
    yesText: "Yes",
    yesText_ar: "نعم",
    noText: "No",
    noText_ar: "لا",
    theme: "dark",
  },
  render: (args: PromptArgs) => (
    <div style={{ background: "#2A2A32", minHeight: "100vh", padding: 32 }}>
      <Prompt {...args} />
    </div>
  ),
};

export const RemovePlotLight: Story = {
  args: {
    language: "en",
    title: "Remove Plot",
    title_ar: "إزالة القطعة",
    subtiltle: "Are you sure you want to remove this plot?",
    subtiltle_ar: "هل أنت متأكد أنك تريد إزالة هذه القطعة؟",
    yesText: "Yes",
    yesText_ar: "نعم",
    noText: "No",
    noText_ar: "لا",
    theme: "light",
  },
  render: (args: PromptArgs) => (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <Prompt {...args} />
    </div>
  ),
};

export const RemoveOwnerDark: Story = {
  args: {
    language: "en",
    title: "Remove Owner",
    title_ar: "إزالة المالك",
    subtiltle: "Are you sure you want to delete this owner?",
    subtiltle_ar: "هل أنت متأكد أنك تريد حذف هذا المالك؟",
    yesText: "Yes",
    yesText_ar: "نعم",
    noText: "No",
    noText_ar: "لا",
    theme: "dark",
  },
  render: (args: PromptArgs) => (
    <div style={{ background: "#2A2A32", minHeight: "100vh", padding: 32 }}>
      <Prompt {...args} />
    </div>
  ),
};

export const RemoveOwnerLight: Story = {
  args: {
    language: "en",
    title: "Remove Owner",
    title_ar: "إزالة المالك",
    subtiltle: "Are you sure you want to delete this owner?",
    subtiltle_ar: "هل أنت متأكد أنك تريد حذف هذا المالك؟",
    yesText: "Yes",
    yesText_ar: "نعم",
    noText: "No",
    noText_ar: "لا",
    theme: "light",
  },
  render: (args: PromptArgs) => (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <Prompt {...args} />
    </div>
  ),
};
