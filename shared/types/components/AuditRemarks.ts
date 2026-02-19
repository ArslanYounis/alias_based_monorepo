export interface AuditRemarksAgent {
  name: string;
  email: string;
  phone: string;
  image?: string;
}

export interface AuditRemarksApplicationDetail {
  applicationNumber: string;
  applicationDate: string;
  referenceNumber: string;
}

export interface AuditRemarksPlot {
  code: string;
  municipality: string;
  zone: string;
  sector: string;
  address: string;
}

export interface AuditRemarksOwner {
  name: string;
  familyBook: string;
  city: string;
  propertyCard: string;
}

export interface AuditRemarksProps {
  title?: string;
  title_ar?: string;
  registrationRemarks?: string;
  registrationRemarks_ar?: string;
  theme?: "light" | "dark";
  agent?: AuditRemarksAgent;
  applicationDetails?: AuditRemarksApplicationDetail[];
  plots?: AuditRemarksPlot[];
  owners?: AuditRemarksOwner[];
  value?: string;
  onChange?: (eventData: unknown) => void;
  onOwnerClick?: (eventData: unknown) => void;
  onPlotClick?: (eventData: unknown) => void;
  language?: "en" | "ar";
}
