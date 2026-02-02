import type { ComponentProps, FC } from "react";
import type { Logo as WebLogo } from "../../web/src/ui/Logo";
import type { Logo as MobileLogo } from "../../mobile/src/ui/Logo";

export type LogoProps =
  | ComponentProps<typeof WebLogo>
  | ComponentProps<typeof MobileLogo>;
export const Logo: FC<LogoProps>;
