export interface FooterProps {
  showLogo?: boolean;
  logoType?: "full" | "icon" | "hub";
  logoClassName?: string;
  logoWidth?: number | string;
  logoHeight?: number | string;
  showBot?: boolean;
  language?: "en" | "ar";
  botMessage?: string;
  botMessage_ar?: string;
  botStatus?: "close" | "open";
  botClassName?: string;
}
