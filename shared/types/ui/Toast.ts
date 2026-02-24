export type ToastStatus = "success" | "error" | "information" | "action";

export interface ToastProps {
  message: string;
  status?: ToastStatus;
}
