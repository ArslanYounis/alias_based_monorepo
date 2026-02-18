import type { ComponentConfig } from "@shared/types/dls.types";

/**
 * Array of all form component configurations to be exposed to service-builder
 * Add new component configs here to make them available in the form builder
 */
const exposeFormComponents: ComponentConfig<Record<string, unknown>>[] = [];

export default exposeFormComponents;
