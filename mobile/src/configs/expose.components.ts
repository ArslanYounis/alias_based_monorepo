import ButtonsConfig from "~/src/ui/Buttons/config";
import DummyConfig from "./Dummy.config";
import LargeComponentConfig from "./LargeComponent.config";
import PaginationConfig from "~/src/ui/Pagination/config";
import PlotSearchConfig from "./PlotSearch.config";

/**
 * Component configs used for renderer only (service + form).
 * Each config lives in its component folder or configs folder.
 */
const exposeComponents = [
  ButtonsConfig,
  DummyConfig,
  LargeComponentConfig,
  PaginationConfig,
  PlotSearchConfig,
];

export default exposeComponents;
