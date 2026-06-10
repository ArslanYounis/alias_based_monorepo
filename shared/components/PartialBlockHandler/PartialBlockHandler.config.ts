/* istanbul ignore file */
import type { ComponentConfig, IconType } from "@shared/types/dls.types";
import type { PartialBlockHandlerProps } from "./PartialBlockHandler";
import type { ComponentType } from "react";

const controls: ComponentConfig<PartialBlockHandlerProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Update Partial Blocks",
    defaultCode: "return 'Update Partial Blocks'",
  },
  existingBlocks: {
    type: ["code"],
    label: "Existing Blocks (workflow ids)",
    defaultCode: "// Pre-tagged & pre-selected workflow ids\nreturn [];",
  },
  preselectedBlocks: {
    type: ["code"],
    label: "Pre-selected Blocks (workflow ids, untagged)",
    defaultCode: "return []",
  },
  existingTagLabel: {
    type: ["text", "code"],
    label: "Existing Tag Label",
    hasArabic: true,
    defaultValue: "Existing Block",
    defaultCode: "return 'Existing Block'",
  },
  searchPlaceholder: {
    type: ["text", "code"],
    label: "Search Placeholder",
    hasArabic: true,
    defaultValue: "Search",
    defaultCode: "return 'Search'",
  },
  submitLabel: {
    type: ["text", "code"],
    label: "Submit Label",
    hasArabic: true,
    defaultValue: "Update",
    defaultCode: "return 'Update'",
  },
  onSubmit: {
    type: ["code"],
    label: "On Submit",
    isEvent: true,
    defaultCode:
      "// eventData = selected workflows [{ workflowID, workflowNameEn, groupKey, isExisting, ... }]\nconsole.log(eventData);",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createPartialBlockHandlerConfig(
  Component: ComponentType<PartialBlockHandlerProps>,
  icon: IconType,
): ComponentConfig<PartialBlockHandlerProps> {
  return {
    id: "partialBlockHandler",
    icon,
    name: "Partial Block Handler",
    Component,
    controls,
  };
}
