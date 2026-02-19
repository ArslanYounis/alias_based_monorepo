import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { AuditRemarksProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<AuditRemarksProps, "language">]?: ControlDefinition<AuditRemarksProps>;
} & {
  propsOverride?: ControlDefinition<AuditRemarksProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Audit Remarks",
    defaultValueAr: "Audit Remarks",
    defaultCode: 'return "Audit Remarks"',
    defaultCodeAr: 'return "Audit Remarks"',
  },
  registrationRemarks: {
    type: ["text", "code"],
    label: "Registration Remarks",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: 'return ""',
    defaultCodeAr: 'return ""',
  },
  theme: {
    type: ["select"],
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "dark",
  },
  agent: {
    type: ["code"],
    label: "Agent",
    defaultValue: {},
    defaultCode: `return {
  name: "Farzana Shah",
  email: "fshah@adrec.org",
  phone: "+971 898 1234 7654",
  image: "",
}`,
  },
  applicationDetails: {
    type: ["code"],
    label: "Application Detail",
    defaultValue: [],
    defaultCode: `return [{
  applicationNumber: "APP-001234",
  applicationDate: "2025-04-27",
  referenceNumber: "REF-56789",
}]`,
  },
  plots: {
    type: ["code"],
    label: "Plots",
    defaultValue: [],
    defaultCode: `return [{
  code: "PLT-4567",
  municipality: "Municipality Name",
  zone: "Zone 5",
  sector: "Sector A",
  address: "123 Plot Street, City Name"
}]`,
  },
  owners: {
    type: ["code"],
    label: "Owners",
    defaultValue: [],
    defaultCode: `return [{
  name: "Jane Smith",
  familyBook: "FamilyBook123",
  city: "Cityville",
  propertyCard: "PropertyCard456"
}]`,
  },
  value: {
    type: ["text", "code"],
    label: "Value",
    defaultValue: "",
    defaultCode: 'return ""',
  },
  onChange: {
    type: ["code"],
    label: "On Remarks Change",
    defaultCode: "console.log('remarks changed', eventData)",
    isEvent: true,
  },
  onOwnerClick: {
    type: ["code"],
    label: "On Owner Action Click",
    defaultCode: "console.log('owner clicked', eventData)",
    isEvent: true,
  },
  onPlotClick: {
    type: ["code"],
    label: "On Plot Action Click",
    defaultCode: "console.log('plot clicked', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createAuditRemarksConfig(
  Component: ComponentType<AuditRemarksProps>,
  icon: IconType
): ComponentConfig<AuditRemarksProps> {
  return {
    id: "auditRemarks",
    icon,
    name: "Audit Remarks",
    Component,
    controls,
  };
}
