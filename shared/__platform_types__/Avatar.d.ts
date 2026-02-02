import type { ComponentProps, FC } from "react";
import type { Avatar as WebAvatar } from "../../web/src/ui/Avatar";
import type { Avatar as MobileAvatar } from "../../mobile/src/ui/Avatar";

export type AvatarProps =
  | ComponentProps<typeof WebAvatar>
  | ComponentProps<typeof MobileAvatar>;
export const Avatar: FC<AvatarProps>;
