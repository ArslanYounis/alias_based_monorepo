import { FileBarChartIcon } from "lucide-react";
import { createApplicationSummaryConfig } from "@shared/configs";
import { ApplicationSummary } from "./ApplicationSummary";

export const applicationSummaryConfig = createApplicationSummaryConfig(
  ApplicationSummary,
  FileBarChartIcon
);
