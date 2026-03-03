import type { ComponentProps, FC } from "react";
import type { MultiSelect as WebMultiSelect } from "../../web/src/ui/MultiSelect";
import type { MultiSelect as MobileMultiSelect } from "../../mobile/src/ui/MultiSelect";

export type MultiSelectProps =
  | ComponentProps<typeof WebMultiSelect>
  | ComponentProps<typeof MobileMultiSelect>;
export const MultiSelect: FC<MultiSelectProps>;
