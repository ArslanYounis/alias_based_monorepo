import type { ComponentProps, FC } from "react";
import type { Fields as WebFields } from "../../web/src/ui/Fields";
import type { Fields as MobileFields } from "../../mobile/src/ui/Fields";

export type FieldsProps =
  | ComponentProps<typeof WebFields>
  | ComponentProps<typeof MobileFields>;
export const Fields: FC<FieldsProps>;
