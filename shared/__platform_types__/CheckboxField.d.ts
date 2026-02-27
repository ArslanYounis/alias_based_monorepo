import type { ComponentProps, FC } from "react";
import type { CheckboxField as WebCheckboxField } from "../../web/src/ui/CheckboxField";
import type { CheckboxField as MobileCheckboxField } from "../../mobile/src/ui/CheckboxField";

export type CheckboxFieldProps =
  | ComponentProps<typeof WebCheckboxField>
  | ComponentProps<typeof MobileCheckboxField>;
export const CheckboxField: FC<CheckboxFieldProps>;
