import type { ComponentProps, FC } from "react";
import type { IconButton as WebIconButton } from "../../web/src/ui/IconButton";
import type { IconButton as MobileIconButton } from "../../mobile/src/ui/IconButton";

export type IconButtonProps =
  | ComponentProps<typeof WebIconButton>
  | ComponentProps<typeof MobileIconButton>;
export const IconButton: FC<IconButtonProps>;
