import ButtonsConfig from "~/src/ui/Buttons/config";
import DummyConfig from "./Dummy.config";
import PlotSearchConfig from "./PlotSearch.config";
import LargeComponentConfig from "./LargeComponent.config";

/**
 * Component configs used for renderer only (service + form).
 * Each config lives in its component folder or configs folder.
 */
const exposeComponents = [
  ButtonsConfig,
  DummyConfig,
  PlotSearchConfig,
  LargeComponentConfig,
];

export default exposeComponents;
