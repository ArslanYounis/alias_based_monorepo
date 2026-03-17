import ButtonsConfig from "~/src/ui/Buttons/config";
import CardTitleConfig from "@shared/components/CardTitle/CardTitle.config";
import BreadcrumbConfig from "~/src/ui/Breadcrumb/config";
import TableConfigs from "@shared/components/Table/Table.config";
import PaginationConfig from "~/src/ui/Pagination/config";
import OwnerSearchConfigs from "@shared/components/OwnerSearch/OwnerSearch.config";
import ModalTitleConfigs from "@shared/components/ModalTitle/ModalTitle.config";
import ModalStepsConfigs from "@shared/components/ModalSteps/ModalSteps.config";
import AddMoreButtonConfig from "~/src/ui/AddMoreButton/config";
import OwnerCardConfigs from "@shared/components/OwnerCard/OwnerCard.config";
import FilterBarConfig from "~/src/ui/FilterBar/config";
import PlotCardConfigs from "@shared/components/PlotCard/PlotCard.config";
import SearchPlotConfigs from "@shared/components/SearchPlot/SearchPlot.config";
import PaymentConfigs from "@shared/components/Payment/Payment.config";
import ApplicationDetailConfigs from "@shared/components/ApplicationDetail/ApplicationDetail.config";
import UploadDocumentsConfig from "~/src/ui/UploadDocuments/config";
import ViewOwnerDetailConfigs from "@shared/components/ViewOwnerDetail/ViewOwnerDetail.config";
import ViewPlotDetailConfigs from "@shared/components/ViewPlotDetail/ViewPlotDetail.config";
import PromptConfig from "~/src/ui/Prompt/config";
import TypographyConfig from "~/src/ui/Typography/config";
import ApplicationMessageConfig from "@shared/components/ApplicationMessage/ApplicationMessage.config";
import ApplicationSummaryConfig from "@shared/components/ApplicationSummary/ApplicationSummary.config";
import GenericCardConfig from "@shared/components/GenericCard/GenericCard.config";
import GenericTableCardConfig from "@shared/components/GenericTableCard/GenericTableCard.config";
import GenericCardsConfig from "@shared/components/GenericCards/GenericCards.config";
import { createPaymentDetailsConfig } from "@shared/components/PaymentDetails";
import { ReceiptText } from "lucide-react-native";
import ScreenLoaderConfig from "~/src/ui/ScreenLoader/config";
import TestComponentConfig from "./TestComponent.config";
import DummyConfig from "./Dummy.config";
import LargeComponentConfig from "./LargeComponent.config";
import AuditRemarksConfig from "~/src/ui/AuditRemarks/config";
import PageTitleConfig from "@shared/components/PageTitle/PageTitle.config";

const PaymentDetailsConfigs = createPaymentDetailsConfig(ReceiptText);

/**
 * Component configs used for renderer only (service + form).
 * Add new component configs here as components are migrated and verified.
 */
const exposeComponents = [
  ButtonsConfig,
  CardTitleConfig,
  BreadcrumbConfig,
  TableConfigs,
  PaginationConfig,
  OwnerSearchConfigs,
  ModalTitleConfigs,
  ModalStepsConfigs,
  AddMoreButtonConfig,
  OwnerCardConfigs,
  FilterBarConfig,
  PlotCardConfigs,
  SearchPlotConfigs,
  PaymentConfigs,
  ApplicationDetailConfigs,
  UploadDocumentsConfig,
  ViewOwnerDetailConfigs,
  ViewPlotDetailConfigs,
  PromptConfig,
  TypographyConfig,
  PaymentDetailsConfigs,
  ScreenLoaderConfig,
  ApplicationMessageConfig,
  ApplicationSummaryConfig,
  GenericCardConfig,
  GenericTableCardConfig,
  GenericCardsConfig,
  PageTitleConfig,
  AuditRemarksConfig,
  TestComponentConfig,
  DummyConfig,
  LargeComponentConfig,
];

export default exposeComponents;
