import type { ComponentConfig } from "@shared/types/dls.types";
import { transformDLSConfigs as transform } from "@shared/utils/transform-dls-config";
import exposeComponents from "./expose.components";
import exposeFormComponents from "./expose.form-components";

function transformDLSConfigs(
  type: "form" | "service" = "service"
): ReturnType<typeof transform> {
  const configs = type === "form" ? exposeFormComponents : exposeComponents;
  return transform(
    configs as ComponentConfig<Record<string, unknown>>[]
  );
}

export default transformDLSConfigs;
