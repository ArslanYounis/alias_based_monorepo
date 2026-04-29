import type { AgentProps } from "../Agent";
import type { IPlotCardProps } from "../PlotCard";
import type { IOwnerCardProps } from "../OwnerCard";
import type { IGenericCardProps } from "../GenericCard";
import type { IInteractionCardProps } from "../InteractionCard";
import type { IGenericCardsProps } from "../GenericCards";
import type { IGenericTableCardProps } from "../GenericTableCard";
import type { ApplicationSummaryDetailProps } from "./ApplicationSummaryDetail";
import { UploadDocumentsProps } from "@shared/types";

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
}
