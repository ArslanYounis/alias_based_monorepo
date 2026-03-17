import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./Select";

type Story = StoryObj<typeof Select>;

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component: "A single-select dropdown component with bilingual support and RTL layout capabilities.",
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    onChange: {
      action: "changed",
      description: "Function called when selection changes",
      table: {
        category: "Events",
      },
    },
    theme: {
      control: { type: "radio" },
      options: ["light", "dark"],
      description: "Theme of the component (light or dark)",
      defaultValue: "light",
    },
  },
};

export default meta;

const options = [
  { label: "Option 1", label_ar: "الخيار 1", value: "Option 1" },
  { label: "Option 2", label_ar: "الخيار 2", value: "Option 2" },
  { label: "Option 3", label_ar: "الخيار 3", value: "Option 3" },
  { label: "Option 4", label_ar: "الخيار 4", value: "Option 4" },
];

export const Default: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("");
      return (
        <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
          <Select
            {...args}
            value={checked}
            onChange={setChecked}
            options={options}
            label="Select an option"
            label_ar="اختر خياراً"
            placeholder="Select an option..."
            placeholder_ar="اختر خياراً..."
            language="en"
            theme="light"
          />
        </div>
      );
    };
    return <Wrapper />;
  },
};

export const Dark: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("");
      return (
        <div style={{ background: "#12121B", minHeight: "100vh", padding: 32 }}>
          <Select
            {...args}
            value={checked}
            onChange={setChecked}
            options={options}
            label="Select an option"
            label_ar="اختر خياراً"
            placeholder="Select an option..."
            placeholder_ar="اختر خياراً..."
            language="en"
            theme="dark"
          />
        </div>
      );
    };
    return <Wrapper />;
  },
};

export const Arabic: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState("");
      return (
        <div style={{ background: "white", minHeight: "100vh", padding: 32, direction: "rtl" }}>
          <Select
            {...args}
            value={checked}
            onChange={setChecked}
            options={options}
            label="Select an option"
            label_ar="اختر خياراً"
            placeholder="Select an option..."
            placeholder_ar="اختر خياراً..."
            language="ar"
            theme="light"
          />
        </div>
      );
    };
    return <Wrapper />;
  },
};
