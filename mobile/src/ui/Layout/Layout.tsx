import React from "react";
import { Layout as SharedLayout } from "@shared/components/Layout";
import { Container } from "~/src/ui/Container";
import { Header } from "~/src/ui/Header";
import { MenuColumn } from "~/src/ui/MenuColumn";
import { Footer } from "~/src/ui/Footer";
import { Toast } from "~/src/ui/Toast";
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
