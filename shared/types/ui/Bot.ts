export interface BotProps {
  language?: "en" | "ar";
  message_ar?: string;
  message?: string;
  status?: "close" | "open";
  className?: string;
  onClick?: (newStatus: "open" | "close") => void;
}
