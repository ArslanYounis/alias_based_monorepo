import AddMoreButtonConfigs from "@/ui/AddMoreButton/addMoreButton.config";
import BreadcrumbConfigs from "@/ui/Breadcrumb/breadcrumb.config";
import ButtonsConfigs from "@/ui/Buttons/buttons.config";
import DummyConfigs from "@/ui/configs/Dummy.config";
import LargeComponentConfigs from "@/ui/configs/LargeComponent.config";
import PaginationConfigs from "@/ui/Pagination/pagination.config";
import PlotSearchConfigs from "@/ui/configs/PlotSearch.config";
import PromptConfigs from "@/ui/Prompt/prompt.config";
import ScreenLoaderConfigs from "@/ui/ScreenLoader/screenLoader.config";
import TypographyConfigs from "@/ui/Typography/typography.config";

/**
 * Array of all component configurations to be exposed to service-builder.
 * Each config lives in its component folder (or configs folder for shared components).
 */
const exposeComponents = [
  AddMoreButtonConfigs,
  BreadcrumbConfigs,
  ButtonsConfigs,
  DummyConfigs,
  LargeComponentConfigs,
  PaginationConfigs,
  PlotSearchConfigs,
  PromptConfigs,
  ScreenLoaderConfigs,
  TypographyConfigs,
];

export default exposeComponents;
