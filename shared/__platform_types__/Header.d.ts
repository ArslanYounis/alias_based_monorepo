import type { ComponentProps, FC } from "react";
import type { Header as WebHeader } from "../../web/src/ui/Header";
import type { Header as MobileHeader } from "../../mobile/src/ui/Header";

export type HeaderProps =
  | ComponentProps<typeof WebHeader>
  | ComponentProps<typeof MobileHeader>;
export const Header: FC<HeaderProps>;
