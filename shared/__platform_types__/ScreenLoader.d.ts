import type { ComponentProps, FC } from "react";
import type { ScreenLoader as WebScreenLoader } from "../../web/src/ui/ScreenLoader";
import type { ScreenLoader as MobileScreenLoader } from "../../mobile/src/ui/ScreenLoader";

export type ScreenLoaderProps =
  | ComponentProps<typeof WebScreenLoader>
  | ComponentProps<typeof MobileScreenLoader>;
export const ScreenLoader: FC<ScreenLoaderProps>;
