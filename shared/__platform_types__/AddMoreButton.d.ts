import type { ComponentProps, FC } from "react";
import type { AddMoreButton as WebAddMoreButton } from "../../web/src/ui/AddMoreButton";
import type { AddMoreButton as MobileAddMoreButton } from "../../mobile/src/ui/AddMoreButton";

export type AddMoreButtonProps =
  | ComponentProps<typeof WebAddMoreButton>
  | ComponentProps<typeof MobileAddMoreButton>;
export const AddMoreButton: FC<AddMoreButtonProps>;
