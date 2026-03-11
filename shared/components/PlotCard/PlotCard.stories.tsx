import type { Meta, StoryObj } from "@storybook/react";
import PlotCard from "./PlotCard";
import type { Plot } from "./PlotCard";

const meta: Meta<typeof PlotCard> = {
  title: "Components/PlotCard",
  component: PlotCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **PlotCard** component displays a list of plot cards with expandable details. Each card shows plot information with fields, supports bilingual content (English/Arabic), and includes action buttons for viewing or changing plots.

### Features:
- **Bilingual Support**: All text elements support both English and Arabic
- **RTL Layout**: Automatic RTL layout when Arabic is selected
- **Expandable Cards**: Each plot card can be expanded/collapsed to show/hide details
- **Action Buttons**: Configurable View and Change Plot buttons
- **Multiple Plots**: Supports displaying multiple plot cards in a list

### Props:
\`\`\`
interface ApprovalModalProps {
  plots: Plot[];
  title: string;
  title_ar?: string;
  showViewButton?: boolean;
  showChangePlotButton?: boolean;
  theme?: "light" | "dark";
  onPressView?: (val: Plot) => void;
  onPressPlotChange?: (val: Plot) => void;
  language?: "en" | "ar";
  defaultShowMore?: boolean;
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    language: {
      control: { type: "radio" },
      options: ["en", "ar"],
      description: "Language setting that affects layout direction (LTR/RTL)",
      table: { category: "Language" },
    },
    title: {
      control: "text",
      description: "Main title for the plot cards section",
      table: { category: "Content" },
    },
    title_ar: {
      control: "text",
      description: "Arabic version of the main title",
      table: { category: "Content" },
    },
    showViewButton: {
      control: "boolean",
      description: "Show/hide the View button on each plot card",
      table: { category: "Buttons" },
    },
    showChangePlotButton: {
      control: "boolean",
      description: "Show/hide the Change Plot button on each plot card",
      table: { category: "Buttons" },
    },
    defaultShowMore: {
      control: "boolean",
      description: "Default state for showing more fields in each card",
      table: { category: "Behavior" },
    },
    plots: {
      control: { type: "object" },
      description: "Array of plot objects to display",
      table: { category: "Data" },
    },
    onPressView: {
      action: "view-pressed",
      description: "Called when View button is clicked",
      table: { category: "Events" },
    },
    onPressPlotChange: {
      action: "change-plot-pressed",
      description: "Called when Change Plot button is clicked",
      table: { category: "Events" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PlotCard>;

const samplePlots: Plot[] = [
  {
    plotId: "plot-1",
    plotArgs: "args-1",
    plotNumber: "C1",
    plotNumber_ar: "\u062c1",
    fields: [
      {
        label: "Plot Address",
        label_ar: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0642\u0637\u0639\u0629",
        value: "0-222-000-RCH9999",
        value_ar: "0-222-000-RCH9999",
      },
      {
        label: "Zone/District",
        label_ar: "\u0627\u0644\u0645\u0646\u0637\u0642\u0629/\u0627\u0644\u062d\u064a",
        value: "Al Layyan",
        value_ar: "\u0627\u0644\u0644\u064a\u0627\u0646",
      },
      {
        label: "Sector",
        label_ar: "\u0627\u0644\u0642\u0637\u0627\u0639",
        value: "Seih Al Sedeirah 64",
        value_ar: "\u0633\u064a\u062d \u0627\u0644\u0633\u062f\u064a\u0631\u0629 64",
      },
      {
        label: "Municipality",
        label_ar: "\u0627\u0644\u0628\u0644\u062f\u064a\u0629",
        value: "Abu Dhabi City",
        value_ar: "\u0645\u062f\u064a\u0646\u0629 \u0623\u0628\u0648\u0638\u0628\u064a",
      },
      {
        label: "Allocation Type",
        label_ar: "\u0646\u0648\u0639 \u0627\u0644\u062a\u062e\u0635\u064a\u0635",
        value: "Commercial",
        value_ar: "\u062a\u062c\u0627\u0631\u064a",
      },
      {
        label: "Area",
        label_ar: "\u0627\u0644\u0645\u0633\u0627\u062d\u0629",
        value: "314.939.11 Square Meter",
        value_ar: "314.939.11 \u0645\u062a\u0631 \u0645\u0631\u0628\u0639",
      },
    ],
  },
  {
    plotId: "plot-2",
    plotArgs: "args-2",
    plotNumber: "C2",
    plotNumber_ar: "\u062c2",
    fields: [
      {
        label: "Plot Address",
        label_ar: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0642\u0637\u0639\u0629",
        value: "0-333-000-RCH8888",
        value_ar: "0-333-000-RCH8888",
      },
      {
        label: "Zone/District",
        label_ar: "\u0627\u0644\u0645\u0646\u0637\u0642\u0629/\u0627\u0644\u062d\u064a",
        value: "Al Khalidiyah",
        value_ar: "\u0627\u0644\u062e\u0627\u0644\u062f\u064a\u0629",
      },
      {
        label: "Sector",
        label_ar: "\u0627\u0644\u0642\u0637\u0627\u0639",
        value: "Sector 12",
        value_ar: "\u0627\u0644\u0642\u0637\u0627\u0639 12",
      },
      {
        label: "Municipality",
        label_ar: "\u0627\u0644\u0628\u0644\u062f\u064a\u0629",
        value: "Abu Dhabi City",
        value_ar: "\u0645\u062f\u064a\u0646\u0629 \u0623\u0628\u0648\u0638\u0628\u064a",
      },
    ],
  },
];

export const Default: Story = {
  args: {
    plots: samplePlots,
    title: "Plots",
    title_ar: "\u0627\u0644\u0642\u0637\u0639",
    showViewButton: true,
    showChangePlotButton: false,
    language: "en",
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <PlotCard {...args} />
    </div>
  ),
};

export const WithChangePlotButton: Story = {
  args: {
    plots: samplePlots,
    title: "Plots",
    title_ar: "\u0627\u0644\u0642\u0637\u0639",
    showViewButton: true,
    showChangePlotButton: true,
    language: "en",
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <PlotCard {...args} />
    </div>
  ),
};

export const Arabic: Story = {
  args: {
    plots: samplePlots,
    title: "Plots",
    title_ar: "\u0627\u0644\u0642\u0637\u0639",
    showViewButton: true,
    showChangePlotButton: false,
    language: "ar",
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <PlotCard {...args} />
    </div>
  ),
};

export const SinglePlot: Story = {
  args: {
    plots: [samplePlots[0]],
    title: "Plot Details",
    title_ar: "\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0642\u0637\u0639\u0629",
    showViewButton: true,
    showChangePlotButton: false,
    language: "en",
    defaultShowMore: false,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <PlotCard {...args} />
    </div>
  ),
};

export const WithDefaultShowMore: Story = {
  args: {
    plots: samplePlots,
    title: "Plots",
    title_ar: "\u0627\u0644\u0642\u0637\u0639",
    showViewButton: true,
    showChangePlotButton: false,
    language: "en",
    defaultShowMore: true,
  },
  render: (args) => (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <PlotCard {...args} />
    </div>
  ),
};
