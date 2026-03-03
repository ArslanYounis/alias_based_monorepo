import type { ComponentProps, FC } from "react";
import type { PhoneInput as WebPhoneInput } from "../../web/src/ui/PhoneInput";
import type { PhoneInput as MobilePhoneInput } from "../../mobile/src/ui/PhoneInput";

export type PhoneInputProps =
  | ComponentProps<typeof WebPhoneInput>
  | ComponentProps<typeof MobilePhoneInput>;
export const PhoneInput: FC<PhoneInputProps>;
