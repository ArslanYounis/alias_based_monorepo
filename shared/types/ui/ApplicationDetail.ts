// Owner information
export interface ApplicationOwner {
  ownerId: string;
  ownerNameE: string;
  ownerNameA: string;
}

// Plot information
export interface ApplicationPlot {
  plotId: string;
  plotNumber: string;
}

// Step / workflow information
export interface ApplicationStep {
  stepConst: string;
  status: number;
  actionDate: string;
  actionUser?: {
    userNameE: string;
    userNameA: string;
  };
}

// Document attachment
export interface ApplicationAttachment {
  downloadUrl: string;
}

// Document information
export interface ApplicationDocumentItem {
  documentNameE: string;
  documentNameA: string;
  attachmentList: ApplicationAttachment[];
}

// Application info
export interface ApplicationInfo {
  applicationNumber: string;
  applicationCreatedDate: string;
  applicationReferenceNumber: string;
}

// Full API response shape (mirrors ADREC application.types.ts)
export interface ApplicationDetailsApiResponse {
  result: {
    application: ApplicationInfo;
    owners: ApplicationOwner[];
    plot: ApplicationPlot;
    steps: ApplicationStep[];
    documents: ApplicationDocumentItem[];
  };
}

// Props for the shared ApplicationDetail component
export interface ApplicationDetailProps {
  applicationId: string;
  applicationTitle: string;
  applicationTitle_ar: string;
  language: "en" | "ar";
  theme?: "light" | "dark";
  onOwnerClick?: (data: {
    ownerData: ApplicationOwner;
    action: "view" | "edit" | "plot";
  }) => void;
  onPlotClick?: (data: {
    PlotData: ApplicationPlot;
    action: "view";
  }) => void;
  /** Platform-injected: replaces window.open for document download links */
  onDocumentOpen?: (url: string) => void;
}
