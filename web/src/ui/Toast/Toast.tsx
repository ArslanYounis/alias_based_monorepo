import type { ToastProps, ToastStatus } from "@shared/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CrossIconSvg from "@/assets/svg/CrossIconSvg";
import ToastAction from "@/assets/svg/toast/action";
import ToastInformation from "@/assets/svg/toast/information";
import ToastError from "@/assets/svg/toast/error";
import ToastSuccess from "@/assets/svg/toast/success";

export type { ToastProps, ToastStatus };

const AUTO_HIDE_MS = 5000;

const getStyles = (status: ToastStatus) => {
  switch (status) {
    case "success":
      return {
        bg: "bg-status-success-light",
        Icon: () => <ToastSuccess className="text-status-success-solid" />,
      };
    case "error":
      return {
        bg: "bg-status-failed-light",
        Icon: () => <ToastError className="text-status-failed-solid" />,
      };
    case "information":
      return {
        bg: "bg-status-pending-light",
        Icon: () => (
          <ToastInformation className="text-status-pending-solid" />
        ),
      };
    case "action":
      return {
        bg: "bg-status-action-light",
        Icon: () => <ToastAction className="text-status-action-solid" />,
      };
    default:
      return {
        bg: "bg-gray-100",
        Icon: () => null,
      };
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  status = "success",
}) => {
  const { bg, Icon } = getStyles(status);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current as unknown as number);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, AUTO_HIDE_MS);
  }, [clearTimer]);

  useEffect(() => {
    setVisible(true);
    startTimer();
    return () => {
      clearTimer();
    };
  }, [status, message, startTimer, clearTimer]);

  useEffect(() => {
    if (visible === false) {
      clearTimer();
    }
  }, [visible, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  if (!visible) return null;

  return (
    <div
      className={`h-xxl w-full px-xxxl py-s gap-m ${bg} flex justify-between items-center`}
    >
      <div className="flex items-center gap-l">
        <Icon />
        <p className="text-text-default text-s">{message}</p>
      </div>
      <CrossIconSvg
        className="cursor-pointer text-Dark-9 shrink-0 w-[18px] h-[18px]"
        onClick={() => setVisible(false)}
      />
    </div>
  );
};
