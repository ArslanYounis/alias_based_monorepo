import type { ComponentProps, FC } from "react";
import type { Checkbox as WebCheckbox } from "../../web/src/ui/Checkbox";
import type { Checkbox as MobileCheckbox } from "../../mobile/src/ui/Checkbox";

export type CheckboxProps =
  | ComponentProps<typeof WebCheckbox>
  | ComponentProps<typeof MobileCheckbox>;
export const Checkbox: FC<CheckboxProps>;
