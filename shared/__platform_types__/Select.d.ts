import type { ComponentProps, FC } from "react";
import type { Select as WebSelect } from "../../web/src/ui/Select";
import type { Select as MobileSelect } from "../../mobile/src/ui/Select";

export type SelectProps =
  | ComponentProps<typeof WebSelect>
  | ComponentProps<typeof MobileSelect>;
export const Select: FC<SelectProps>;
