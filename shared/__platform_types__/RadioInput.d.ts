import type { ComponentProps, FC } from "react";
import type { RadioInput as WebRadioInput } from "../../web/src/ui/RadioInput";
import type { RadioInput as MobileRadioInput } from "../../mobile/src/ui/RadioInput";

export type RadioInputProps =
  | ComponentProps<typeof WebRadioInput>
  | ComponentProps<typeof MobileRadioInput>;
export const RadioInput: FC<RadioInputProps>;
