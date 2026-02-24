import type { ToastProps, ToastStatus } from "@shared/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ToastSuccessIcon from "~/assets/svg/icons/toast/Success";
import ToastErrorIcon from "~/assets/svg/icons/toast/Error";
import ToastInformationIcon from "~/assets/svg/icons/toast/Information";
import ToastActionIcon from "~/assets/svg/icons/toast/Action";

export type { ToastProps, ToastStatus };

const AUTO_HIDE_MS = 5000;

const STATUS_COLORS: Record<
  ToastStatus,
  { bg: string; iconColor: string; Icon: React.FC<{ color?: string; width?: number; height?: number }> }
> = {
  success: {
    bg: "bg-status-success-light",
    iconColor: "#2b8a3e",
    Icon: ToastSuccessIcon,
  },
  error: {
    bg: "bg-status-failed-light",
    iconColor: "#ee3e43",
    Icon: ToastErrorIcon,
  },
  information: {
    bg: "bg-status-pending-light",
    iconColor: "#1864ab",
    Icon: ToastInformationIcon,
  },
  action: {
    bg: "bg-status-action-light",
    iconColor: "#d0a621",
    Icon: ToastActionIcon,
  },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  status = "success",
}) => {
  const config = STATUS_COLORS[status] ?? STATUS_COLORS.success;
  const { bg, iconColor, Icon } = config;
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
    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
  }, [clearTimer]);

  useEffect(() => {
    setVisible(true);
    startTimer();
    return () => clearTimer();
  }, [status, message, startTimer, clearTimer]);

  useEffect(() => {
    if (visible === false) clearTimer();
  }, [visible, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  if (!visible) return null;

  return (
    <View
      className={`h-12 flex-row items-center justify-between px-4 py-2 gap-4 ${bg}`}
    >
      <View className="flex-row items-center gap-4 flex-1">
        <Icon color={iconColor} width={24} height={24} />
        <Text className="text-text-default text-s flex-1">{message}</Text>
      </View>
      <TouchableOpacity
        onPress={() => setVisible(false)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        className="w-9 h-9 items-center justify-center"
      >
        <Text className="text-dark-9 text-lg font-medium">×</Text>
      </TouchableOpacity>
    </View>
  );
};
