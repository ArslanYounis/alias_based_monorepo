import type { ComponentProps, FC } from "react";
import type { NumberInput as WebNumberInput } from "../../web/src/ui/NumberInput";
import type { NumberInput as MobileNumberInput } from "../../mobile/src/ui/NumberInput";

export type NumberInputProps =
  | ComponentProps<typeof WebNumberInput>
  | ComponentProps<typeof MobileNumberInput>;
export const NumberInput: FC<NumberInputProps>;
