import type { ComponentProps, FC } from "react";
import type { AddButton as WebAddButton } from "../../web/src/ui/AddButton";
import type { AddButton as MobileAddButton } from "../../mobile/src/ui/AddButton";

export type AddButtonProps =
  | ComponentProps<typeof WebAddButton>
  | ComponentProps<typeof MobileAddButton>;
export const AddButton: FC<AddButtonProps>;
