import type { ComponentProps, FC } from "react";
import type { StatusBalls as WebStatusBalls } from "../../web/src/ui/StatusBalls";
import type { StatusBalls as MobileStatusBalls } from "../../mobile/src/ui/StatusBalls";

export type StatusBallsProps =
  | ComponentProps<typeof WebStatusBalls>
  | ComponentProps<typeof MobileStatusBalls>;
export const StatusBalls: FC<StatusBallsProps>;
