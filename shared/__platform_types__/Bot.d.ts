import type { ComponentProps, FC } from "react";
import type { Bot as WebBot } from "../../web/src/ui/Bot";
import type { Bot as MobileBot } from "../../mobile/src/ui/Bot";

export type BotProps =
  | ComponentProps<typeof WebBot>
  | ComponentProps<typeof MobileBot>;
export const Bot: FC<BotProps>;
