import type { ComponentProps, FC } from "react";
import type { ScrollContainer as WebScrollContainer } from "../../web/src/ui/ScrollContainer";
import type { ScrollContainer as MobileScrollContainer } from "../../mobile/src/ui/ScrollContainer";

export type ScrollContainerProps =
  | ComponentProps<typeof WebScrollContainer>
  | ComponentProps<typeof MobileScrollContainer>;
export const ScrollContainer: FC<ScrollContainerProps>;
