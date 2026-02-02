import React from "react";
import CrossIcon from "@/assets/svg/crossIcon";
import BackDrawer from "@/assets/svg/backDrawer";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export type DrawerSize = "layer1" | "layer2" | "layer3";

export interface CustomDrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "left" | "right";
  size?: DrawerSize;
  backgroundClassName?: string;
  showCloseButton?: boolean;
  closeButtonOffsetClass?: string;
  className?: string;
  dismissible?: boolean;
  children?: React.ReactNode;
  language?: "en" | "ar";
  header?: React.ReactNode;
}

/**
 * Layer configuration for background and responsive width.
 * - On mobile (default): 360px
 * - On sm+ (>=640px): use desktop width
 */
const drawerLayerStyles: Record<
  DrawerSize,
  { widthClass: string; shadow: string; background: string }
> = {
  layer1: {
    widthClass: "720px",
    shadow: "var(--Shadow-Modal-Layer-1)",
    background: "bg-structure-modal-level-1",
  },
  layer2: {
    widthClass: "672px",
    shadow: "var(--Shadow-Modal-Layer-1)",
    background: "bg-structure-modal-level-2",
  },
  layer3: {
    widthClass: "642px",
    shadow: "var(--Shadow-Modal-Layer-1)",
    background: "bg-structure-modal-level-3",
  },
};

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onOpenChange,
  direction,
  size = "layer1",
  backgroundClassName,
  showCloseButton = true,
  closeButtonOffsetClass,
  className,
  dismissible = false,
  children,
  language = "en",
  header,
}) => {
  const dir = direction ?? (language === "ar" ? "left" : "right");

  const { widthClass, shadow, background } = drawerLayerStyles[size];
  const bgClass = backgroundClassName ?? background;

  const defaultOffset = language === "ar" ? "ml-12!" : "me-8";
  const closeOffset = closeButtonOffsetClass ?? defaultOffset;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      dismissible={dismissible}
      direction={dir}
    >
      <DrawerContent
        className={`${bgClass} ${className ?? "border-none"}`}
        style={{
          width: widthClass,
          maxWidth: widthClass,
          boxShadow: shadow,
        }}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            aria-label="Close drawer"
            className={`cursor-pointer my-4 ${
              language === "ar" ? "mr-auto" : "ml-auto"
            } ${closeOffset}`}
            onClick={() => onOpenChange?.(false)}
          >
            {size === "layer1" ? (
              <CrossIcon className="text-text-default" />
            ) : (
              <BackDrawer
                className={`text-text-default ${
                  language === "ar" ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
        )}

        {/* Optional header */}
        {header && <div className="px-xxxl pb-lg">{header}</div>}

        {/* Drawer body */}
        <div className="px-xxxl gap-xl overflow-y-auto pb-xl">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};
