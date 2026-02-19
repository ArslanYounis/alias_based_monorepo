import type { ComponentProps, FC } from "react";
import type { Bk_DateInput as WebBk_DateInput } from "../../web/src/ui/bk_DateInput";
import type { Bk_DateInput as MobileBk_DateInput } from "../../mobile/src/ui/bk_DateInput";

export type DateInputProps =
  | ComponentProps<typeof WebBk_DateInput>
  | ComponentProps<typeof MobileBk_DateInput>;
export const DateInput: FC<DateInputProps>;
