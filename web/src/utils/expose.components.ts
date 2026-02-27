import AddMoreButtonConfigs from "@/ui/AddMoreButton/addMoreButton.config";
import BreadcrumbConfigs from "@/ui/Breadcrumb/breadcrumb.config";
import ButtonsConfigs from "@/ui/Buttons/buttons.config";
import DummyConfigs from "@/ui/configs/Dummy.config";
import LargeComponentConfigs from "@/ui/configs/LargeComponent.config";
import PaginationConfigs from "@/ui/Pagination/pagination.config";
import PromptConfigs from "@/ui/Prompt/prompt.config";
import ScreenLoaderConfigs from "@/ui/ScreenLoader/screenLoader.config";
import TypographyConfigs from "@/ui/Typography/typography.config";
import TestComponentConfigs from "@/ui/configs/TestComponent.config";
import FilterBarConfigs from "@/ui/FilterBar/filterBar.config";

/**
 * Array of all component configurations to be exposed to service-builder.
 * Add new component configs here as components are migrated and verified.
 */
const exposeComponents = [
  AddMoreButtonConfigs,
  BreadcrumbConfigs,
  ButtonsConfigs,
  DummyConfigs,
  LargeComponentConfigs,
  PaginationConfigs,
  PromptConfigs,
  ScreenLoaderConfigs,
  TypographyConfigs,
  TestComponentConfigs,
  FilterBarConfigs,
];

export default exposeComponents;
