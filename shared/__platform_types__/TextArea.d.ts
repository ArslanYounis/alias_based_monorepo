import type { ComponentProps, FC } from "react";
import type { TextArea as WebTextArea } from "../../web/src/ui/TextArea";
import type { TextArea as MobileTextArea } from "../../mobile/src/ui/TextArea";

export type TextAreaProps =
  | ComponentProps<typeof WebTextArea>
  | ComponentProps<typeof MobileTextArea>;
export const TextArea: FC<TextAreaProps>;
