import type { ComponentProps, FC } from "react";
import type { icons as Webicons } from "../../web/src/ui/icons";
import type { icons as Mobileicons } from "../../mobile/src/ui/icons";

export type iconsProps =
  | ComponentProps<typeof Webicons>
  | ComponentProps<typeof Mobileicons>;
export const icons: FC<iconsProps>;
