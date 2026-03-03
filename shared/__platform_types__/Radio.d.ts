import type { ComponentProps, FC } from "react";
import type { Radio as WebRadio } from "../../web/src/ui/Radio";
import type { Radio as MobileRadio } from "../../mobile/src/ui/Radio";

export type RadioProps =
  | ComponentProps<typeof WebRadio>
  | ComponentProps<typeof MobileRadio>;
export const Radio: FC<RadioProps>;
