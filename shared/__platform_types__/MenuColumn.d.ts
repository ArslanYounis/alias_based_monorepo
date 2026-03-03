import type { ComponentProps, FC } from "react";
import type { MenuColumn as WebMenuColumn } from "../../web/src/ui/MenuColumn";
import type { MenuColumn as MobileMenuColumn } from "../../mobile/src/ui/MenuColumn";

export type MenuColumnProps =
  | ComponentProps<typeof WebMenuColumn>
  | ComponentProps<typeof MobileMenuColumn>;
export const MenuColumn: FC<MenuColumnProps>;
