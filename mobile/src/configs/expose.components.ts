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
import ModalTitleConfig from "./ModalTitle.config";
import ModalStepsConfig from "./ModalSteps.config";
import CardTitleConfig from "./CardTitle.config";
import TestComponentConfig from "./TestComponent.config";
import ViewOwnerDetailConfig from "./ViewOwnerDetail.config";
import ApplicationDetailConfig from "./ApplicationDetail.config";
import ApplicationMessageConfig from "./ApplicationMessage.config";
import GenericCardConfig from "./GenericCard.config";
import GenericCardsConfig from "./GenericCards.config";
import GenericTableCardConfig from "./GenericTableCard.config";
import OwnerCardConfig from "./OwnerCard.config";
import PlotCardConfig from "./PlotCard.config";
import TableConfig from "./Table.config";

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
  ModalTitleConfig,
  ModalStepsConfig,
  CardTitleConfig,
  TestComponentConfig,
  ViewOwnerDetailConfig,
  ApplicationDetailConfig,
  ApplicationMessageConfig,
  GenericCardConfig,
  GenericCardsConfig,
  GenericTableCardConfig,
  OwnerCardConfig,
  PlotCardConfig,
  TableConfig,
];

export default exposeComponents;
