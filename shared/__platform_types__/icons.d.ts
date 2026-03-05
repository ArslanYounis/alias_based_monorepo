import type { ComponentProps, FC } from "react";
import type {
  PaymentIcon as WebPaymentIcon,
  NoPaymentIcon as WebNoPaymentIcon,
  ChevronDownIcon as WebChevronDownIcon,
  ChevronUpIcon as WebChevronUpIcon,
  CheckIcon as WebCheckIcon,
  SendIcon as WebSendIcon,
  SearchIcon as WebSearchIcon,
  PersonIcon as WebPersonIcon,
  UAENationalIcon as WebUAENationalIcon,
  CalendarIcon as WebCalendarIcon,
  PlotIcon as WebPlotIcon,
  OwnerIcon as WebOwnerIcon,
  CompanyIcon as WebCompanyIcon,
  DocumentIcon as WebDocumentIcon,
  AppMessageSuccessIcon as WebAppMessageSuccessIcon,
  AppMessageErrorIcon as WebAppMessageErrorIcon,
  AppMessageInformationIcon as WebAppMessageInformationIcon,
  AppMessageActionIcon as WebAppMessageActionIcon,
} from "../../web/src/ui/icons";
import type {
  PaymentIcon as MobilePaymentIcon,
  NoPaymentIcon as MobileNoPaymentIcon,
  ChevronDownIcon as MobileChevronDownIcon,
  ChevronUpIcon as MobileChevronUpIcon,
  CheckIcon as MobileCheckIcon,
  SendIcon as MobileSendIcon,
  SearchIcon as MobileSearchIcon,
  PersonIcon as MobilePersonIcon,
  UAENationalIcon as MobileUAENationalIcon,
  CalendarIcon as MobileCalendarIcon,
  PlotIcon as MobilePlotIcon,
  OwnerIcon as MobileOwnerIcon,
  CompanyIcon as MobileCompanyIcon,
  DocumentIcon as MobileDocumentIcon,
  AppMessageSuccessIcon as MobileAppMessageSuccessIcon,
  AppMessageErrorIcon as MobileAppMessageErrorIcon,
  AppMessageInformationIcon as MobileAppMessageInformationIcon,
  AppMessageActionIcon as MobileAppMessageActionIcon,
} from "../../mobile/src/ui/icons";

export type DocumentIconProps =
  | ComponentProps<typeof WebDocumentIcon>
  | ComponentProps<typeof MobileDocumentIcon>;
export const DocumentIcon: FC<DocumentIconProps>;

export type PaymentIconProps =
  | ComponentProps<typeof WebPaymentIcon>
  | ComponentProps<typeof MobilePaymentIcon>;
export const PaymentIcon: FC<PaymentIconProps>;

export type NoPaymentIconProps =
  | ComponentProps<typeof WebNoPaymentIcon>
  | ComponentProps<typeof MobileNoPaymentIcon>;
export const NoPaymentIcon: FC<NoPaymentIconProps>;

export type ChevronDownIconProps =
  | ComponentProps<typeof WebChevronDownIcon>
  | ComponentProps<typeof MobileChevronDownIcon>;
export const ChevronDownIcon: FC<ChevronDownIconProps>;

export type ChevronUpIconProps =
  | ComponentProps<typeof WebChevronUpIcon>
  | ComponentProps<typeof MobileChevronUpIcon>;
export const ChevronUpIcon: FC<ChevronUpIconProps>;

export type CheckIconProps =
  | ComponentProps<typeof WebCheckIcon>
  | ComponentProps<typeof MobileCheckIcon>;
export const CheckIcon: FC<CheckIconProps>;

export type SendIconProps =
  | ComponentProps<typeof WebSendIcon>
  | ComponentProps<typeof MobileSendIcon>;
export const SendIcon: FC<SendIconProps>;

export type SearchIconProps =
  | ComponentProps<typeof WebSearchIcon>
  | ComponentProps<typeof MobileSearchIcon>;
export const SearchIcon: FC<SearchIconProps>;

export type PersonIconProps =
  | ComponentProps<typeof WebPersonIcon>
  | ComponentProps<typeof MobilePersonIcon>;
export const PersonIcon: FC<PersonIconProps>;

export type UAENationalIconProps =
  | ComponentProps<typeof WebUAENationalIcon>
  | ComponentProps<typeof MobileUAENationalIcon>;
export const UAENationalIcon: FC<UAENationalIconProps>;

export type CalendarIconProps =
  | ComponentProps<typeof WebCalendarIcon>
  | ComponentProps<typeof MobileCalendarIcon>;
export const CalendarIcon: FC<CalendarIconProps>;

export type PlotIconProps =
  | ComponentProps<typeof WebPlotIcon>
  | ComponentProps<typeof MobilePlotIcon>;
export const PlotIcon: FC<PlotIconProps>;

export type OwnerIconProps =
  | ComponentProps<typeof WebOwnerIcon>
  | ComponentProps<typeof MobileOwnerIcon>;
export const OwnerIcon: FC<OwnerIconProps>;

export type CompanyIconProps =
  | ComponentProps<typeof WebCompanyIcon>
  | ComponentProps<typeof MobileCompanyIcon>;
export const CompanyIcon: FC<CompanyIconProps>;

export type AppMessageSuccessIconProps =
  | ComponentProps<typeof WebAppMessageSuccessIcon>
  | ComponentProps<typeof MobileAppMessageSuccessIcon>;
export const AppMessageSuccessIcon: FC<AppMessageSuccessIconProps>;

export type AppMessageErrorIconProps =
  | ComponentProps<typeof WebAppMessageErrorIcon>
  | ComponentProps<typeof MobileAppMessageErrorIcon>;
export const AppMessageErrorIcon: FC<AppMessageErrorIconProps>;

export type AppMessageInformationIconProps =
  | ComponentProps<typeof WebAppMessageInformationIcon>
  | ComponentProps<typeof MobileAppMessageInformationIcon>;
export const AppMessageInformationIcon: FC<AppMessageInformationIconProps>;

export type AppMessageActionIconProps =
  | ComponentProps<typeof WebAppMessageActionIcon>
  | ComponentProps<typeof MobileAppMessageActionIcon>;
export const AppMessageActionIcon: FC<AppMessageActionIconProps>;
