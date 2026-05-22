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
  title?: string;
  title_ar?: string;
  applicationNumber?: string;
  applicationNumber_ar?: string;
  applicationDate?: string;
  applicationDate_ar?: string;
  referenceNumber?: string;
  referenceNumber_ar?: string;
  buttonTitle?: string;
  buttonTitle_ar?: string;
  buttonType?: "primary" | "secondary" | "tertiary" | "text-link" | "delete";
  showButton?: boolean;
  onButtonClick?: () => void;
  onReferenceNumberChange?: (value: string) => void;
  language?: "en" | "ar";
}
