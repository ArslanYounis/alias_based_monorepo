import type { AgentProps } from "../Agent";
import type { IPlotCardProps } from "../PlotCard";
import type { IOwnerCardProps } from "../OwnerCard";
import type { IGenericCardProps } from "../GenericCard";
import type { IInteractionCardProps } from "../InteractionCard";
import type { IGenericCardsProps } from "../GenericCards";
import type { IGenericTableCardProps } from "../GenericTableCard";
import type { ApplicationSummaryDetailProps } from "./ApplicationSummaryDetail";
import type React from "react";

export type Language = "en" | "ar";
export type ApplicationType = "Compact" | "Standard";
export type UiBlockType =
  | "agent"
  | "applicationDetails"
  | "plot"
  | "owners"
  | "genericCard"
  | "genericCards"
  | "genericTableCard"
  | "interactionHistory"
  | "documents";

export interface DocumentConfig {
  documentName?: string;
  documentName_ar?: string;
  allowedTypes?: string[];
  fileTypeErrorMessage?: string;
  fileTypeErrorMessage_ar?: string;
  fileSize?: number;
  fileSizeErrorMessage?: string;
  fileSizeErrorMessage_ar?: string;
  isDark?: boolean;
  uploadUrl?: string;
  downloadUrl?: string;
  isUploaded?: boolean;
}

export interface UploadDocumentsProps {
  documents: DocumentConfig[];
  theme?: "light" | "dark";
  language?: Language;
  type?: "default" | "base";
  onFileChange?: (props: { file: File | null; uploadUrl: string }) => void;
}

// New UI Block structure
export interface UiBlock {
  title?: string;
  title_ar?: string;
  type: UiBlockType;
  data:
  | AgentProps
  | ApplicationSummaryDetailProps
  | IPlotCardProps
  | IOwnerCardProps
  | IGenericCardProps
  | IGenericCardsProps
  | IGenericTableCardProps
  | IInteractionCardProps
  | UploadDocumentsProps;
}

export interface ApplicationSummaryProps {
  title?: string;
  title_ar?: string;
  language?: Language;
  data?: UiBlock[][];
  platform?: "web" | "mobile";
  /** Optional platform-specific Documents/UploadDocuments component injected from web/mobile */
  DocumentsComponent?: React.ComponentType<UploadDocumentsProps & { language?: Language }>;
}
