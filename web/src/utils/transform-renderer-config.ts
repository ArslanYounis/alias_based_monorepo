import { ComponentType } from "react";
import exposeComponents from "./expose.components";
import exposeFormComponents from "./expose.form-components";

/**
 * Transforms component configs into a simple component map for service-renderer
 *
 * This utility creates a mapping of component IDs to their actual Component references.
 * Used by service-renderer to dynamically render components based on their ID.
 *
 * @returns Object with component id as key and Component reference as value
 *
 * @example
 * const Components = transformRendererConfigs();
 * // Returns: { button: ButtonsComponent, breadcrumb: BreadcrumbComponent }
 *
 * // Usage in renderer:
 * const ComponentToRender = Components[componentId];
 * return <ComponentToRender {...props} />;
 */
function transformRendererConfigs(
  type: "form" | "service" = "service"
): Record<string, ComponentType<Record<string, unknown>>> {
  const newComponents =
    type === "form" ? exposeFormComponents : exposeComponents;
  const result: Record<string, ComponentType<Record<string, unknown>>> = {};

  newComponents.forEach((config) => {
    const { id, Component } = config;
    result[id] = Component as unknown as ComponentType<Record<string, unknown>>;
  });

  return result;
}

export default transformRendererConfigs;
