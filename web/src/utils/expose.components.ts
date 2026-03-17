import ButtonsConfigs from "@/ui/Buttons/buttons.config";
import CardTitleConfig from "@shared/components/CardTitle/CardTitle.config";
import BreadcrumbConfigs from "@/ui/Breadcrumb/breadcrumb.config";
import TableConfigs from "@shared/components/Table/Table.config";
import PaginationConfigs from "@/ui/Pagination/pagination.config";
import TitlesConfigs from "@/components/TitleBar/titleBar.config";
import OwnerSearchConfigs from "@shared/components/OwnerSearch/OwnerSearch.config";
import ModalTitleConfigs from "@shared/components/ModalTitle/ModalTitle.config";
import ModalStepsConfigs from "@shared/components/ModalSteps/ModalSteps.config";
import AddMoreButtonConfigs from "@/ui/AddMoreButton/addMoreButton.config";
import OwnerCardConfigs from "@shared/components/OwnerCard/OwnerCard.config";
import FilterBarConfigs from "@/ui/FilterBar/filterBar.config";
import PlotCardConfigs from "@shared/components/PlotCard/PlotCard.config";
import SearchPlotConfigs from "@shared/components/SearchPlot/SearchPlot.config";
import PaymentConfigs from "@shared/components/Payment/Payment.config";
import ApplicationDetailConfigs from "@shared/components/ApplicationDetail/ApplicationDetail.config";
import SignatureConfigs from "@/components/Signature/signature.config";
import UploadDocumentsConfigs from "@/ui/UploadDocuments/UploadDocuments.config";
import ViewOwnerDetailConfigs from "@shared/components/ViewOwnerDetail/ViewOwnerDetail.config";
import ViewPlotDetailConfigs from "@shared/components/ViewPlotDetail/ViewPlotDetail.config";
import PromptConfigs from "@/ui/Prompt/prompt.config";
import TypographyConfigs from "@/ui/Typography/typography.config";
import ApplicationMessageConfig from "@shared/components/ApplicationMessage/ApplicationMessage.config";
import ApplicationSummaryConfig from "@shared/components/ApplicationSummary/ApplicationSummary.config";
import GenericCardConfig from "@shared/components/GenericCard/GenericCard.config";
import GenericTableCardConfig from "@shared/components/GenericTableCard/GenericTableCard.config";
import GenericCardsConfig from "@shared/components/GenericCards/GenericCards.config";
import { createPaymentDetailsConfig } from "@shared/components/PaymentDetails";
import { ReceiptText } from "lucide-react";
import ScreenLoaderConfigs from "@/ui/ScreenLoader/screenLoader.config";
import TestComponentConfigs from "@/ui/configs/TestComponent.config";
import DummyConfigs from "@/ui/configs/Dummy.config";
import LargeComponentConfigs from "@/ui/configs/LargeComponent.config";
import AuditRemarksConfigs from "@/ui/AuditRemarks/auditRemarks.config";
import PageTitleConfig from "@shared/components/PageTitle/PageTitle.config";

const PaymentDetailsConfigs = createPaymentDetailsConfig(ReceiptText);

/**
 * Array of all component configurations to be exposed to service-builder.
 * Add new component configs here as components are migrated and verified.
 */
const exposeComponents = [
  ButtonsConfigs,
  CardTitleConfig,
  BreadcrumbConfigs,
  TableConfigs,
  PaginationConfigs,
  TitlesConfigs,
  OwnerSearchConfigs,
  ModalTitleConfigs,
  ModalStepsConfigs,
  AddMoreButtonConfigs,
  OwnerCardConfigs,
  FilterBarConfigs,
  PlotCardConfigs,
  SearchPlotConfigs,
  PaymentConfigs,
  ApplicationDetailConfigs,
  SignatureConfigs,
  UploadDocumentsConfigs,
  ViewOwnerDetailConfigs,
  ViewPlotDetailConfigs,
  PromptConfigs,
  TypographyConfigs,
  PaymentDetailsConfigs,
  TestComponentConfigs,
  ScreenLoaderConfigs,
  ApplicationMessageConfig,
  ApplicationSummaryConfig,
  GenericCardConfig,
  GenericTableCardConfig,
  GenericCardsConfig,
  PageTitleConfig,
  AuditRemarksConfigs,
  DummyConfigs,
  LargeComponentConfigs,
];

export default exposeComponents;
