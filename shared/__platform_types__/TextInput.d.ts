import type { ComponentProps, FC } from "react";
import type { TextInput as WebTextInput } from "../../web/src/ui/TextInput";
import type { TextInput as MobileTextInput } from "../../mobile/src/ui/TextInput";

export type TextInputProps =
  | ComponentProps<typeof WebTextInput>
  | ComponentProps<typeof MobileTextInput>;
export const TextInput: FC<TextInputProps>;
