export interface FooterProps {
  showLogo?: boolean;
  logoType?: "full" | "icon" | "hub";
  logoWidth?: number | string;
  logoHeight?: number | string;
  logoClassName?: string;
  showBot?: boolean;
  language?: "en" | "ar";
  botMessage?: string;
  botMessage_ar?: string;
  botStatus?: "close" | "open";
  botClassName?: string;
  active?: string;
  onPressMenu?: (menuItem: string) => void;
}
