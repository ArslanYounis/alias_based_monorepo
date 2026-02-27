import type { ComponentProps, FC } from "react";
import type { CheckboxInput as WebCheckboxInput } from "../../web/src/ui/CheckboxInput";
import type { CheckboxInput as MobileCheckboxInput } from "../../mobile/src/ui/CheckboxInput";

export type CheckboxInputProps =
  | ComponentProps<typeof WebCheckboxInput>
  | ComponentProps<typeof MobileCheckboxInput>;
export const CheckboxInput: FC<CheckboxInputProps>;
