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
