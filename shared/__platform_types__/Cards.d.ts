import type { ComponentProps, FC } from "react";
import type { Cards as WebCards } from "../../web/src/ui/Cards";
import type { Cards as MobileCards } from "../../mobile/src/ui/Cards";

export type CardsProps =
  | ComponentProps<typeof WebCards>
  | ComponentProps<typeof MobileCards>;
export const Cards: FC<CardsProps>;
