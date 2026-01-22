import { ControlDefinition } from "@/types/dls.types";
import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";
import exposeComponents from "./expose.components";
import exposeFormComponents from "./expose.form-components";

type TransformedComponent = {
  icon: LucideIcon;
  name: string;
  Component: ComponentType<Record<string, unknown>>;
  defaultProps: Record<string, unknown>;
  controls: Record<
    string,
    Omit<
      ControlDefinition,
      | "defaultValue"
      | "defaultValueAr"
      | "defaultCode"
      | "defaultCodeAr"
      | "isEvent"
      | "visibility"
    >
  >;
  events: string[];
  defaultPropsCode: Record<string, string>;
  controlsVisibility: Record<
    string,
    (props: Record<string, unknown>) => boolean
  >;
};

/**
 * Transforms component configs into DLS component format compatible with service-builder
 *
 * This utility takes component configurations (like breadcrumb.config.ts, buttons.configs.ts)
 * and transforms them into the format expected by DLS.components.tsx in service-builder.
 *
 * It extracts:
 * - defaultProps: Core values from defaultValue/defaultValueAr
 * - defaultPropsCode: Code strings from defaultCode/defaultCodeAr
 * - events: List of event handlers (controls with isEvent: true)
 * - controlsVisibility: Visibility rules from control.visibility functions
 * - controls: Cleaned control definitions (type, label, options, hasArabic)
 *
 * @param configs Array of component configurations from expose.components.ts
 * @returns Object with component id as key and transformed configuration
 *
 * @example
 * const configs = [ButtonsConfigs, BreadcrumbConfigs];
 * const DLSComponents = transformDLSConfigs(configs);
 * // Returns: { button: {...}, breadcrumb: {...} }
 */
function transformDLSConfigs(
  type: "form" | "service" = "service"
): Record<string, TransformedComponent> {
  const newComponents =
    type === "form" ? exposeFormComponents : exposeComponents;
  const result: Record<string, TransformedComponent> = {};

  newComponents.forEach((config) => {
    const { id, icon, name, Component, controls } = config;

    const defaultProps: Record<string, unknown> = {};
    const defaultPropsCode: Record<string, string> = {};
    const events: string[] = [];
    const controlsVisibility: Record<
      string,
      (props: Record<string, unknown>) => boolean
    > = {};
    const transformedControls: Record<string, unknown> = {};

    // Process each control
    Object.entries(controls).forEach(([key, control]) => {
      const controlValue = control as ControlDefinition;

      // Transform control for service-builder format
      transformedControls[key] = {
        type: controlValue.type,
        label: controlValue.label,
        ...(controlValue.hasArabic && { hasArabic: true }),
        ...(controlValue.isRequired && { isRequired: true }),
        ...(controlValue.unique && { unique: true }),
        ...(controlValue.options && { options: controlValue.options }),
      };

      // Extract default core values
      if (controlValue.defaultValue !== undefined) {
        defaultProps[key] = controlValue.defaultValue;
      }
      if (controlValue.defaultValueAr !== undefined && controlValue.hasArabic) {
        defaultProps[`${key}_ar`] = controlValue.defaultValueAr;
      }

      // Extract default code values
      if (controlValue.defaultCode) {
        defaultPropsCode[key] = controlValue.defaultCode;
      }
      if (controlValue.defaultCodeAr && controlValue.hasArabic) {
        defaultPropsCode[`${key}_ar`] = controlValue.defaultCodeAr;
      }

      // Extract events
      if (controlValue.isEvent) {
        events.push(key);
      }

      // Extract visibility rules
      if (controlValue.visibility) {
        controlsVisibility[key] = controlValue.visibility;
      }
    });

    // Build the transformed component
    result[id] = {
      icon,
      name,
      Component: Component as unknown as ComponentType<Record<string, unknown>>,
      defaultProps,
      controls: transformedControls as TransformedComponent["controls"],
      events,
      defaultPropsCode,
      controlsVisibility,
    };
  });

  return result;
}

export default transformDLSConfigs;
