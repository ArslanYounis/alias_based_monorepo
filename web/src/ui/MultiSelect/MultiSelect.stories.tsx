import { useState } from "react";
import type { Meta, StoryFn } from "@storybook/react";
import { MultiSelect } from "./MultiSelect";
import type { SelectOption } from "@shared/types";

const meta: Meta<typeof MultiSelect> = {
  title: "UI/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onChange: {
      action: "changed",
      description: "Function called when checkbox selection changes",
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

const options: SelectOption[] = [
  { label: "Pakistan", label_ar: "باكستان", value: "Pakistan" },
  { label: "India", label_ar: "الهند", value: "India" },
  { label: "USA", label_ar: "الولايات المتحدة الأمريكية", value: "USA" },
  { label: "UK", label_ar: "المملكة المتحدة", value: "UK" },
];

export const Default: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState<string[]>(args.value ?? []);
  return (
    <div style={{ background: "white", minHeight: "100vh", padding: 32 }}>
      <MultiSelect {...args} value={value} onChange={setValue} />
    </div>
  );
};
Default.args = {
  label: "Countries",
  placeholder: "Select countries",
  required: true,
  showInfoIcon: true,
  options,
  captionLeft: "Caption Left",
  captionRight: "Caption Right",
  theme: "light",
};

export const Dark: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState<string[]>(args.value ?? []);
  return (
    <div style={{ background: "#12121B", minHeight: "100vh", padding: 32 }}>
      <MultiSelect {...args} value={value} onChange={setValue} />
    </div>
  );
};
Dark.args = {
  label: "Countries",
  placeholder: "Select countries",
  required: true,
  showInfoIcon: true,
  options,
  captionLeft: "Caption Left",
  captionRight: "Caption Right",
  theme: "dark",
};

export const Arabic: StoryFn<typeof MultiSelect> = (args) => {
  const [value, setValue] = useState<string[]>(args.value ?? []);
  const arabicOptions: SelectOption[] = [
    { label_ar: "باكستان", value: "باكستان" },
    { label_ar: "الهند", value: "الهند" },
    { label_ar: "الولايات المتحدة الأمريكية", value: "الولايات المتحدة الأمريكية" },
    { label_ar: "المملكة المتحدة", value: "المملكة المتحدة" },
  ];
  return (
    <div style={{ background: "white", minHeight: "100vh", padding: 32, direction: "rtl" }}>
      <MultiSelect
        {...args}
        label="الدول"
        label_ar="الدول"
        placeholder="اختر الدول"
        placeholder_ar="اختر الدول"
        options={arabicOptions}
        value={value}
        onChange={setValue}
        language="ar"
      />
    </div>
  );
};
Arabic.args = {
  required: true,
  showInfoIcon: true,
  captionLeft: "شرح على اليسار",
  captionRight: "شرح على اليمين",
  theme: "light",
};
