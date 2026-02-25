import React from "react";
import { Layout as SharedLayout } from "@shared/components/Layout";
import { Container } from "@/ui/Container";
import { Header } from "@/ui/Header";
import { MenuColumn } from "@/ui/MenuColumn";
import { Footer } from "@/ui/Footer";
import { Toast } from "@/ui/Toast";
import type { LayoutProps, ToastProps } from "@shared/types";

export type { LayoutProps };

export const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <SharedLayout
      {...props}
      Container={Container}
      Header={Header}
      Sidebar={MenuColumn}
      Footer={Footer}
      Toast={Toast as React.ComponentType<ToastProps>}
    />
  );
};
