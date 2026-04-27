import ButtonsConfigs from "@/ui/Buttons/buttons.config";
import BreadcrumbConfigs from "@/ui/Breadcrumb/breadcrumb.config";
import PaginationConfigs from "@/ui/Pagination/pagination.config";
import TitlesConfigs from "@/ui/TitleBar/titleBar.config";
import AddMoreButtonConfigs from "@/ui/AddMoreButton/addMoreButton.config";
import FilterBarConfigs from "@/ui/FilterBar/filterBar.config";
import SignatureConfigs from "@/ui/Signature/signature.config";
import UploadDocumentsConfigs from "@/ui/UploadDocuments/UploadDocuments.config";
import PromptConfigs from "@/ui/Prompt/prompt.config";
import TypographyConfigs from "@/ui/Typography/typography.config";
import ScreenLoaderConfigs from "@/ui/ScreenLoader/screenLoader.config";
import AuditRemarksConfigs from "@/ui/AuditRemarks/auditRemarks.config";

// Shared config factory functions
import { createCardTitleConfig } from "@shared/components/CardTitle/CardTitle.config";
import { createTableConfig } from "@shared/components/Table/Table.config";
import { createOwnerSearchConfig } from "@shared/components/OwnerSearch/OwnerSearch.config";
import { createModalTitleConfig } from "@shared/components/ModalTitle/ModalTitle.config";
import { createModalStepsConfig } from "@shared/components/ModalSteps/ModalSteps.config";
import { createOwnerCardConfig } from "@shared/components/OwnerCard/OwnerCard.config";
import { createPlotCardConfig } from "@shared/components/PlotCard/PlotCard.config";
import { createSearchPlotConfig } from "@shared/components/SearchPlot/SearchPlot.config";
import { createPaymentConfig } from "@shared/components/Payment/Payment.config";
import { createApplicationDetailConfig } from "@shared/components/ApplicationDetail/ApplicationDetail.config";
import { createViewOwnerDetailConfig } from "@shared/components/ViewOwnerDetail/ViewOwnerDetail.config";
import { createViewPlotDetailConfig } from "@shared/components/ViewPlotDetail/ViewPlotDetail.config";
import { createApplicationMessageConfig } from "@shared/components/ApplicationMessage/ApplicationMessage.config";
import { createApplicationSummaryConfig } from "@shared/components/ApplicationSummary/ApplicationSummary.config";
import { createGenericCardConfig } from "@shared/components/GenericCard/GenericCard.config";
import { createGenericTableCardConfig } from "@shared/components/GenericTableCard/GenericTableCard.config";
import { createGenericCardsConfig } from "@shared/components/GenericCards/GenericCards.config";
import { createPaymentDetailsConfig } from "@shared/components/PaymentDetails";
import { createPageTitleConfig } from "@shared/components/PageTitle/PageTitle.config";
import { createAgentConfig } from "@shared/components/Agent/Agent.config";
import { createDariOwnerSearchConfig } from "@shared/components/DariOwnerSearch/dariOwnerSearch.config";
import { createDariPlotSearchConfig } from "@shared/components/DariPlotSearch/dariPlotSearch.config";

