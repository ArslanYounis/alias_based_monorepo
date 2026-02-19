import { FileBarChartIcon } from "lucide-react";
import { createNewApplicationSummaryConfig } from "@shared/configs";
import { NewApplicationSummary } from "./NewApplicationSummary";

export const newApplicationSummaryConfig = createNewApplicationSummaryConfig(
  NewApplicationSummary,
  FileBarChartIcon
);
