import type { ComponentProps, FC } from "react";
import type { ProfileIconStatus as WebProfileIconStatus } from "../../web/src/ui/ProfileIconStatus";
import type { ProfileIconStatus as MobileProfileIconStatus } from "../../mobile/src/ui/ProfileIconStatus";

export type ProfileIconStatusProps =
  | ComponentProps<typeof WebProfileIconStatus>
  | ComponentProps<typeof MobileProfileIconStatus>;
export const ProfileIconStatus: FC<ProfileIconStatusProps>;
