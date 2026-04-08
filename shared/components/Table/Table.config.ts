/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ApplicationTableProps } from "./Table";
import type { ComponentType } from "react";

const controls: ComponentConfig<ApplicationTableProps>["controls"] = {
  columns: {
    type: ["code"],
    label: "Columns",
    defaultValue: [
      { header: "Details", header_ar: "تفاصيل", accessorKey: "details" },
      { header: "Owner", header_ar: "المالك", accessorKey: "owner" },
      { header: "Plot", header_ar: "قطعة أرض", accessorKey: "plot" },
      { header: "Approval", header_ar: "الموافقة", accessorKey: "approval" },
      { header: "Payment", header_ar: "الدفع", accessorKey: "payment" },
      { header: "Print", header_ar: "طباعة", accessorKey: "print" },
    ],
    defaultCode: `return [
  { header: 'Details', header_ar: 'تفاصيل', accessorKey: 'details' },
  { header: 'Owner', header_ar: 'المالك', accessorKey: 'owner' },
  { header: 'Plot', header_ar: 'قطعة أرض', accessorKey: 'plot' },
  { header: 'Approval', header_ar: 'الموافقة', accessorKey: 'approval' },
  { header: 'Payment', header_ar: 'الدفع', accessorKey: 'payment' },
  { header: 'Print', header_ar: 'طباعة', accessorKey: 'print' },
]`,
  },
  data: {
    type: ["code"],
    label: "Data",
    defaultValue: [],
    defaultCode: "return []",
  },
};

export function createTableConfig(
  Component: ComponentType<ApplicationTableProps>,
  icon: IconType
): ComponentConfig<ApplicationTableProps> {
  return {
    id: "table",
    icon,
    name: "Table",
    Component,
    controls,
  };
}
