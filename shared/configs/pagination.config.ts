import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { PaginationProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    PaginationProps,
    "language"
  >]?: ControlDefinition<PaginationProps>;
} & {
  propsOverride?: ControlDefinition<PaginationProps>;
} = {
  currentPage: {
    type: ["number", "code"],
    label: "Current Page",
    defaultValue: 1,
    defaultCode: "return 1",
  },
  totalPages: {
    type: ["number", "code"],
    label: "Total Pages",
    defaultValue: 5,
    defaultCode: "return 5",
  },
  totalCount: {
    type: ["number", "code"],
    label: "Total Count",
    defaultValue: 100,
    defaultCode: "return 100",
  },
  showBottomText: {
    type: ["boolean", "code"],
    label: "Show Bottom Text",
    defaultValue: true,
    defaultCode: "return true",
  },
  pageSize: {
    type: ["number", "code"],
    label: "Page Size",
    defaultValue: 10,
    defaultCode: "return 10",
  },
  onPageChange: {
    type: ["code"],
    label: "onPageChange",
    defaultCode: "console.log('page change',props.currentPage)",
    isEvent: true,
  },
  showPageNumbers: {
    type: ["boolean", "code"],
    label: "Show Page Numbers",
    defaultValue: true,
    defaultCode: "return true",
  },
  maxVisiblePages: {
    type: ["number", "code"],
    label: "Max Visible Pages",
    defaultValue: 5,
    defaultCode: "return 5",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createPaginationConfig(
  Component: ComponentType<PaginationProps>,
  icon: IconType
): ComponentConfig<PaginationProps> {
  return {
    id: "pagination",
    icon,
    name: "Pagination",
    Component,
    controls,
  };
}
