export interface AuditAgent {
  name: string;
  email: string;
  phone: string;
  image: string;
}

export interface AuditApplicationDetail {
  applicationNumber: string;
  applicationDate: string;
  referenceNumber: string;
}

export interface AuditPlot {
  plotId?: string;
  plotArgs?: string;
  code: string;
  municipality: string;
  zone: string;
  sector: string;
  address: string;
}

export interface AuditOwner {
  ownerId?: string;
  ownerArgs?: string;
  name: string;
  familyBook: string;
  city: string;
  propertyCard: string;
}

export interface AuditDocument {
  documentNameA: string;
  documentNameE: string;
  downloadUrl: string;
}

export interface ApprovalModalProps {
  agent: AuditAgent;
  title: string;
  title_ar?: string;
  language?: "en" | "ar";
  theme?: "light" | "dark";
  applicationDetails: AuditApplicationDetail[];
  plots: AuditPlot[];
  owners: AuditOwner[];
  documents: AuditDocument[];
  onOwnerClick?: (data: {
    ownerData: AuditOwner;
    action: "view" | "edit" | "plot";
  }) => void;
  onPlotClick?: (data: { PlotData: AuditPlot; action: "view" }) => void;
  onDocumentPress?: (downloadUrl: string) => void;
}

export type AuditRemarksProps = {
  value?: string;
  onChange?: (val: string) => void;
  registrationRemarks?: string;
};
