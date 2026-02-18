import type { ComponentProps, FC } from "react";
import type { Text as WebText } from "../../web/src/ui/Text";
import type { Text as MobileText } from "../../mobile/src/ui/Text";

export type TextProps =
  | ComponentProps<typeof WebText>
  | ComponentProps<typeof MobileText>;
export const Text: FC<TextProps>;
