import { ComponentType } from "react";
import { LucideIcon } from "lucide-react";

/**
 * Control type options for component configuration
 */
export type ControlType =
  | "text"
  | "code"
  | "boolean"
  | "number"
  | "select"
  | "propsOverride"
  | "bindingData"
  | "formFields"
  | "icon";

/**
 * Control definition for a component property
 * Only type and label are required, all other fields are optional
 */
export interface ControlDefinition<TProps = Record<string, unknown>> {
  type: ControlType[];
  label: string;
  hasArabic?: boolean;
  options?: string[];
  defaultValue?: unknown;
  defaultValueAr?: unknown;
  defaultCode?: string;
  defaultCodeAr?: string;
  isEvent?: boolean;
  visibility?: (props: TProps) => boolean;
  isRequired?: boolean;
  unique?: boolean;
}

/**
 * Controls configuration where all keys are optional except what user chooses
 * Props come from component props for IntelliSense
 * Excludes 'language' prop as it's handled by the system
 */
export type ControlsConfig<TProps = Record<string, unknown>> = Partial<{
  [K in Exclude<keyof TProps, "language">]: ControlDefinition<TProps>;
}> & {
  propsOverride?: ControlDefinition<TProps>;
  // gonna use for forms to track input values
  fieldKey?: ControlDefinition<TProps>;
  bindingData?: ControlDefinition<TProps>;
};

/**
 * Generic component configuration with IntelliSense from component props
 */
export interface ComponentConfig<TProps = Record<string, unknown>> {
  id: string;
  icon: LucideIcon;
  name: string;
  Component: ComponentType<TProps>;
  controls: ControlsConfig<TProps>;
}

/**
 * Collection of component configurations
 */
export type ComponentsCollection<T extends Record<string, ComponentConfig>> = T;

/**
 * Extract props type from a component config
 */
export type PropsOf<T> = T extends ComponentConfig<infer Props> ? Props : never;

/**
 * Helper to create strongly-typed component config from component props
 */
export type CreateComponentConfig<TProps = Record<string, unknown>> =
  ComponentConfig<TProps>;
