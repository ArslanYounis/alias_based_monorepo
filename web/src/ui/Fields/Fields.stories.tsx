import type { Meta, StoryObj } from "@storybook/react";
import { Fields } from "./Fields";
import Calander from "@/assets/svg/Calandericon";
import UaeidIcon from "@/assets/svg/uaeid";
import { action } from "storybook/actions";
import { Users } from "lucide-react";
import React from "react";

const meta: Meta<typeof Fields> = {
  title: "Components/InputAndFormElements/Fields",
  component: Fields,
  parameters: {
    docs: {
      description: {
        component: `
The **Fields** component is a flexible input field supporting multiple types with bilingual (English/Arabic) support:

- \`text\`, \`number\`, \`date\`, \`textarea\`, \`currency\`, \`phone\`, \`uaeid\`, \`select\`

**Key Props:**
- \`type\`: Input type (see above)
- \`language\`: 'en' or 'ar' for language switching
- \`placeholder\` / \`placeholder_ar\`: Placeholder text in English/Arabic
- \`errorMessage\` / \`errorMessage_ar\`: Error message in English/Arabic
- \`value\`: Input value
- \`icon\`: Icon for some of the fields
- \`hasError\`: Show error state
- \`disabled\`: Disable the input
- \`currencySymbol\`: For currency type
- \`phoneCode\`: For phone type
- \`options\`: For select type
- \`theme\`: 'light' or 'dark'
- \`onChange\`: Change handler

**Usage Example:**

\`\`\`
<Fields
  type="text"
  language="en"
  placeholder="Enter your name"
  placeholder_ar="\u0623\u062f\u062e\u0644 \u0627\u0633\u0645\u0643"
  value={value}
  onChange={setValue}
  icon={<Users />}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language of the component (English or Arabic)",
      defaultValue: "en",
    },
    type: {
      control: { type: "select" },
      options: [
        "text",
        "number",
        "date",
        "textarea",
        "currency",
        "phone",
        "uaeid",
        "select",
      ],
      description: "Type of the input field",
    },
    placeholder: {
      control: "text",
      if: { arg: "type", truthy: true },
    },
    placeholder_ar: {
      control: "text",
      description: "Placeholder text in Arabic",
      if: { arg: "type", truthy: true },
    },
    value: {
      control: "text",
      if: { arg: "type", truthy: true },
    },
    hasError: {
      control: "boolean",
      if: { arg: "type", truthy: true },
    },
    errorMessage: {
      control: "text",
      if: { arg: "type", truthy: true },
    },
    errorMessage_ar: {
      control: "text",
      description: "Error message in Arabic",
      if: { arg: "type", truthy: true },
    },
    icon: {
      control: "object",
      description: "Icon to display in the input (optional)",
    },
    disabled: {
      control: "boolean",
      if: { arg: "type", truthy: true },
    },
    onChange: {
      action: "changed",
      description: "Function called when input value changes",
      table: { category: "Events" },
      if: { arg: "type", truthy: true },
    },
    currencySymbol: {
      control: "text",
      if: { arg: "type", eq: "currency" },
    },
    phoneCode: {
      control: "text",
      if: { arg: "type", eq: "phone" },
    },
    options: {
      control: "object",
      if: { arg: "type", eq: "select" },
    },
    selectType: {
      control: { type: "radio" },
      options: ["single", "multi"],
      description: "Type of select (single or multi-select)",
      if: { arg: "type", eq: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Fields>;

const selectOptions = [
  { label: "Option 1", label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u0623\u0648\u0644", value: "option-1" },
  { label: "Option 2", label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0646\u064a", value: "option-2" },
  { label: "Option 3", label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0644\u062b", value: "option-3" },
];

export const TextField: Story = {
  args: {
    type: "text",
    placeholder: "Placeholder",
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledTextField: Story = {
  args: {
    type: "text",
    placeholder: "Placeholder",
    disabled: true,
    value: "",
    onChange: action("changed"),
  },
};

export const TextFieldWithError: Story = {
  args: {
    type: "text",
    placeholder: "Placeholder",
    disabled: false,
    hasError: true,
    value: "",
    onChange: action("changed"),
  },
};

export const TextFieldWithIcon: Story = {
  args: {
    type: "text",
    placeholder: "Enter your name",
    icon: <Users />,
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledTextFieldWithIcon: Story = {
  args: {
    type: "text",
    placeholder: "Disabled with icon",
    icon: <Users />,
    disabled: true,
    value: "",
    onChange: action("changed"),
  },
};

export const TextFieldWithIconError: Story = {
  args: {
    type: "text",
    placeholder: "Enter your name",
    hasError: true,
    icon: <Users />,
    value: "",
    onChange: action("changed"),
  },
};

export const DateField: Story = {
  args: {
    type: "date",
    placeholder: "Select date",
    icon: <Calander />,
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledDateField: Story = {
  args: {
    type: "date",
    placeholder: "Select date",
    disabled: true,
    icon: <Calander fillColor="#59595F" />,
    value: "",
    onChange: action("changed"),
  },
};

export const DateFieldWithError: Story = {
  args: {
    type: "date",
    placeholder: "Select date",
    hasError: true,
    icon: <Calander fillColor="#000000" />,
    value: "",
    onChange: action("changed"),
  },
};

export const SingleSelectField: Story = {
  args: {
    type: "select",
    placeholder: "Select an option",
    options: selectOptions,
    value: "",
    selectType: "single",
  },
  render: (args) => {
    const Component = () => {
      const [value, setValue] = React.useState("");
      return <Fields {...args} value={value} onChange={setValue} />;
    };

    return <Component />;
  },
};

export const MultiSelectField: Story = {
  args: {
    type: "select",
    placeholder: "Select multiple options",
    options: selectOptions,
    value: "",
    selectType: "multi",
  },
  render: (args) => {
    const Component = () => {
      const [value, setValue] = React.useState("");
      return <Fields {...args} value={value} onChange={setValue} />;
    };
    return <Component />;
  },
};

export const DisabledSelectField: Story = {
  args: {
    type: "select",
    placeholder: "Placeholder",
    options: selectOptions,
    value: "",
    disabled: true,
    onChange: action("changed"),
    selectType: "single",
  },
};

export const DisabledMultiSelectField: Story = {
  args: {
    type: "select",
    placeholder: "Select multiple options",
    options: selectOptions,
    value: "",
    disabled: true,
    onChange: action("changed"),
    selectType: "multi",
  },
};

export const SelectFieldWithError: Story = {
  args: {
    type: "select",
    placeholder: "Placeholder",
    options: selectOptions,
    hasError: true,
    value: "",
    onChange: action("changed"),
    selectType: "single",
  },
  render: (args) => {
    const Component = () => {
      const [value, setValue] = React.useState("");
      return <Fields {...args} value={value} onChange={setValue} />;
    };
    return <Component />;
  },
};

export const MultiSelectFieldWithError: Story = {
  args: {
    type: "select",
    placeholder: "Select multiple options",
    options: selectOptions,
    hasError: true,
    value: "",
    onChange: action("changed"),
    selectType: "multi",
  },
  render: (args) => {
    const Component = () => {
      const [value, setValue] = React.useState("");
      return <Fields {...args} value={value} onChange={setValue} />;
    };
    return <Component />;
  },
};

export const Textarea: Story = {
  args: {
    type: "textarea",
    placeholder: "Placeholder",
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledTextarea: Story = {
  args: {
    type: "textarea",
    placeholder: "Placeholder",
    disabled: true,
    value: "",
    onChange: action("changed"),
  },
};

export const TextareaWithError: Story = {
  args: {
    type: "textarea",
    placeholder: "Placeholder",
    hasError: true,
    value: "",
    onChange: action("changed"),
  },
};

export const UAEIDField: Story = {
  args: {
    type: "uaeid",
    placeholder: "XXX-XXXX-XXXXXX-X",
    icon: <UaeidIcon />,
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledUAEIDField: Story = {
  args: {
    type: "uaeid",
    placeholder: "XXX-XXXX-XXXXXX-X",
    disabled: true,
    icon: <UaeidIcon />,
    value: "",
    onChange: action("changed"),
  },
};

export const UAEIDFieldWithError: Story = {
  args: {
    type: "uaeid",
    placeholder: "XXX-XXXX-XXXXXX-X",
    hasError: true,
    icon: <UaeidIcon />,
    value: "",
    onChange: action("changed"),
  },
};

export const CurrencyField: Story = {
  args: {
    type: "currency",
    placeholder: "Placeholder",
    currencySymbol: "AED",
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledCurrencyField: Story = {
  args: {
    type: "currency",
    placeholder: "Placeholder",
    disabled: true,
    value: "",
    onChange: action("changed"),
  },
};

export const CurrencyFieldWithError: Story = {
  args: {
    type: "currency",
    placeholder: "Placeholder",
    hasError: true,
    value: "",
    onChange: action("changed"),
  },
};

export const PhoneField: Story = {
  args: {
    type: "phone",
    placeholder: "Placeholder",
    phoneCode: "+971",
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledPhoneField: Story = {
  args: {
    type: "phone",
    placeholder: "Placeholder",
    disabled: true,
    phoneCode: "+971",
    value: "",
    onChange: action("changed"),
  },
};

export const PhoneFieldWithError: Story = {
  args: {
    type: "phone",
    placeholder: "Placeholder",
    hasError: true,
    phoneCode: "+971",
    value: "",
    onChange: action("changed"),
  },
};

export const NumberField: Story = {
  args: {
    type: "number",
    placeholder: "Placeholder",
    value: "",
    onChange: action("changed"),
  },
};

export const DisabledNumberField: Story = {
  args: {
    type: "number",
    placeholder: "Placeholder",
    disabled: true,
    value: "",
    onChange: action("changed"),
  },
};

export const NumberFieldWithError: Story = {
  args: {
    type: "number",
    placeholder: "Placeholder",
    hasError: true,
    value: "",
    onChange: action("changed"),
  },
};

// Arabic Examples
export const TextFieldArabic: Story = {
  args: {
    type: "text",
    language: "ar",
    placeholder: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    placeholder_ar: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    value: "",
    onChange: action("changed"),
  },
  render: (args) => (
    <div style={{ direction: "rtl" }}>
      <Fields {...args} />
    </div>
  ),
};

export const TextFieldWithErrorArabic: Story = {
  args: {
    type: "text",
    language: "ar",
    placeholder: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    placeholder_ar: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    hasError: true,
    errorMessage: "This field is required",
    errorMessage_ar: "\u0647\u0630\u0627 \u0627\u0644\u062d\u0642\u0644 \u0645\u0637\u0644\u0648\u0628",
    value: "",
    onChange: action("changed"),
  },
  render: (args) => (
    <div style={{ direction: "rtl" }}>
      <Fields {...args} />
    </div>
  ),
};

export const MultiSelectFieldArabic: Story = {
  args: {
    type: "select",
    language: "ar",
    placeholder: "\u0627\u062e\u062a\u0631 \u062e\u064a\u0627\u0631\u0627\u062a \u0645\u062a\u0639\u062f\u062f\u0629",
    placeholder_ar: "\u0627\u062e\u062a\u0631 \u062e\u064a\u0627\u0631\u0627\u062a \u0645\u062a\u0639\u062f\u062f\u0629",
    options: [
      { label: "Option 1", label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u0623\u0648\u0644", value: "option-1" },
      { label: "Option 2", label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0646\u064a", value: "option-2" },
      { label: "Option 3", label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0644\u062b", value: "option-3" },
    ],
    value: "",
    selectType: "multi",
  },
  render: (args) => {
    const Component = () => {
      const [value, setValue] = React.useState("");
      return (
        <div style={{ direction: "rtl" }}>
          <Fields {...args} value={value} onChange={setValue} />
        </div>
      );
    };
    return <Component />;
  },
};

export const SingleSelectFieldArabic: Story = {
  args: {
    type: "select",
    language: "ar",
    placeholder: "\u0627\u062e\u062a\u0631 \u062e\u064a\u0627\u0631",
    placeholder_ar: "\u0627\u062e\u062a\u0631 \u062e\u064a\u0627\u0631",
    options: [
      {
        label: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u0623\u0648\u0644",
        label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u0623\u0648\u0644",
        value: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u0623\u0648\u0644",
      },
      {
        label: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0646\u064a",
        label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0646\u064a",
        value: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0646\u064a",
      },
      {
        label: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0644\u062b",
        label_ar: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0644\u062b",
        value: "\u0627\u0644\u062e\u064a\u0627\u0631 \u0627\u0644\u062b\u0627\u0644\u062b",
      },
    ],
    value: "",
    selectType: "single",
  },
  render: (args) => {
    const Component = () => {
      const [value, setValue] = React.useState("");
      return (
        <div style={{ direction: "rtl" }}>
          <Fields {...args} value={value} onChange={setValue} />
        </div>
      );
    };
    return <Component />;
  },
};

export const TextareaArabic: Story = {
  args: {
    type: "textarea",
    language: "ar",
    placeholder: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    placeholder_ar: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    value: "",
    onChange: action("changed"),
  },
  render: (args) => (
    <div style={{ direction: "rtl" }}>
      <Fields {...args} />
    </div>
  ),
};

export const TextInputArabicWithIcon: Story = {
  args: {
    type: "text",
    language: "ar",
    placeholder: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    placeholder_ar: "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0646\u0627\u0626\u0628",
    icon: <Users />,
    value: "",
    onChange: action("changed"),
  },
  render: (args) => (
    <div style={{ direction: "rtl" }}>
      <Fields {...args} />
    </div>
  ),
};
