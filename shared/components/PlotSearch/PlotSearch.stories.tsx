import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlotSearch } from "./PlotSearch";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const withQueryClient = (Story: React.ComponentType) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

const meta: Meta<typeof PlotSearch> = {
  component: PlotSearch,
  title: "Shared/PlotSearch",
  decorators: [withQueryClient],
};
export default meta;

type Story = StoryObj<typeof PlotSearch>;

export const Default: Story = {
  args: {},
};

export const CustomPageSize: Story = {
  args: { defaultPageSize: 20 },
};
