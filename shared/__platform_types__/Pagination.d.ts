import type { ComponentProps, FC } from "react";
import type { Pagination as WebPagination } from "../../web/src/ui/Pagination";
import type { Pagination as MobilePagination } from "../../mobile/src/ui/Pagination";

export type PaginationProps =
  | ComponentProps<typeof WebPagination>
  | ComponentProps<typeof MobilePagination>;
export const Pagination: FC<PaginationProps>;
