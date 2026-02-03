import type { ComponentProps, FC } from "react";
import type { CustomDrawer as WebCustomDrawer } from "../../web/src/ui/CustomDrawer";
import type { CustomDrawer as MobileCustomDrawer } from "../../mobile/src/ui/CustomDrawer";

export type CustomDrawerProps =
  | ComponentProps<typeof WebCustomDrawer>
  | ComponentProps<typeof MobileCustomDrawer>;
export const CustomDrawer: FC<CustomDrawerProps>;
