import type { ComponentProps, FC } from "react";
import type { ApplicationCard as WebApplicationCard } from "../../web/src/ui/ApplicationCard";
import type { ApplicationCard as MobileApplicationCard } from "../../mobile/src/ui/ApplicationCard";

export type ApplicationCardProps =
  | ComponentProps<typeof WebApplicationCard>
  | ComponentProps<typeof MobileApplicationCard>;
export const ApplicationCard: FC<ApplicationCardProps>;
