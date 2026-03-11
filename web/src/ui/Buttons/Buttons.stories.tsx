import PlusIcon from "@/assets/svg/PlusIcon";
import QuestionMarkIcon from "@/assets/svg/QuestionMarkIcon";
import type { Meta, StoryObj } from "@storybook/react";
import { Buttons } from "./Buttons";

const meta: Meta<typeof Buttons> = {
  title: "UI/Buttons",
  component: Buttons,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Buttons component is a versatile and customizable button UI element. It supports various button types, sizes, and themes. This component also allows you to add icons to either the left or right of the button text, or both.

**Props:**

\`\`\`
interface NewButtonProps {
  title: string;
  type?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "text-link"
    | "delete";
  fullWidth?: boolean;
  size?: "s" | "m" | "l";
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  disabled?: boolean;
  iconColor?: string;
  onClick?: () => void;
}
\`\`\`

**Usage:**

\`\`\`
<Buttons
  title="Click Me"
  type="primary"
  size="m"
  onClick={() => alert("Button clicked!")}
  leftIcon={<PlusIcon />}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    onClick: { action: "changed", table: { category: "Events" } },
    size: {
      control: "radio",
      options: ["s", "m", "l"],
      description: "Controls the button size.",
      table: {
        type: { summary: "'s' | 'm' | 'l'" },
        defaultValue: { summary: "s" },
      },
    },
    language: {
      control: "radio",
      options: ["en", "ar"],
      description: "Controls the button language.",
      table: {
        type: { summary: "'en' | 'ar'" },
        defaultValue: { summary: "en" },
      },
    },
    type: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "text-link",
        "delete",
        "help",
      ],
      description: "Defines the button style. Can be of",
      table: {
        type: {
          summary:
            "'primary' | 'secondary' | 'tertiary' | 'text-link' | 'delete' | 'help'",
        },
        defaultValue: { summary: "primary" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled and non-interactive.",
    },
    title: {
      control: "text",
      description: "The text displayed on the button.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Add Label" },
      },
    },
    title_ar: {
      control: "text",
      description: "The text displayed on the button in Arabic.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Add Label" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "Weather width of button is equal to parent div or not",
    },
    leftIcon: {
      description: "Icon displayed on the left side of the button.",
    },
    rightIcon: {
      description: "Icon displayed on the right side of the button.",
    },
    iconColor: {
      control: "color",
      description: "Sets the color of the left and right icons.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "#000000" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Buttons>;

export const PrimarySmallDefault: Story = {
  args: {
    title: "Add Label",
    type: "primary",
    size: "s",
    onClick: () => alert("Button clicked!"),
  },
};

export const PrimaryMediumDefault: Story = {
  args: {
    title: "Add Label",
    type: "primary",
    size: "m",
    onClick: () => alert("Button clicked!"),
  },
};

export const PrimaryLargeDefault: Story = {
  args: {
    title: "Add Label",
    type: "primary",
    size: "l",
    onClick: () => alert("Button clicked!"),
  },
};

export const PrimarySmallDisabled: Story = {
  args: {
    title: "Add Label",
    type: "primary",
    size: "s",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const PrimaryMediumDisabled: Story = {
  args: {
    title: "Add Label",
    type: "primary",
    size: "m",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const PrimaryLargeDisabled: Story = {
  args: {
    title: "Add Label",
    type: "primary",
    size: "l",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const SecondarySmallDefault: Story = {
  args: {
    title: "Add Label",
    type: "secondary",
    size: "s",
    onClick: () => alert("Button clicked!"),
  },
};

export const SecondaryMediumDefault: Story = {
  args: {
    title: "Add Label",
    type: "secondary",
    size: "m",
    onClick: () => alert("Button clicked!"),
  },
};

export const SecondaryLargeDefault: Story = {
  args: {
    title: "Add Label",
    type: "secondary",
    size: "l",
    onClick: () => alert("Button clicked!"),
  },
};

export const SecondarySmallDisabled: Story = {
  args: {
    title: "Add Label",
    type: "secondary",
    size: "s",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const SecondaryMediumDisabled: Story = {
  args: {
    title: "Add Label",
    type: "secondary",
    size: "m",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const SecondaryLargeDisabled: Story = {
  args: {
    title: "Add Label",
    type: "secondary",
    size: "l",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const TertiarySmallDefault: Story = {
  args: {
    title: "Add Label",
    type: "tertiary",
    size: "s",
    onClick: () => alert("Button clicked!"),
  },
};

export const TertiaryMediumDefault: Story = {
  args: {
    title: "Add Label",
    type: "tertiary",
    size: "m",
    onClick: () => alert("Button clicked!"),
  },
};

export const TertiaryLargeDefault: Story = {
  args: {
    title: "Add Label",
    type: "tertiary",
    size: "l",
    onClick: () => alert("Button clicked!"),
  },
};

export const TertiarySmallDisabled: Story = {
  args: {
    title: "Add Label",
    type: "tertiary",
    size: "s",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const TertiaryMediumDisabled: Story = {
  args: {
    title: "Add Label",
    type: "tertiary",
    size: "m",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const TertiaryLargeDisabled: Story = {
  args: {
    title: "Add Label",
    type: "tertiary",
    size: "l",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const TextLinkSmallDefault: Story = {
  args: {
    title: "Add Label",
    type: "text-link",
    size: "s",
    onClick: () => alert("Button clicked!"),
  },
};

export const TextLinkMediumDefault: Story = {
  args: {
    title: "Add Label",
    type: "text-link",
    size: "m",
    onClick: () => alert("Button clicked!"),
  },
};

export const TextLinkLargeDefault: Story = {
  args: {
    title: "Add Label",
    type: "text-link",
    size: "l",
    onClick: () => alert("Button clicked!"),
  },
};

export const TextLinkSmallDisabled: Story = {
  args: {
    title: "Add Label",
    type: "text-link",
    size: "s",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const TextLinkMediumDisabled: Story = {
  args: {
    title: "Add Label",
    type: "text-link",
    size: "m",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const TextLinkLargeDisabled: Story = {
  args: {
    title: "Add Label",
    type: "text-link",
    size: "l",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const DeleteSmallDefault: Story = {
  args: {
    title: "Add Label",
    type: "delete",
    size: "s",
    onClick: () => alert("Button clicked!"),
  },
};

export const DeleteMediumDefault: Story = {
  args: {
    title: "Add Label",
    type: "delete",
    size: "m",
    onClick: () => alert("Button clicked!"),
  },
};

export const DeleteLargeDefault: Story = {
  args: {
    title: "Add Label",
    type: "delete",
    size: "l",
    onClick: () => alert("Button clicked!"),
  },
};

export const DeleteSmallDisabled: Story = {
  args: {
    title: "Add Label",
    type: "delete",
    size: "s",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const DeleteMediumDisabled: Story = {
  args: {
    title: "Add Label",
    type: "delete",
    size: "m",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

export const DeleteLargeDisabled: Story = {
  args: {
    title: "Add Label",
    type: "delete",
    size: "l",
    disabled: true,
    onClick: () => alert("Button clicked!"),
  },
};

// export const HelpSmallDefault: Story = {
//   args: {
//     title: "Help",
//     type: "help",
//     size: "s",
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "en",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

// export const HelpMediumDefault: Story = {
//   args: {
//     title: "Help",
//     type: "help",
//     size: "m",
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "en",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

// export const HelpLargeDefault: Story = {
//   args: {
//     title: "Help",
//     type: "help",
//     size: "l",
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "en",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

// export const HelpSmallDisabled: Story = {
//   args: {
//     title: "Help",
//     type: "help",
//     size: "s",
//     disabled: true,
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "en",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

// export const HelpMediumDisabled: Story = {
//   args: {
//     title: "Help",
//     type: "help",
//     size: "m",
//     disabled: true,
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "en",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

// export const HelpLargeDisabled: Story = {
//   args: {
//     title: "Help",
//     type: "help",
//     size: "l",
//     disabled: true,
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "en",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

// export const HelpArabic: Story = {
//   args: {
//     title: "Help",
//     title_ar: "مساعدة",
//     type: "help",
//     size: "m",
//     language: "ar",
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "ar",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

// export const HelpDarkTheme: Story = {
//   args: {
//     title: "Help",
//     type: "help",
//     size: "m",
//     theme: "dark",
//     tooltip: {
//       text: "This is a help tooltip!",
//       text_ar: "هذه تلميحة مساعدة!",
//       direction: "top-center",
//       language: "en",
//     },
//     onClick: () => alert("Help button clicked!"),
//   },
// };

export const TooltipOnIconButton: Story = {
  args: {
    title: "",
    type: "text-link",
    size: "l",
    leftIcon: <QuestionMarkIcon />,
    tooltip: {
      text: "This is a tooltip!",
      text_ar: "هذه تلميحة!",
      direction: "top-center",
      language: "en",
    },
  },
};

export const PrimaryWithLeftIocn: Story = {
  args: {
    title: "Button",
    type: "primary",
    size: "m",
    leftIcon: <PlusIcon />,
  },
};

export const PrimaryWithRightIocn: Story = {
  args: {
    title: " Button",
    type: "primary",
    size: "m",
    rightIcon: <PlusIcon />,
  },
};

export const PrimaryWithBothIcons: Story = {
  args: {
    title: " Button",
    type: "primary",
    size: "m",
    leftIcon: <PlusIcon />,
    rightIcon: <PlusIcon />,
  },
};

export const WithCustomIconColor: Story = {
  args: {
    title: "Button",
    type: "primary",
    size: "m",
    leftIcon: <PlusIcon />,
    rightIcon: <PlusIcon />,
    iconColor: "#ef3b3b",
  },
};
