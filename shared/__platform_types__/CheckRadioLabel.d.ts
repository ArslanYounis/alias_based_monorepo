import type { ComponentProps, FC } from "react";
import type { CheckRadioLabel as WebCheckRadioLabel } from "../../web/src/ui/CheckRadioLabel";
import type { CheckRadioLabel as MobileCheckRadioLabel } from "../../mobile/src/ui/CheckRadioLabel";

export type CheckRadioLabelProps =
  | ComponentProps<typeof WebCheckRadioLabel>
  | ComponentProps<typeof MobileCheckRadioLabel>;
export const CheckRadioLabel: FC<CheckRadioLabelProps>;
