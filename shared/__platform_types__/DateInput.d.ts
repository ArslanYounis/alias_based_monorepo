import type { ComponentProps, FC } from "react";
import type { DateInput as WebDateInput } from "../../web/src/ui/DateInput";
import type { DateInput as MobileDateInput } from "../../mobile/src/ui/DateInput";

export type DateInputProps =
  | ComponentProps<typeof WebDateInput>
  | ComponentProps<typeof MobileDateInput>;
export const DateInput: FC<DateInputProps>;
