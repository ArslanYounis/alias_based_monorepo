import type { ComponentProps, FC } from "react";
import type { Breadcrumb as WebBreadcrumb } from "../../web/src/ui/Breadcrumb";
import type { Breadcrumb as MobileBreadcrumb } from "../../mobile/src/ui/Breadcrumb";

export type BreadcrumbProps =
  | ComponentProps<typeof WebBreadcrumb>
  | ComponentProps<typeof MobileBreadcrumb>;
export const Breadcrumb: FC<BreadcrumbProps>;
