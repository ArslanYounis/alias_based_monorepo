import { SearchIcon } from "lucide-react";
import type { ComponentConfig } from "@/types/dls.types";
import {
  PlotSearch,
  type PlotSearchProps,
} from "@shared/components/PlotSearch";

const PlotSearchConfigs: ComponentConfig<PlotSearchProps> = {
  id: "plot-search",
  icon: SearchIcon,
  name: "Plot Search",
  Component: PlotSearch,
  controls: {
    defaultPageSize: {
      type: ["number", "code"],
      label: "Default Page Size",
      defaultValue: 10,
      defaultCode: "return 10",
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default PlotSearchConfigs;
