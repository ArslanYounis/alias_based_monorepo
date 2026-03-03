import type { ComponentProps, FC } from "react";
import type { CurrencyInput as WebCurrencyInput } from "../../web/src/ui/CurrencyInput";
import type { CurrencyInput as MobileCurrencyInput } from "../../mobile/src/ui/CurrencyInput";

export type CurrencyInputProps =
  | ComponentProps<typeof WebCurrencyInput>
  | ComponentProps<typeof MobileCurrencyInput>;
export const CurrencyInput: FC<CurrencyInputProps>;
