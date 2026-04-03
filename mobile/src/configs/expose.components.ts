import ButtonsConfig from "~/src/ui/Buttons/buttons.config";
import BreadcrumbConfig from "~/src/ui/Breadcrumb/breadcrumb.config";
import PaginationConfig from "~/src/ui/Pagination/pagination.config";
import AddMoreButtonConfig from "~/src/ui/AddMoreButton/addMoreButton.config";
import FilterBarConfig from "~/src/ui/FilterBar/filterBar.config";
import UploadDocumentsConfig from "~/src/ui/UploadDocuments/UploadDocuments.config";
import PromptConfig from "~/src/ui/Prompt/prompt.config";
import TypographyConfig from "~/src/ui/Typography/typography.config";
import ScreenLoaderConfig from "~/src/ui/ScreenLoader/screenLoader.config";
import AuditRemarksConfig from "~/src/ui/AuditRemarks/auditRemarks.config";
import TitlesConfig from "~/src/ui/TitleBar/titleBar.config";
import SignatureConfig from "~/src/ui/Signature/signature.config";

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
} from "lucide-react-native";

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
  ApplicationMessageConfigs,
  ApplicationSummaryConfigs,
  GenericCardConfigs,
  GenericTableCardConfigs,
  GenericCardsConfigs,
  PageTitleConfigs,
  AuditRemarksConfig,
  TitlesConfig,
  SignatureConfig,
];

export default exposeComponents as any[];
