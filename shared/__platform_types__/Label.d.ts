import type { ComponentProps, FC } from "react";
import type { Label as WebLabel } from "../../web/src/ui/Label";
import type { Label as MobileLabel } from "../../mobile/src/ui/Label";

export type LabelProps =
  | ComponentProps<typeof WebLabel>
  | ComponentProps<typeof MobileLabel>;
export const Label: FC<LabelProps>;
