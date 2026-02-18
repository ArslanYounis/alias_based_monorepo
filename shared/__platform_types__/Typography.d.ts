import type { ComponentProps, FC } from "react";
import type { Typography as WebTypography } from "../../web/src/ui/Typography";
import type { Typography as MobileTypography } from "../../mobile/src/ui/Typography";

export type TypographyProps =
  | ComponentProps<typeof WebTypography>
  | ComponentProps<typeof MobileTypography>;
export const Typography: FC<TypographyProps>;
