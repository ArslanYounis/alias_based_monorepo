import type { ComponentProps, FC } from "react";
import type { FilterBar as WebFilterBar } from "../../web/src/ui/FilterBar";
import type { FilterBar as MobileFilterBar } from "../../mobile/src/ui/FilterBar";

export type FilterBarProps =
  | ComponentProps<typeof WebFilterBar>
  | ComponentProps<typeof MobileFilterBar>;
export const FilterBar: FC<FilterBarProps>;
