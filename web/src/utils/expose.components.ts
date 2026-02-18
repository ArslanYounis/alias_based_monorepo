import ButtonsConfigs from "@/ui/Buttons/buttons.config";
import DummyConfigs from "@/ui/configs/Dummy.config";
import LargeComponentConfigs from "@/ui/configs/LargeComponent.config";
import PaginationConfigs from "@/ui/Pagination/pagination.config";
import PlotSearchConfigs from "@/ui/configs/PlotSearch.config";

/**
 * Array of all component configurations to be exposed to service-builder.
 * Each config lives in its component folder (or configs folder for shared components).
 */
const exposeComponents = [
  ButtonsConfigs,
  DummyConfigs,
  LargeComponentConfigs,
  PaginationConfigs,
  PlotSearchConfigs,
];

export default exposeComponents;
