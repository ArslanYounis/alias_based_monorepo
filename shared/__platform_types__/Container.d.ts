import type { ComponentProps, FC } from "react";
import type { Container as WebContainer } from "../../web/src/ui/Container";
import type { Container as MobileContainer } from "../../mobile/src/ui/Container";

export type ContainerProps =
  | ComponentProps<typeof WebContainer>
  | ComponentProps<typeof MobileContainer>;
export const Container: FC<ContainerProps>;
