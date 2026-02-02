import type { ComponentProps, FC } from "react";
import type { RadioCard as WebRadioCard } from "../../web/src/ui/RadioCard";
import type { RadioCard as MobileRadioCard } from "../../mobile/src/ui/RadioCard";

export type RadioCardProps =
  | ComponentProps<typeof WebRadioCard>
  | ComponentProps<typeof MobileRadioCard>;
export const RadioCard: FC<RadioCardProps>;
