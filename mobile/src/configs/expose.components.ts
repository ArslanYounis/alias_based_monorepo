import AddMoreButtonConfig from "~/src/ui/AddMoreButton/config";
import BreadcrumbConfig from "~/src/ui/Breadcrumb/config";
import ButtonsConfig from "~/src/ui/Buttons/config";
import DummyConfig from "./Dummy.config";
import LargeComponentConfig from "./LargeComponent.config";
import PaginationConfig from "~/src/ui/Pagination/config";
import PlotSearchConfig from "./PlotSearch.config";
import PromptConfig from "~/src/ui/Prompt/config";
import ScreenLoaderConfig from "~/src/ui/ScreenLoader/config";
import TypographyConfig from "~/src/ui/Typography/config";

/**
 * Component configs used for renderer only (service + form).
 * Each config lives in its component folder or configs folder.
 */
const exposeComponents = [
  AddMoreButtonConfig,
  BreadcrumbConfig,
  ButtonsConfig,
  DummyConfig,
  LargeComponentConfig,
  PaginationConfig,
  PlotSearchConfig,
  PromptConfig,
  ScreenLoaderConfig,
  TypographyConfig,
];

export default exposeComponents;
