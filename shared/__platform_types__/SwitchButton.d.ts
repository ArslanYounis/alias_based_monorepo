import type { ComponentProps, FC } from "react";
import type { SwitchButton as WebSwitchButton } from "../../web/src/ui/SwitchButton";
import type { SwitchButton as MobileSwitchButton } from "../../mobile/src/ui/SwitchButton";

export type SwitchButtonProps =
  | ComponentProps<typeof WebSwitchButton>
  | ComponentProps<typeof MobileSwitchButton>;
export const SwitchButton: FC<SwitchButtonProps>;