// Shared components
import CardTitle from "@shared/components/CardTitle/CardTitle";
import Table from "@shared/components/Table/Table";
import OwnerSearch from "@shared/components/OwnerSearch/OwnerSearch";
import ModalTitle from "@shared/components/ModalTitle/ModalTitle";
import ModalSteps from "@shared/components/ModalSteps/ModalSteps";
import OwnerCard from "@shared/components/OwnerCard/OwnerCard";
import PlotCard from "@shared/components/PlotCard/PlotCard";
import SearchPlot from "@shared/components/SearchPlot/SearchPlot";
import Payment from "@shared/components/Payment/Payment";
import ApplicationDetail from "@shared/components/ApplicationDetail/ApplicationDetail";
import ViewOwnerDetail from "@shared/components/ViewOwnerDetail/ViewOwnerDetail";
import ViewPlotDetail from "@shared/components/ViewPlotDetail/ViewPlotDetail";
import ApplicationMessage from "@shared/components/ApplicationMessage/ApplicationMessage";
import ApplicationSummary from "@shared/components/ApplicationSummary/ApplicationSummary";
import GenericCard from "@shared/components/GenericCard/GenericCard";
import GenericTableCard from "@shared/components/GenericTableCard/GenericTableCard";
import GenericCards from "@shared/components/GenericCards/GenericCards";
import PageTitle from "@shared/components/PageTitle/PageTitle";
import Agent from "@shared/components/Agent";
import DariOwnerSearch from "@shared/components/DariOwnerSearch/dariOwnerSearch";
import DariPlotSearch from "@shared/components/DariPlotSearch/dariPlotSearch";


// Platform-specific icons
import {
  HeadingIcon,
  TableIcon,
  FolderSymlinkIcon,
  FilterIcon,
  SearchIcon,
  CreditCardIcon,
  LayoutIcon,
  UserCogIcon,
  MapIcon,
  InfoIcon,
  FileBarChartIcon,
  LayoutGridIcon,
  ReceiptText,
} from "lucide-react";

// Create shared configs with platform-specific icons and components
const CardTitleConfig = createCardTitleConfig(CardTitle, HeadingIcon);
const TableConfigs = createTableConfig(Table, TableIcon);
const OwnerSearchConfigs = createOwnerSearchConfig(OwnerSearch, FolderSymlinkIcon);
const ModalTitleConfigs = createModalTitleConfig(ModalTitle, FolderSymlinkIcon);
const ModalStepsConfigs = createModalStepsConfig(ModalSteps, FolderSymlinkIcon);
const OwnerCardConfigs = createOwnerCardConfig(OwnerCard, FolderSymlinkIcon);
const PlotCardConfigs = createPlotCardConfig(PlotCard, FilterIcon);
const SearchPlotConfigs = createSearchPlotConfig(SearchPlot, SearchIcon);
const PaymentConfigs = createPaymentConfig(Payment, CreditCardIcon);
const ApplicationDetailConfigs = createApplicationDetailConfig(ApplicationDetail, LayoutIcon);
const ViewOwnerDetailConfigs = createViewOwnerDetailConfig(ViewOwnerDetail, UserCogIcon);
const ViewPlotDetailConfigs = createViewPlotDetailConfig(ViewPlotDetail, MapIcon);
const ApplicationMessageConfigs = createApplicationMessageConfig(ApplicationMessage, InfoIcon);
const ApplicationSummaryConfigs = createApplicationSummaryConfig(ApplicationSummary, FileBarChartIcon);
const GenericCardConfigs = createGenericCardConfig(GenericCard, CreditCardIcon);
const GenericTableCardConfigs = createGenericTableCardConfig(GenericTableCard, CreditCardIcon);
const GenericCardsConfigs = createGenericCardsConfig(GenericCards, LayoutGridIcon);
const PaymentDetailsConfigs = createPaymentDetailsConfig(ReceiptText);
const PageTitleConfigs = createPageTitleConfig(PageTitle, CreditCardIcon);
const AgentConfigs = createAgentConfig(Agent, FolderSymlinkIcon);
const DariOwnerSearchConfigs = createDariOwnerSearchConfig(DariOwnerSearch, FolderSymlinkIcon);
const DariPlotSearchConfigs = createDariPlotSearchConfig(DariPlotSearch, FolderSymlinkIcon);

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
  ScreenLoaderConfigs,
  ApplicationMessageConfigs,
  ApplicationSummaryConfigs,
  GenericCardConfigs,
  GenericTableCardConfigs,
  GenericCardsConfigs,
  PageTitleConfigs,
  AuditRemarksConfigs,
  AgentConfigs,
  DariOwnerSearchConfigs,
  DariPlotSearchConfigs
];

export default exposeComponents;
