import type { ComponentProps, FC } from "react";
import type { RadioField as WebRadioField } from "../../web/src/ui/RadioField";
import type { RadioField as MobileRadioField } from "../../mobile/src/ui/RadioField";

export type RadioFieldProps =
  | ComponentProps<typeof WebRadioField>
  | ComponentProps<typeof MobileRadioField>;
export const RadioField: FC<RadioFieldProps>;
