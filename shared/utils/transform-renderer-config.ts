import type { ComponentConfig } from "@shared/types/dls.types";
import type { ComponentType } from "react";

type AnyComponentConfig = ComponentConfig<Record<string, unknown>>;

/**
 * Transforms component configs into a simple component map for service-renderer.
 * Used by both web (federation) and mobile (npm) to produce the same shape.
 */
export function transformRendererConfigs(
  configs: AnyComponentConfig[]
): Record<string, ComponentType<Record<string, unknown>>> {
  const result: Record<string, ComponentType<Record<string, unknown>>> = {};

  (configs as AnyComponentConfig[]).forEach((config) => {
    const { id, Component } = config;
    result[id] = Component as unknown as ComponentType<
      Record<string, unknown>
    >;
  });

  return result;
}
