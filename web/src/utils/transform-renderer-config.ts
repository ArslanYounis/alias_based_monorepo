import type { ComponentConfig } from "@shared/types/dls.types";
import { transformRendererConfigs as transform } from "@shared/utils/transform-renderer-config";
import exposeComponents from "./expose.components";
import exposeFormComponents from "./expose.form-components";

function transformRendererConfigs(
  type: "form" | "service" = "service"
): ReturnType<typeof transform> {
  const configs = type === "form" ? exposeFormComponents : exposeComponents;
  return transform(
    configs as ComponentConfig<Record<string, unknown>>[]
  );
}

export default transformRendererConfigs;
