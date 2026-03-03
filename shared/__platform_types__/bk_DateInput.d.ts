import type { ComponentProps, FC } from "react";
import type { bk_DateInput as Webbk_DateInput } from "../../web/src/ui/bk_DateInput";
import type { bk_DateInput as Mobilebk_DateInput } from "../../mobile/src/ui/bk_DateInput";

export type bk_DateInputProps =
  | ComponentProps<typeof Webbk_DateInput>
  | ComponentProps<typeof Mobilebk_DateInput>;
export const bk_DateInput: FC<bk_DateInputProps>;
