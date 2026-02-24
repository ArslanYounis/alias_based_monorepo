import AddMoreButtonConfig from "~/src/ui/AddMoreButton/config";
import BreadcrumbConfig from "~/src/ui/Breadcrumb/config";
import ButtonsConfig from "~/src/ui/Buttons/config";
import DummyConfig from "./Dummy.config";
import LargeComponentConfig from "./LargeComponent.config";
import PaginationConfig from "~/src/ui/Pagination/config";
import PromptConfig from "~/src/ui/Prompt/config";
import ScreenLoaderConfig from "~/src/ui/ScreenLoader/config";
import TypographyConfig from "~/src/ui/Typography/config";
import TestComponentConfig from "./TestComponent.config";

/**
 * Component configs used for renderer only (service + form).
 * Add new component configs here as components are migrated and verified.
 */
const exposeComponents = [
  AddMoreButtonConfig,
  BreadcrumbConfig,
  ButtonsConfig,
  DummyConfig,
  LargeComponentConfig,
  PaginationConfig,
  PromptConfig,
  ScreenLoaderConfig,
  TypographyConfig,
  TestComponentConfig,
];

export default exposeComponents;
