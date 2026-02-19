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
import ModalTitleConfigs from "@/ui/configs/ModalTitle.config";
import ModalStepsConfigs from "@/ui/configs/ModalSteps.config";
import CardTitleConfigs from "@/ui/configs/CardTitle.config";
import TestComponentConfigs from "@/ui/configs/TestComponent.config";
import ViewOwnerDetailConfigs from "@/ui/configs/ViewOwnerDetail.config";
import ApplicationDetailConfigs from "@/ui/configs/ApplicationDetail.config";
import ApplicationMessageConfigs from "@/ui/configs/ApplicationMessage.config";
import GenericCardConfigs from "@/ui/configs/GenericCard.config";
import GenericCardsConfigs from "@/ui/configs/GenericCards.config";
import GenericTableCardConfigs from "@/ui/configs/GenericTableCard.config";
import OwnerCardConfigs from "@/ui/configs/OwnerCard.config";
import PlotCardConfigs from "@/ui/configs/PlotCard.config";
import TableConfigs from "@/ui/configs/Table.config";

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
  ModalTitleConfigs,
  ModalStepsConfigs,
  CardTitleConfigs,
  TestComponentConfigs,
  ViewOwnerDetailConfigs,
  ApplicationDetailConfigs,
  ApplicationMessageConfigs,
  GenericCardConfigs,
  GenericCardsConfigs,
  GenericTableCardConfigs,
  OwnerCardConfigs,
  PlotCardConfigs,
  TableConfigs,
];

export default exposeComponents;
