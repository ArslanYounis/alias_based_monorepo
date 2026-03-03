import type { ComponentProps, FC } from "react";
import type { DateSelect as WebDateSelect } from "../../web/src/ui/DateSelect";
import type { DateSelect as MobileDateSelect } from "../../mobile/src/ui/DateSelect";

export type DateSelectProps =
  | ComponentProps<typeof WebDateSelect>
  | ComponentProps<typeof MobileDateSelect>;
export const DateSelect: FC<DateSelectProps>;
