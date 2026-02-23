export interface PlotInfoItem {
  label: string;
  label_ar?: string;
  value: string;
  value_ar?: string;
}

export interface OwnerInfo {
  name: string;
  details: PlotInfoItem[];
}

export interface ViewPlotDetailProps {
  plotIds?: string[];
  plotCode?: string;
  plotCode_ar?: string;
  plotTitle?: string;
  plotTitle_ar?: string;
  plotImage?: string;
  plotLeftDetails?: PlotInfoItem[];
  plotBottomDetails?: PlotInfoItem[];
  owner?: OwnerInfo;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  viewButtonText?: string;
  viewButtonText_ar?: string;
  ownerText?: string;
  ownerText_ar?: string;
  documentsText?: string;
  documentsText_ar?: string;
  uaeIdText?: string;
  uaeIdText_ar?: string;
  passportText?: string;
  passportText_ar?: string;
  showOwnerDetails?: boolean;
}
