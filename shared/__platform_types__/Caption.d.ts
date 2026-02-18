import type { ComponentProps, FC } from "react";
import type { Caption as WebCaption } from "../../web/src/ui/Caption";
import type { Caption as MobileCaption } from "../../mobile/src/ui/Caption";

export type CaptionProps =
  | ComponentProps<typeof WebCaption>
  | ComponentProps<typeof MobileCaption>;
export const Caption: FC<CaptionProps>;
