import type { ComponentProps, FC } from "react";
import type { Tooltip as WebTooltip } from "../../web/src/ui/Tooltip";
import type { Tooltip as MobileTooltip } from "../../mobile/src/ui/Tooltip";

export type TooltipProps =
  | ComponentProps<typeof WebTooltip>
  | ComponentProps<typeof MobileTooltip>;
export const Tooltip: FC<TooltipProps>;
