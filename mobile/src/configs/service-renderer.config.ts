import { transformRendererConfigs } from "@shared/utils/transform-renderer-config";
import exposeComponents from "./expose.components";
import type { ComponentConfig } from "@shared/types/dls.types";

export default transformRendererConfigs(
  exposeComponents as ComponentConfig<Record<string, unknown>>[]
);
