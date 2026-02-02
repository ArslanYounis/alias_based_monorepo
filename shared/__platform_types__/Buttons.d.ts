import type { ComponentProps, FC } from "react";
import type { Buttons as WebButtons } from "../../web/src/ui/Buttons";
import type { Buttons as MobileButtons } from "../../mobile/src/ui/Buttons";

export type ButtonsProps =
  | ComponentProps<typeof WebButtons>
  | ComponentProps<typeof MobileButtons>;
export const Buttons: FC<ButtonsProps>;
