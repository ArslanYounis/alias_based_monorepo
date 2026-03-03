import type { ComponentProps, FC } from "react";
import type { bk_TextInput as Webbk_TextInput } from "../../web/src/ui/bk_TextInput";
import type { bk_TextInput as Mobilebk_TextInput } from "../../mobile/src/ui/bk_TextInput";

export type bk_TextInputProps =
  | ComponentProps<typeof Webbk_TextInput>
  | ComponentProps<typeof Mobilebk_TextInput>;
export const bk_TextInput: FC<bk_TextInputProps>;
