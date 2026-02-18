import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

type AnyComponentConfig = ComponentConfig<Record<string, unknown>>;

export type TransformedComponent = {
  icon: IconType;
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
 * Transforms component configs into DLS component format compatible with service-builder.
 * Used by both web (federation) and mobile (npm) to produce the same shape.
 */
export function transformDLSConfigs(
  configs: AnyComponentConfig[]
): Record<string, TransformedComponent> {
  const result: Record<string, TransformedComponent> = {};

  (configs as AnyComponentConfig[]).forEach((config) => {
    const { id, icon, name, Component, controls } = config;

    const defaultProps: Record<string, unknown> = {};
    const defaultPropsCode: Record<string, string> = {};
    const events: string[] = [];
    const controlsVisibility: Record<
      string,
      (props: Record<string, unknown>) => boolean
    > = {};
    const transformedControls: Record<string, unknown> = {};

    Object.entries(controls).forEach(([key, control]) => {
      const controlValue = control as ControlDefinition;

      transformedControls[key] = {
        type: controlValue.type,
        label: controlValue.label,
        ...(controlValue.hasArabic && { hasArabic: true }),
        ...(controlValue.isRequired && { isRequired: true }),
        ...(controlValue.unique && { unique: true }),
        ...(controlValue.options && { options: controlValue.options }),
      };

      if (controlValue.defaultValue !== undefined) {
        defaultProps[key] = controlValue.defaultValue;
      }
      if (controlValue.defaultValueAr !== undefined && controlValue.hasArabic) {
        defaultProps[`${key}_ar`] = controlValue.defaultValueAr;
      }

      if (controlValue.defaultCode) {
        defaultPropsCode[key] = controlValue.defaultCode;
      }
      if (controlValue.defaultCodeAr && controlValue.hasArabic) {
        defaultPropsCode[`${key}_ar`] = controlValue.defaultCodeAr;
      }

      if (controlValue.isEvent) {
        events.push(key);
      }

      if (controlValue.visibility) {
        controlsVisibility[key] = controlValue.visibility;
      }
    });

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
