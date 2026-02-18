import type { ComponentProps, FC } from "react";
import type { Footer as WebFooter } from "../../web/src/ui/Footer";
import type { Footer as MobileFooter } from "../../mobile/src/ui/Footer";

export type FooterProps =
  | ComponentProps<typeof WebFooter>
  | ComponentProps<typeof MobileFooter>;
export const Footer: FC<FooterProps>;
