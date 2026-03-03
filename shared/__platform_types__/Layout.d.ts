import type { ComponentProps, FC } from "react";
import type { Layout as WebLayout } from "../../web/src/ui/Layout";
import type { Layout as MobileLayout } from "../../mobile/src/ui/Layout";

export type LayoutProps =
  | ComponentProps<typeof WebLayout>
  | ComponentProps<typeof MobileLayout>;
export const Layout: FC<LayoutProps>;
