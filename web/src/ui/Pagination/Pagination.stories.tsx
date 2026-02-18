import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "UI/Pagination",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Pagination component allows users to navigate between pages. It provides control over the current page, total pages, visibility of page numbers, and the maximum number of visible pages.
        `,
      },
    },
  },
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    showPageNumbers: { control: "boolean" },
    maxVisiblePages: { control: { type: "number", min: 1 } },
    position: { control: "radio", options: ["left", "center", "right"] },
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
  render: (args) => {
    const [page, setPage] = React.useState(args.currentPage ?? 1);
    return (
      <div className="w-full max-w-xl mx-auto">
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    );
  },
};
