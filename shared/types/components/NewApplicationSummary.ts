export interface NewApplicationSummaryProps {
  title?: string;
  title_ar?: string;
  applicationId?: string;
  onPressPlotView?: () => void;
  onPressOwnerAction?: (action: unknown, owner: unknown) => void;
  language?: "en" | "ar";
}
