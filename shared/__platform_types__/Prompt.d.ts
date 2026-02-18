import type { ComponentProps, FC } from "react";
import type { Prompt as WebPrompt } from "../../web/src/ui/Prompt";
import type { Prompt as MobilePrompt } from "../../mobile/src/ui/Prompt";

export type PromptProps =
  | ComponentProps<typeof WebPrompt>
  | ComponentProps<typeof MobilePrompt>;
export const Prompt: FC<PromptProps>;
