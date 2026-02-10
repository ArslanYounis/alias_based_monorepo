import type { ComponentType } from "react";

/**
 * Icon type usable by both web (lucide-react) and mobile (e.g. lucide-react-native).
 * Platforms pass their own icon component when building configs.
 */
export type IconType = ComponentType<Record<string, unknown>>;

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
  fieldKey?: ControlDefinition<TProps>;
  bindingData?: ControlDefinition<TProps>;
};

/**
 * Generic component configuration with IntelliSense from component props
 * Uses IconType so both web and mobile can pass their icon implementation.
 */
export interface ComponentConfig<TProps = Record<string, unknown>> {
  id: string;
  icon: IconType;
  name: string;
  Component: ComponentType<TProps>;
  controls: ControlsConfig<TProps>;
}

export type ComponentsCollection<T extends Record<string, ComponentConfig>> = T;
export type PropsOf<T> = T extends ComponentConfig<infer Props> ? Props : never;
export type CreateComponentConfig<TProps = Record<string, unknown>> =
  ComponentConfig<TProps>;
