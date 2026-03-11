/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Pagination from "./Pagination";
import type { PaginationProps } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "UI/Pagination",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Pagination component allows users to navigate between pages. It provides control over the current page, total pages, visibility of page numbers, and the maximum number of visible pages.

This component features:
- **currentPage**: The currently active page.
- **totalPages**: The total number of pages available for pagination.
- **showPageNumbers**: A boolean to control the visibility of page numbers.
- **maxVisiblePages**: The maximum number of pages that will be displayed at once.

It also supports positioning of the pagination controls on the left or right side of the container.
        `,
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      defaultValue: 1,
      description: "The current page that is active in the pagination.",
    },
    totalPages: {
      control: { type: "number", min: 1 },
      defaultValue: 9,
      description: "The total number of pages in the pagination.",
    },
    showPageNumbers: {
      control: "boolean",
      defaultValue: true,
      description: "A boolean to toggle visibility of page numbers.",
    },
    maxVisiblePages: {
      control: { type: "number", min: 1 },
      defaultValue: 9,
      description:
        "The maximum number of pages to display at once in the pagination controls.",
    },
    position: {
      control: "radio",
      options: ["left", "center", "right"],
      defaultValue: "center",
      description:
        'Controls the position of the pagination component. Can be "left", "center", or "right".',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 20,
    showPageNumbers: true,
    maxVisiblePages: 9,
    position: "center",
    pageSize: 10,
    totalCount: 200,
  },
  render: (args: PaginationProps) => {
    const [page, setPage] = React.useState(args.currentPage ?? 1);

    return (
      <div className="w-full max-w-xl mx-auto">
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      </div>
    );
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
  },
};
