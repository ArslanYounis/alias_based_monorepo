import type { ComponentProps, FC } from "react";
import type { Toast as WebToast } from "../../web/src/ui/Toast";
import type { Toast as MobileToast } from "../../mobile/src/ui/Toast";

export type ToastProps =
  | ComponentProps<typeof WebToast>
  | ComponentProps<typeof MobileToast>;
export const Toast: FC<ToastProps>;
