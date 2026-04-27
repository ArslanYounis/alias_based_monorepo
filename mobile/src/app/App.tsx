import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "~/src/ui/Text";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "~/src/ui/Layout";
import { Typography } from "~/src/ui/Typography";
import { Buttons } from "~/src/ui/Buttons";
import { AddButton } from "~/src/ui/AddButton";
import { AddMoreButton } from "~/src/ui/AddMoreButton";
import { Breadcrumb } from "~/src/ui/Breadcrumb";
import TitleBar from "~/src/ui/TitleBar";
import { TextInput } from "~/src/ui/TextInput";
import { TextArea } from "~/src/ui/TextArea";
import { Select } from "~/src/ui/Select";
import { MultiSelect } from "~/src/ui/MultiSelect";
import { CheckboxInput } from "~/src/ui/CheckboxInput";
import { RadioInput } from "~/src/ui/RadioInput";
import { CheckboxField } from "~/src/ui/CheckboxField";
import { RadioField } from "~/src/ui/RadioField";
import { DateSelect } from "~/src/ui/DateSelect";
import { CurrencyInput } from "~/src/ui/CurrencyInput";
import { NumberInput } from "~/src/ui/NumberInput";
import { PhoneInput } from "~/src/ui/PhoneInput";
import { Caption } from "~/src/ui/Caption";
import { Label } from "~/src/ui/Label";
import { Avatar } from "~/src/ui/Avatar";
import { ProfileIconStatus } from "~/src/ui/ProfileIconStatus";
import { StatusBalls } from "~/src/ui/StatusBalls";
import { SwitchButton } from "~/src/ui/SwitchButton";
import { Cards } from "~/src/ui/Cards";
import { ApplicationCard } from "~/src/ui/ApplicationCard";
import { Pagination } from "~/src/ui/Pagination";
import { FilterBar } from "~/src/ui/FilterBar";
import { Prompt } from "~/src/ui/Prompt";
import AuditRemarks from "~/src/ui/AuditRemarks";
import Signature from "~/src/ui/Signature";
import { UploadDocuments } from "~/src/ui/UploadDocuments";
import { Toast } from "~/src/ui/Toast";
import { Tooltip } from "~/src/ui/Tooltip";
import { Bot } from "~/src/ui/Bot";
import { Logo } from "~/src/ui/Logo";
import { RadioCard } from "~/src/ui/RadioCard";
import DariOwnerSearch from "@shared/components/DariOwnerSearch/dariOwnerSearch";
import OwnerCard from "@shared/components/OwnerCard/OwnerCard";
import PlotCard from "@shared/components/PlotCard/PlotCard";
import ApplicationSummary from "@shared/components/ApplicationSummary/ApplicationSummary";
import type { Owner } from "@shared/components/OwnerCard/OwnerCard";
import type { Plot } from "@shared/components/PlotCard/PlotCard";
import type {
  UiBlock,
  UploadDocumentsProps,
} from "@shared/components/ApplicationSummary/ApplicationSummary.types";
import type { ToastProps } from "@shared/types";
import axios from "axios";
import DariPlotSearch from "@shared/components/DariPlotSearch/dariPlotSearch";
import SearchTenancyContract from "@shared/components/SearchTenancyContract/searchTenancyContract";
import SearchAllotment from "@shared/components/SearchAllotment/searchAllotment";

// Force RTL layout for Arabic
// I18nManager.forceRTL(true);
// I18nManager.allowRTL(true);

const queryClient = new QueryClient();
const LANG = "en";

const DROPDOWN_OPTIONS = [
  { label: "Option A", label_ar: "الخيار أ", value: "a" },
  { label: "Option B", label_ar: "الخيار ب", value: "b" },
  { label: "Option C", label_ar: "الخيار ج", value: "c" },
];

const CHECKBOX_OPTIONS = [
  { label: "Choice 1", label_ar: "الخيار ١", value: "c1" },
  { label: "Choice 2", label_ar: "الخيار ٢", value: "c2" },
  { label: "Choice 3", label_ar: "الخيار ٣", value: "c3" },
];

const RADIO_OPTIONS = [
  { label: "Yes", label_ar: "نعم", value: "yes" },
  { label: "No", label_ar: "لا", value: "no" },
  { label: "Maybe", label_ar: "ربما", value: "maybe" },
];

const SAMPLE_OWNERS: Owner[] = [
  {
    ownerId: "owner-1",
    ownerArgs: "args-1",
    name: "Talal Ahmed Salem",
    name_ar: "طلال أحمد سالم",
    fields: [
      {
        label: "UAE National ID",
        label_ar: "الهوية الوطنية الإماراتية",
        value: "78273890399292",
        value_ar: "78273890399292",
      },
      {
        label: "MOI Unified Number",
        label_ar: "رقم وزارة الداخلية الموحد",
        value: "330928",
        value_ar: "330928",
      },
      {
        label: "Archive Number",
        label_ar: "رقم الأرشيف",
        value: "7921",
        value_ar: "7921",
      },
      {
        label: "Nationality",
        label_ar: "الجنسية",
        value: "United Arab Emirates",
        value_ar: "الإمارات العربية المتحدة",
      },
      {
        label: "Special Nationality",
        label_ar: "الجنسية الخاصة",
        value: "No",
        value_ar: "لا",
      },
      {
        label: "Share",
        label_ar: "الحصة",
        value: "100% Allotment 50% Share",
        value_ar: "100% تخصيص 50% حصة",
      },
      {
        label: "Right Hold Type",
        label_ar: "نوع حق الحيازة",
        value: "Ownership Musataha",
        value_ar: "ملكية مستطاعة",
      },
    ],
  },
  {
    ownerId: "owner-2",
    ownerArgs: "args-2",
    name: "Ahmed Abdulla Ahmed Mohamed",
    name_ar: "أحمد عبد الله أحمد محمد",
    fields: [
      {
        label: "UAE National ID",
        label_ar: "الهوية الوطنية الإماراتية",
        value: "78451234567890",
        value_ar: "78451234567890",
      },
      {
        label: "MOI Unified Number",
        label_ar: "رقم وزارة الداخلية الموحد",
        value: "445566",
        value_ar: "445566",
      },
      {
        label: "Archive Number",
        label_ar: "رقم الأرشيف",
        value: "8932",
        value_ar: "8932",
      },
      {
        label: "Nationality",
        label_ar: "الجنسية",
        value: "United Arab Emirates",
        value_ar: "الإمارات العربية المتحدة",
      },
      {
        label: "Share",
        label_ar: "الحصة",
        value: "75% Allotment 75% Share",
        value_ar: "75% تخصيص 75% حصة",
      },
    ],
  },
  {
    ownerId: "owner-3",
    ownerArgs: "args-3",
    name: "Fatima Ali Hassan",
    name_ar: "فاطمة علي حسن",
    fields: [
      {
        label: "UAE National ID",
        label_ar: "الهوية الوطنية الإماراتية",
        value: "78901234567890",
        value_ar: "78901234567890",
      },
      {
        label: "MOI Unified Number",
        label_ar: "رقم وزارة الداخلية الموحد",
        value: "556677",
        value_ar: "556677",
      },
      {
        label: "Nationality",
        label_ar: "الجنسية",
        value: "United Arab Emirates",
        value_ar: "الإمارات العربية المتحدة",
      },
      {
        label: "Share",
        label_ar: "الحصة",
        value: "50% Allotment 50% Share",
        value_ar: "50% تخصيص 50% حصة",
      },
    ],
  },
];

const SAMPLE_PLOTS: Plot[] = [
  {
    plotId: "plot-1",
    plotArgs: "args-1",
    plotNumber: "C1",
    plotNumber_ar: "ج1",
    fields: [
      {
        label: "Plot Address",
        label_ar: "عنوان القطعة",
        value: "0-222-000-RCH9999",
        value_ar: "0-222-000-RCH9999",
      },
      {
        label: "Zone/District",
        label_ar: "المنطقة/الحي",
        value: "Al Layyan",
        value_ar: "اللیان",
      },
      {
        label: "Sector",
        label_ar: "القطاع",
        value: "Seih Al Sedeirah 64",
        value_ar: "سيح السديرة 64",
      },
      {
        label: "Municipality",
        label_ar: "البلدية",
        value: "Abu Dhabi City",
        value_ar: "مدينة أبوظبي",
      },
      {
        label: "Allocation Type",
        label_ar: "نوع التخصيص",
        value: "Commercial",
        value_ar: "تجاري",
      },
      {
        label: "Area",
        label_ar: "المساحة",
        value: "314,939.11 Square Meter",
        value_ar: "314,939.11 متر مربع",
      },
    ],
  },
  {
    plotId: "plot-2",
    plotArgs: "args-2",
    plotNumber: "C2",
    plotNumber_ar: "ج2",
    fields: [
      {
        label: "Plot Address",
        label_ar: "عنوان القطعة",
        value: "0-333-000-RCH8888",
        value_ar: "0-333-000-RCH8888",
      },
      {
        label: "Zone/District",
        label_ar: "المنطقة/الحي",
        value: "Al Khalidiyah",
        value_ar: "الخالدية",
      },
      {
        label: "Sector",
        label_ar: "القطاع",
        value: "Sector 12",
        value_ar: "القطاع 12",
      },
      {
        label: "Municipality",
        label_ar: "البلدية",
        value: "Abu Dhabi City",
        value_ar: "مدينة أبوظبي",
      },
    ],
  },
];

// Wrapper so UploadDocuments satisfies the DocumentsComponent signature
const MobileDocumentsComponent = (
  props: UploadDocumentsProps & { language?: string }
) => (
  <UploadDocuments
    {...props}
    handleUploadInternally={false}
    onFileChange={() => {}}
  />
);

const APP_SUMMARY_DATA: UiBlock[][] = [
  [
    {
      type: "agent",
      data: {
        agent: {
          name: "English Name",
          name_ar: "Arabic Name",
          email: "email@test.com",
          phone: "0500000000",
        },
      },
    },
    {
      type: "applicationDetails",
      data: {
        applicationNumber: "APP-123",
        applicationNumber_ar: "١٢٣-APP",
      },
    },
    {
      type: "plot",
      data: {
        title: "Plot",
        plots: [
          {
            plotId: "1",
            plotArgs: "1",
            plotNumber: "Plot-01",
            fields: [
              { label: "Zone", value: "Zone A" },
              { label: "District", value: "District 1" },
              { label: "Community", value: "Community X" },
            ],
          },
        ],
        showChangePlotButton: true,
        showViewButton: true,
        showOwnersButton: true,
      },
    },
    {
      type: "owners",
      data: {
        title: "Owners",
        owners: [
          {
            ownerId: "1",
            ownerArgs: "1",
            name: "Owner Name",
            fields: [
              { label: "Share", value: "50%" },
              { label: "Hold Type", value: "Ownership" },
            ],
          },
          {
            ownerId: "2",
            ownerArgs: "2",
            name: "Owner Name 2",
            fields: [
              { label: "Share", value: "50%" },
              { label: "Hold Type", value: "Ownership" },
            ],
          },
        ],
      },
    },
    {
      type: "genericCards",
      data: {
        title: "Late Payment Details",
        title_ar: "تفاصيل التأخير في الدفع",
        cardsData: [
          {
            rowsData: [
              { label: "Tenancy Contract Type", value: "Standing" },
              { label: "Start Date", value: "29/6/2025" },
              { label: "Rent Amount", value: "912" },
            ],
            showTitleButtons: true,
            titleButtons: [
              { title: "Edit", title_ar: "تعديل", onClick: () => {} },
              { title: "View", title_ar: "عرض", onClick: () => {} },
            ],
          },
        ],
        isExpandable: false,
        showButtons: false,
      },
    },
    {
      type: "genericTableCard",
      data: {
        title: "Owner Information",
        title_ar: "معلومات المالك",
        description: "Description",
        description_ar: "Arabic Description",
        cardTitleLabel: "Card Title Label",
        cardTitleValue: "Card Title Value",
        variant: "small",
        columnsData: [
          { key: "field", label: "Field", label_ar: "الحقل" },
          { key: "col1", label: "Value 1", label_ar: "القيمة 1" },
          { key: "col2", label: "Value 2", label_ar: "القيمة 2" },
          { key: "col3", label: "Value 3", label_ar: "القيمة 3" },
        ],
        rowsData: [
          {
            label: "Identity Details",
            label_ar: "تفاصيل الهوية",
            extraItems: [
              {
                label: "UAE National ID",
                label_ar: "الهوية الوطنية الإماراتية",
                value: "78273890399292",
                value_ar: "78273890399292",
              },
              {
                label: "MOI Unified Number",
                label_ar: "رقم وزارة الداخلية الموحد",
                value: "330928",
                value_ar: "330928",
              },
            ],
          },
          {
            label: "Nationality Details",
            label_ar: "تفاصيل الجنسية",
            extraItems: [
              {
                label: "Nationality",
                label_ar: "الجنسية",
                value: "United Arab Emirates",
                value_ar: "الإمارات العربية المتحدة",
              },
              {
                label: "Share",
                label_ar: "الحصة",
                value: "100% Allotment 50% Share",
                value_ar: "100% تخصيص 50% حصة",
              },
            ],
          },
        ],
        showFooterButtons: true,
        footerButton: [
          { title: "Edit", title_ar: "تعديل", onClick: () => {} },
          { title: "View", title_ar: "عرض", onClick: () => {} },
        ],
        handlePaginationInternally: false,
        showPagination: true,
        currentPage: 1,
        totalPages: 10,
        pageSize: 5,
        onPageChange: () => {},
      },
    },
  ],
  [
    {
      type: "genericCards",
      data: {
        title: "Tenant Info",
        title_ar: "معلومات المستأجر",
        cardsData: [
          {
            rowsData: [
              { label: "Name", value: "John Doe" },
              { label: "Status", value: "Active" },
              { label: "Contract", value: "Annual" },
              { label: "Unit", value: "A-101" },
            ],
            showMoreButton: true,
            defaultShowMore: false,
            buttons: [
              { title: "Edit", title_ar: "تعديل", onClick: () => {} },
              { title: "View", title_ar: "عرض", onClick: () => {} },
            ],
            showFooterButtons: true,
            footerButton: [
              {
                title: "Edit",
                title_ar: "تعديل",
                type: "primary",
                onClick: () => {},
              },
              {
                title: "View",
                title_ar: "عرض",
                type: "secondary",
                onClick: () => {},
              },
            ],
          },
        ],
      },
    },
    {
      type: "genericCard",
      data: {
        title: "Tenant Info with Generic Card",
        title_ar: "معلومات المستأجر",
        cardTitleLabel: "Tenant Info with Generic Card",
        cardTitleLabel_ar: "معلومات المستأجر",
        variant: "small",
        rowsData: [
          { label: "Name", value: "John Doe" },
          { label: "Status", value: "Active" },
          { label: "Contract", value: "Annual" },
          { label: "Unit", value: "A-101" },
        ],
        showMoreButton: true,
        defaultShowMore: false,
        showButtons: true,
        buttons: [
          { title: "Edit", title_ar: "تعديل", onClick: () => {} },
          { title: "View", title_ar: "عرض", onClick: () => {} },
        ],
      },
    },
    {
      type: "interactionHistory",
      data: {
        totalCompletedSteps: 0,
        totalSteps: 6,
        wfiStepList: [
          {
            title: "Registration",
            title_ar: "التسجيل",
            stepConst: "ElmsAllotmentOfRanchPlots.Registration",
            stepStatusE: "Completed",
            stepStatusA: "مكتمل",
            comments: "Application submitted successfully",
            isCurrent: false,
            completedByCustomerNameE: "John Doe",
            completedByCustomerNameA: "جون دو",
            completeDate: "2025-01-15",
          },
          {
            title: "Assignment",
            title_ar: "التخصيص",
            stepConst: "ElmsAllotmentOfRanchPlots.Assignment",
            stepStatusE: "In Progress",
            stepStatusA: "قيد التنفيذ",
            comments: "Under review by the registration team",
            isCurrent: true,
            completedByCustomerNameE: "Jane Smith",
            completedByCustomerNameA: "جين سميث",
            completeDate: "2025-01-18",
          },
          {
            title: "Approval",
            title_ar: "الموافقة",
            stepConst: "ElmsAllotmentOfRanchPlots.Approval",
            stepStatusE: "Pending",
            stepStatusA: "قيد الانتظار",
            isCurrent: false,
          },
        ],
      },
    },
    {
      type: "documents",
      title: "Documents",
      title_ar: "وثائق",
      data: {
        documents: [
          {
            documentName: "Identity Document",
            documentName_ar: "وثيقة الهوية",
            isUploaded: true,
            downloadUrl: "https://example.com/document1.pdf",
          },
          {
            documentName: "Property Deed",
            documentName_ar: "سند الملكية",
            isUploaded: true,
            downloadUrl: "https://example.com/document2.pdf",
          },
        ],
        type: "base",
      },
    },
  ],
];

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

export default function App() {
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    status: "success",
  });

  // Input states
  const [textValue, setTextValue] = useState("");
  const [textErrorValue, setTextErrorValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [radioChecked, setRadioChecked] = useState("yes");
  const [checkboxFieldChecked, setCheckboxFieldChecked] = useState(false);
  const [radioFieldChecked, setRadioFieldChecked] = useState("yes");
  const [currencyValue, setCurrencyValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [switchOn, setSwitchOn] = useState<"Standard" | "Compact">("Standard");
  const [page, setPage] = useState(3);
  const [botStatus, setBotStatus] = useState<"open" | "close">("close");

  axios.defaults.baseURL =
    "https://onehub-runtime-backend-dncuhce5dygpbydu.canadacentral-01.azurewebsites.net/";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    (async function () {
      await axios.post(`/dmt/login`, { email: "admin", password: "321" });
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <Layout
            language={LANG}
            isEditing={false}
            showHeader
            showFooter
            bottomMargin={20}
            topMargin={50}
            toast={toast}
          >
            <View style={styles.container}>
              <SearchAllotment platform="mobile" />
              <SearchTenancyContract platform="mobile" />
              <DariPlotSearch platform="mobile" />
              <DariOwnerSearch platform="mobile" />
              {/* ── Typography ─────────────────────────────────── */}
              <SectionHeader title="Typography" />
              <Typography
                language={LANG}
                variant="h1"
                text="العنوان الرئيسي"
                text_ar="العنوان الرئيسي"
                color="default"
              />
              <Typography
                language={LANG}
                variant="h2"
                text="العنوان الثاني"
                text_ar="العنوان الثاني"
                color="primary"
              />
              <Typography
                language={LANG}
                variant="h3"
                text="العنوان الثالث"
                text_ar="العنوان الثالث"
                color="dimmed"
              />
              <Typography
                language={LANG}
                variant="text-lg"
                text="نص كبير"
                text_ar="نص كبير"
                color="default"
              />
              <Typography
                language={LANG}
                variant="text-md"
                text="نص متوسط"
                text_ar="نص متوسط"
                color="link"
              />
              <Typography
                language={LANG}
                variant="text-sm"
                text="نص صغير"
                text_ar="نص صغير"
                color="dimmed"
              />
              <Typography
                language={LANG}
                variant="text-bold-lg"
                text="نص عريض كبير"
                text_ar="نص عريض كبير"
                color="default"
              />

              {/* ── Breadcrumb ──────────────────────────────────── */}
              <SectionHeader title="Breadcrumb" />
              <Breadcrumb
                language={LANG}
                items={[
                  { label: "Home", label_ar: "الرئيسية" },
                  { label: "Properties", label_ar: "العقارات" },
                  { label: "Land Allocation", label_ar: "تخصيص الأراضي" },
                ]}
                selectedItemIndex={2}
              />

              {/* ── TitleBar ─────────────────────────────────────── */}
              <SectionHeader title="TitleBar" />
              <TitleBar
                language={LANG}
                title="تخصيص الأراضي"
                title_ar="تخصيص الأراضي"
                acronym="LA"
                showAcronym
                showTitle
                showButton
                buttonLabel="طلب جديد"
                buttonLabel_ar="طلب جديد"
                buttonType="primary"
                onClick={() => {}}
              />
              <TitleBar
                language={LANG}
                title="تخصيص الأراضي"
                title_ar="تخصيص الأراضي"
                showAcronym={false}
                showButton={false}
              />

              {/* ── Logo ─────────────────────────────────────────── */}
              <SectionHeader title="Logo" />
              <View
                style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
              >
                <Logo type="icon" width={40} height={44} />
                <Logo type="hub" width={60} height={40} />
              </View>

              {/* ── Avatar ───────────────────────────────────────── */}
              <SectionHeader title="Avatar" />
              <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                <Avatar initials="عل" avatarSize={48} status="complete" />
                <Avatar initials="مح" avatarSize={48} status="inProgress" />
                <Avatar initials="فا" avatarSize={48} status="pending" />
                <Avatar initials="زي" avatarSize={48} status="failed" />
                <Avatar avatarSize={48} />
              </View>

              {/* ── ProfileIconStatus ────────────────────────────── */}
              <SectionHeader title="ProfileIconStatus" />
              <View style={{ flexDirection: "row", gap: 16 }}>
                <ProfileIconStatus status="pending" width={32} height={32} />
                <ProfileIconStatus status="inProgress" width={32} height={32} />
                <ProfileIconStatus status="complete" width={32} height={32} />
                <ProfileIconStatus status="failed" width={32} height={32} />
              </View>

              {/* ── StatusBalls ──────────────────────────────────── */}
              <SectionHeader title="StatusBalls" />
              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <StatusBalls status="pending" width={24} height={24} />
                <StatusBalls status="inProgress" width={24} height={24} />
                <StatusBalls status="complete" width={24} height={24} />
                <StatusBalls status="failed" width={24} height={24} />
                <StatusBalls status="fixed" width={24} height={24} />
              </View>

              {/* ── Buttons ──────────────────────────────────────── */}
              <SectionHeader title="Buttons — All Types (Medium)" />
              <View style={{ gap: 12 }}>
                <Buttons
                  language={LANG}
                  title="Primary"
                  title_ar="رئيسي"
                  type="primary"
                  size="m"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="Secondary"
                  title_ar="ثانوي"
                  type="secondary"
                  size="m"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="Tertiary"
                  title_ar="ثلاثي"
                  type="tertiary"
                  size="m"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="Text Link"
                  title_ar="رابط نص"
                  type="text-link"
                  size="m"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="Delete"
                  title_ar="حذف"
                  type="delete"
                  size="m"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="Primary Disabled"
                  title_ar="رئيسي معطّل"
                  type="primary"
                  size="m"
                  disabled
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="Secondary Disabled"
                  title_ar="ثانوي معطّل"
                  type="secondary"
                  size="m"
                  disabled
                  onClick={() => {}}
                />
              </View>

              <SectionHeader title="Buttons — Sizes" />
              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <Buttons
                  language={LANG}
                  title="S"
                  title_ar="صغير"
                  type="primary"
                  size="s"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="M"
                  title_ar="متوسط"
                  type="primary"
                  size="m"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="L"
                  title_ar="كبير"
                  type="primary"
                  size="l"
                  onClick={() => {}}
                />
                <Buttons
                  language={LANG}
                  title="Full Width"
                  title_ar="عرض كامل"
                  type="primary"
                  size="m"
                  fullWidth
                  onClick={() => {}}
                />
              </View>

              {/* ── AddButton ────────────────────────────────────── */}
              <SectionHeader title="AddButton" />
              <View style={{ flexDirection: "row", gap: 16 }}>
                <AddButton onClick={() => {}} />
                <AddButton disabled />
              </View>

              {/* ── AddMoreButton ────────────────────────────────── */}
              <SectionHeader title="AddMoreButton" />
              <AddMoreButton
                language={LANG}
                title="Add Document"
                title_ar="إضافة مستند"
                onClick={() => {}}
              />

              {/* ── SwitchButton ─────────────────────────────────── */}
              <SectionHeader title="SwitchButton" />
              <SwitchButton
                type={switchOn}
                onToggle={() =>
                  setSwitchOn(switchOn === "Standard" ? "Compact" : "Standard")
                }
              />

              {/* ── Label ────────────────────────────────────────── */}
              <SectionHeader title="Label" />
              <Label
                language={LANG}
                label="Label Required"
                label_ar="التسمية مطلوبة"
                required
              />
              <Label
                language={LANG}
                label="Label Optional"
                label_ar="التسمية اختيارية"
              />
              <Label
                language={LANG}
                label="Label Disabled"
                label_ar="تسمية معطّلة"
                disabled
              />

              {/* ── Caption ──────────────────────────────────────── */}
              <SectionHeader title="Caption" />
              <Caption
                language={LANG}
                captionLeft="Notes"
                captionLeft_ar="ملاحظات"
                captionRight="0/200"
                captionRight_ar="٠/٢٠٠"
              />
              <Caption
                language={LANG}
                captionLeft=""
                captionLeft_ar=""
                captionRight=""
                captionRight_ar=""
                hasError
                errorMessage="This field is required"
                errorMessage_ar="هذا الحقل مطلوب"
              />

              {/* ── TextInput ─────────────────────────────────────── */}
              <SectionHeader title="TextInput" />
              <TextInput
                language={LANG}
                label="Full Name"
                label_ar="الاسم الكامل"
                placeholder="Enter full name"
                placeholder_ar="أدخل الاسم الكامل"
                value={textValue}
                onChange={setTextValue}
                required
              />
              <TextInput
                language={LANG}
                label="Email (Error)"
                label_ar="البريد الإلكتروني (خطأ)"
                placeholder="Enter email"
                placeholder_ar="أدخل البريد الإلكتروني"
                value={textErrorValue}
                onChange={setTextErrorValue}
                hasError
                errorMessage="Invalid email address"
                errorMessage_ar="عنوان البريد الإلكتروني غير صالح"
                captionLeft="Required"
                captionLeft_ar="مطلوب"
              />
              <TextInput
                language={LANG}
                label="Disabled Field"
                label_ar="حقل معطّل"
                placeholder="Cannot edit"
                placeholder_ar="لا يمكن التعديل"
                value="readonly content"
                onChange={() => {}}
                disabled
              />

              {/* ── TextArea ──────────────────────────────────────── */}
              <SectionHeader title="TextArea" />
              <TextArea
                language={LANG}
                label="Remarks"
                label_ar="الملاحظات"
                placeholder="Enter your remarks here"
                placeholder_ar="أدخل ملاحظاتك هنا"
                value={textAreaValue}
                onChange={setTextAreaValue}
                captionRight="0/500"
                captionRight_ar="٠/٥٠٠"
              />
              <TextArea
                language={LANG}
                label="Remarks (Error)"
                label_ar="الملاحظات (خطأ)"
                placeholder="Enter remarks"
                placeholder_ar="أدخل الملاحظات"
                value=""
                onChange={() => {}}
                hasError
                errorMessage="Remarks cannot be empty"
                errorMessage_ar="لا يمكن أن تكون الملاحظات فارغة"
              />

              {/* ── Select ────────────────────────────────────────── */}
              <SectionHeader title="Select" />
              <Select
                language={LANG}
                label="Property Type"
                label_ar="نوع العقار"
                placeholder="Choose type"
                placeholder_ar="اختر النوع"
                title="Property Type"
                title_ar="نوع العقار"
                options={DROPDOWN_OPTIONS}
                checked={selectValue}
                onChange={setSelectValue}
                required
              />
              <Select
                language={LANG}
                label="Zone (Error)"
                label_ar="المنطقة (خطأ)"
                placeholder="Choose zone"
                placeholder_ar="اختر المنطقة"
                options={DROPDOWN_OPTIONS}
                checked=""
                onChange={() => {}}
                hasError
                errorMessage="Please select a zone"
                errorMessage_ar="يرجى اختيار المنطقة"
              />
              <Select
                language={LANG}
                label="Disabled Select"
                label_ar="قائمة معطّلة"
                placeholder="Cannot select"
                placeholder_ar="لا يمكن الاختيار"
                options={DROPDOWN_OPTIONS}
                checked=""
                onChange={() => {}}
                disabled
              />

              {/* ── MultiSelect ───────────────────────────────────── */}
              <SectionHeader title="MultiSelect" />
              <MultiSelect
                language={LANG}
                label="Services"
                label_ar="الخدمات"
                placeholder="Select services"
                placeholder_ar="اختر الخدمات"
                title="Available Services"
                title_ar="الخدمات المتاحة"
                options={DROPDOWN_OPTIONS}
                value={multiSelectValue}
                onChange={setMultiSelectValue}
                required
              />

              {/* ── CheckboxInput ──────────────────────────────────── */}
              <SectionHeader title="CheckboxInput" />
              <CheckboxInput
                language={LANG}
                label="Select Permissions"
                label_ar="اختر الصلاحيات"
                options={CHECKBOX_OPTIONS}
                value={checkboxValues}
                onChange={setCheckboxValues}
                required
              />
              <CheckboxInput
                language={LANG}
                label="Permissions (Error)"
                label_ar="الصلاحيات (خطأ)"
                options={CHECKBOX_OPTIONS}
                value={[]}
                onChange={() => {}}
                hasError
                errorMessage="At least one option is required"
                errorMessage_ar="يجب اختيار خيار واحد على الأقل"
              />

              {/* ── CheckboxField ──────────────────────────────────── */}
              <SectionHeader title="CheckboxField" />
              <CheckboxField
                id="agree"
                language={LANG}
                label="I agree to the terms"
                label_ar="أوافق على الشروط"
                checked={checkboxFieldChecked}
                onChange={(_id, val) => setCheckboxFieldChecked(val)}
              />
              <CheckboxField
                id="agree2"
                language={LANG}
                label="Disabled checked"
                label_ar="محدد ومعطّل"
                checked
                disabled
                onChange={() => {}}
              />
              <CheckboxField
                id="agree3"
                language={LANG}
                label="Error state"
                label_ar="حالة الخطأ"
                checked={false}
                hasError
                onChange={() => {}}
              />

              {/* ── RadioInput ────────────────────────────────────── */}
              <SectionHeader title="RadioInput" />
              <RadioInput
                language={LANG}
                label="Ownership Type"
                label_ar="نوع الملكية"
                options={RADIO_OPTIONS}
                checked={radioChecked}
                onChange={setRadioChecked}
                required
              />
              <RadioInput
                language={LANG}
                label="Status (Error)"
                label_ar="الحالة (خطأ)"
                options={RADIO_OPTIONS}
                checked=""
                onChange={() => {}}
                hasError
                errorMessage="Please select an option"
                errorMessage_ar="يرجى اختيار خيار"
              />

              {/* ── RadioField ────────────────────────────────────── */}
              <SectionHeader title="RadioField" />
              <View style={{ gap: 8 }}>
                {RADIO_OPTIONS.map((opt) => (
                  <RadioField
                    key={opt.value}
                    id={opt.value}
                    language={LANG}
                    label={opt.label}
                    label_ar={opt.label_ar}
                    checked={radioFieldChecked}
                    onChange={(id) => setRadioFieldChecked(id)}
                  />
                ))}
                <RadioField
                  id="disabled-radio"
                  language={LANG}
                  label="Disabled"
                  label_ar="معطّل"
                  checked=""
                  disabled
                  onChange={() => {}}
                />
              </View>

              {/* ── DateSelect ────────────────────────────────────── */}
              <SectionHeader title="DateSelect" />
              <DateSelect
                language={LANG}
                placeholder="Select date"
                placeholder_ar="اختر التاريخ"
                label="Application Date"
                label_ar="تاريخ الطلب"
                required
                onDateChange={() => {}}
              />
              <DateSelect
                language={LANG}
                placeholder="Select date"
                placeholder_ar="اختر التاريخ"
                label="Date (Error)"
                label_ar="التاريخ (خطأ)"
                hasError
                errorMessage="Date is required"
                errorMessage_ar="التاريخ مطلوب"
                onDateChange={() => {}}
              />
              <DateSelect
                language={LANG}
                placeholder="Cannot select"
                placeholder_ar="لا يمكن الاختيار"
                label="Date (Disabled)"
                label_ar="التاريخ (معطّل)"
                disabled
                onDateChange={() => {}}
              />

              {/* ── CurrencyInput ─────────────────────────────────── */}
              <SectionHeader title="CurrencyInput" />
              <CurrencyInput
                language={LANG}
                label="Property Value"
                label_ar="قيمة العقار"
                placeholder="0.00"
                placeholder_ar="٠.٠٠"
                value={currencyValue}
                onChange={setCurrencyValue}
                currencySymbol="AED"
                required
              />
              <CurrencyInput
                language={LANG}
                label="Amount (Error)"
                label_ar="المبلغ (خطأ)"
                placeholder="0.00"
                placeholder_ar="٠.٠٠"
                value=""
                onChange={() => {}}
                hasError
                errorMessage="Amount is required"
                errorMessage_ar="المبلغ مطلوب"
              />

              {/* ── NumberInput ───────────────────────────────────── */}
              <SectionHeader title="NumberInput" />
              <NumberInput
                language={LANG}
                label="Plot Area (m²)"
                label_ar="مساحة القطعة (م²)"
                placeholder="Enter area"
                placeholder_ar="أدخل المساحة"
                value={numberValue}
                onChange={setNumberValue}
                required
              />
              <NumberInput
                language={LANG}
                label="Area (Disabled)"
                label_ar="المساحة (معطّل)"
                placeholder="Cannot edit"
                placeholder_ar="لا يمكن التعديل"
                value="500"
                onChange={() => {}}
                disabled
              />

              {/* ── PhoneInput ────────────────────────────────────── */}
              <SectionHeader title="PhoneInput" />
              <PhoneInput
                language={LANG}
                label="Mobile Number"
                label_ar="رقم الجوال"
                placeholder="5X XXX XXXX"
                placeholder_ar="5X XXX XXXX"
                value={phoneValue}
                onChange={setPhoneValue}
                phoneCode="+971"
                required
              />
              <PhoneInput
                language={LANG}
                label="Phone (Error)"
                label_ar="الهاتف (خطأ)"
                placeholder="5X XXX XXXX"
                placeholder_ar="5X XXX XXXX"
                value=""
                onChange={() => {}}
                hasError
                errorMessage="Invalid phone number"
                errorMessage_ar="رقم الهاتف غير صالح"
              />

              {/* ── Toast (standalone) ───────────────────────────── */}
              <SectionHeader title="Toast" />
              <Toast message="تم حفظ السجل بنجاح!" status="success" />
              <Toast message="فشل رفع الملف. تحقق من الاتصال." status="error" />
              <Toast message="طلبك قيد المراجعة." status="information" />
              <Toast message="يلزم اتخاذ إجراء." status="action" />

              {/* ── Tooltip ───────────────────────────────────────── */}
              <SectionHeader title="Tooltip" />
              <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                <Tooltip
                  language={LANG}
                  text="Top Left"
                  text_ar="أعلى اليسار"
                  direction="none"
                />
                <Tooltip
                  language={LANG}
                  text="Info text"
                  text_ar="نص المعلومات"
                  direction="none"
                />
              </View>

              {/* ── RadioCard ─────────────────────────────────────── */}
              <SectionHeader title="RadioCard" />
              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                <RadioCard
                  language={LANG}
                  id="rc1"
                  label="Individual"
                  label_ar="فرد"
                  clicked
                  onClick={() => {}}
                />
                <RadioCard
                  language={LANG}
                  id="rc2"
                  label="Company"
                  label_ar="شركة"
                  clicked={false}
                  onClick={() => {}}
                />
                <RadioCard
                  language={LANG}
                  id="rc3"
                  label="Disabled"
                  label_ar="معطّل"
                  disabled
                  onClick={() => {}}
                />
              </View>

              {/* ── Pagination ────────────────────────────────────── */}
              <SectionHeader title="Pagination" />
              <Pagination
                language={LANG}
                currentPage={page}
                totalPages={10}
                onPageChange={setPage}
                pageSize={10}
                totalCount={98}
                showPageNumbers
                showBottomText
                position="center"
              />

              {/* ── FilterBar ─────────────────────────────────────── */}
              <SectionHeader title="FilterBar" />
              <FilterBar
                language={LANG}
                searchValue=""
                onSearchChange={() => {}}
                searchPlaceholder="Search"
                searchPlaceholder_ar="بحث"
                sortOptions={["الأحدث أولاً", "الأقدم أولاً"]}
                applicationOptions={["طلباتي", "جميع الطلبات"]}
                filterButtonLabel="All Filters"
                filterButtonLabel_ar="جميع المرشحات"
                theme="light"
              />

              {/* ── Cards ─────────────────────────────────────────── */}
              <SectionHeader title="Cards — Status Types" />
              <View style={{ gap: 12 }}>
                <Cards
                  language={LANG}
                  type="pending"
                  version="default"
                  direction="horizontal"
                  action="Pending Review"
                  action_ar="قيد المراجعة"
                  stepName="Document Submission"
                  stepName_ar="تقديم المستند"
                  userName="فرزانة شاه"
                  userName_ar="فرزانة شاه"
                  role="مراجع"
                  role_ar="مراجع"
                />
                <Cards
                  language={LANG}
                  type="success"
                  version="default"
                  direction="horizontal"
                  action="Approved"
                  action_ar="تمت الموافقة"
                  stepName="Final Approval"
                  stepName_ar="الموافقة النهائية"
                  userName="أحمد علي"
                  userName_ar="أحمد علي"
                  role="مدير"
                  role_ar="مدير"
                />
                <Cards
                  language={LANG}
                  type="failed"
                  version="default"
                  direction="horizontal"
                  action="Rejected"
                  action_ar="مرفوض"
                  stepName="Verification"
                  stepName_ar="التحقق"
                  userName="سارة محمد"
                  userName_ar="سارة محمد"
                  role="محقق"
                  role_ar="محقق"
                />
                <Cards
                  language={LANG}
                  type="action"
                  version="default"
                  direction="horizontal"
                  action="Action Required"
                  action_ar="مطلوب اتخاذ إجراء"
                  stepName="Payment"
                  stepName_ar="الدفع"
                  userName="خالد عمر"
                  userName_ar="خالد عمر"
                  role="محاسب"
                  role_ar="محاسب"
                />
              </View>

              <SectionHeader title="Cards — Vertical Direction" />
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Cards
                  language={LANG}
                  type="pending"
                  version="default"
                  direction="vertical"
                  action="Pending"
                  action_ar="معلق"
                  stepName="Review"
                  stepName_ar="مراجعة"
                  userName="مستخدم"
                  userName_ar="مستخدم"
                />
                <Cards
                  language={LANG}
                  type="success"
                  version="default"
                  direction="vertical"
                  action="Done"
                  action_ar="مكتمل"
                  stepName="Signed"
                  stepName_ar="موقّع"
                  userName="مستخدم"
                  userName_ar="مستخدم"
                />
              </View>

              {/* ── ApplicationCard ───────────────────────────────── */}
              <SectionHeader title="ApplicationCard" />
              <View style={{ gap: 12 }}>
                <ApplicationCard
                  totalDots={6}
                  cardsData={{
                    id: "APP-001234",
                    remaining: "متبقي ٣ أيام",
                    stage: { complete: 3, approval: 1, inprogress: 1 },
                  }}
                  onClick={() => {}}
                />
                <ApplicationCard
                  totalDots={6}
                  cardsData={{
                    id: "APP-005678",
                    remaining: "متبقي ١ يوم",
                    stage: { complete: 6, approval: 0, inprogress: 0 },
                  }}
                  onClick={() => {}}
                />
              </View>

              {/* ── Prompt ───────────────────────────────────────── */}
              <SectionHeader title="Prompt" />
              <Prompt
                language={LANG}
                title="هل أنت متأكد؟"
                title_ar="هل أنت متأكد؟"
                subtitle="لن تتمكن من التراجع عن هذا الإجراء."
                subtitle_ar="لن تتمكن من التراجع عن هذا الإجراء."
                yesText="Yes"
                yesText_ar="نعم"
                noText="No"
                noText_ar="لا"
                onYesClick={() => {}}
                onNoClick={() => {}}
              />

              {/* ── AuditRemarks ──────────────────────────────────── */}
              <SectionHeader title="AuditRemarks" />
              <AuditRemarks
                language={LANG}
                title="تدقيق الطلب"
                title_ar="تدقيق الطلب"
                theme="dark"
                agent={{
                  name: "فرزانة شاه",
                  email: "fshah@adrec.org",
                  phone: "+971 898 1234 7654",
                  image: "",
                }}
                applicationDetails={[
                  {
                    applicationNumber: "APP-001234",
                    applicationDate: "2025-04-27",
                    referenceNumber: "REF-56789",
                  },
                ]}
                plots={[
                  {
                    code: "PLT-4567",
                    municipality: "بلدية أبوظبي",
                    zone: "المنطقة ٥",
                    sector: "القطاع أ",
                    address: "١٢٣ شارع المطار، أبوظبي",
                  },
                ]}
                owners={[
                  {
                    name: "جين سميث",
                    familyBook: "FamilyBook123",
                    city: "أبوظبي",
                    propertyCard: "PropertyCard456",
                  },
                ]}
                documents={[]}
                value=""
                onChange={() => {}}
                onOwnerClick={() => {}}
                onPlotClick={() => {}}
              />

              {/* ── Signature ─────────────────────────────────────── */}
              <SectionHeader title="Signature" />
              <Signature
                language={LANG}
                title="Sign to Approve"
                title_ar="وقّع للموافقة"
                buttonText="Approve"
                buttonText_ar="موافق"
                theme="dark"
                onSubmit={() => {}}
              />

              {/* ── UploadDocuments ───────────────────────────────── */}
              <SectionHeader title="UploadDocuments" />
              <UploadDocuments
                language={LANG}
                theme="dark"
                type="default"
                handleUploadInternally={false}
                documents={[
                  {
                    documentName: "Title Deed",
                    documentName_ar: "صك الملكية",
                    isUploaded: false,
                  },
                  {
                    documentName: "Emirates ID",
                    documentName_ar: "الهوية الإماراتية",
                    isUploaded: true,
                  },
                  {
                    documentName: "NOC Certificate",
                    documentName_ar: "شهادة عدم الممانعة",
                    isUploaded: false,
                  },
                ]}
                onFileChange={() => {}}
              />

              {/* ── OwnerCard ─────────────────────────────────────── */}
              <SectionHeader title="OwnerCard — Default (EN, View+Plots+Edit)" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton={false}
                language="en"
                itemsPerRow="1"
                isExpandable
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — With Delete Button" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton
                language="en"
                itemsPerRow="1"
                isExpandable
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — Two Columns" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton={false}
                language="en"
                itemsPerRow="2"
                isExpandable
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — Arabic (RTL)" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton={false}
                language="ar"
                itemsPerRow="1"
                isExpandable
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — Arabic Two Columns" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton={false}
                language="ar"
                itemsPerRow="2"
                isExpandable
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — Single Owner" />
              <OwnerCard
                owners={[SAMPLE_OWNERS[0]]}
                title="Owner Details"
                title_ar="تفاصيل المالك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton={false}
                language="en"
                itemsPerRow="1"
                isExpandable
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — Default Show More" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton={false}
                language="en"
                itemsPerRow="1"
                isExpandable
                defaultShowMore
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — Not Expandable" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton
                showEditButton
                showDeleteButton={false}
                language="en"
                itemsPerRow="1"
                isExpandable={false}
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              <SectionHeader title="OwnerCard — Minimal Buttons (View Only)" />
              <OwnerCard
                owners={SAMPLE_OWNERS}
                title="Owners"
                title_ar="الملاك"
                showViewButton
                showPlotsButton={false}
                showEditButton={false}
                showDeleteButton={false}
                language="en"
                itemsPerRow="1"
                isExpandable
                defaultShowMore={false}
                platform="mobile"
                onPressAction={() => {}}
              />

              {/* ── PlotCard ──────────────────────────────────────── */}
              <SectionHeader title="PlotCard — Default (EN, View Only)" />
              <PlotCard
                plots={SAMPLE_PLOTS}
                title="Plots"
                title_ar="القطع"
                showViewButton
                showChangePlotButton={false}
                showOwnersButton={false}
                language="en"
                defaultShowMore={false}
                defaultExpanded
                platform="mobile"
                onPressView={() => {}}
              />

              <SectionHeader title="PlotCard — With Change Plot Button" />
              <PlotCard
                plots={SAMPLE_PLOTS}
                title="Plots"
                title_ar="القطع"
                showViewButton
                showChangePlotButton
                showOwnersButton={false}
                language="en"
                defaultShowMore={false}
                defaultExpanded
                platform="mobile"
                onPressView={() => {}}
                onPressPlotChange={() => {}}
              />

              <SectionHeader title="PlotCard — With Owners Button" />
              <PlotCard
                plots={SAMPLE_PLOTS}
                title="Plots"
                title_ar="القطع"
                showViewButton
                showChangePlotButton={false}
                showOwnersButton
                language="en"
                defaultShowMore={false}
                defaultExpanded
                platform="mobile"
                onPressView={() => {}}
                onPressOwners={() => {}}
              />

              <SectionHeader title="PlotCard — Arabic (RTL)" />
              <PlotCard
                plots={SAMPLE_PLOTS}
                title="Plots"
                title_ar="القطع"
                showViewButton
                showChangePlotButton={false}
                showOwnersButton={false}
                language="ar"
                defaultShowMore={false}
                defaultExpanded
                platform="mobile"
                onPressView={() => {}}
              />

              <SectionHeader title="PlotCard — Single Plot" />
              <PlotCard
                plots={[SAMPLE_PLOTS[0]]}
                title="Plot Details"
                title_ar="تفاصيل القطعة"
                showViewButton
                showChangePlotButton={false}
                showOwnersButton={false}
                language="en"
                defaultShowMore={false}
                defaultExpanded
                platform="mobile"
                onPressView={() => {}}
              />

              <SectionHeader title="PlotCard — Default Show More" />
              <PlotCard
                plots={SAMPLE_PLOTS}
                title="Plots"
                title_ar="القطع"
                showViewButton
                showChangePlotButton={false}
                showOwnersButton={false}
                language="en"
                defaultShowMore
                defaultExpanded
                platform="mobile"
                onPressView={() => {}}
              />

              <SectionHeader title="PlotCard — Collapsed (defaultExpanded=false)" />
              <PlotCard
                plots={SAMPLE_PLOTS}
                title="Plots"
                title_ar="القطع"
                showViewButton
                showChangePlotButton={false}
                showOwnersButton={false}
                language="en"
                defaultShowMore={false}
                defaultExpanded={false}
                platform="mobile"
                onPressView={() => {}}
              />

              {/* ── ApplicationSummary ───────────────────────────── */}
              <SectionHeader title="ApplicationSummary — Default (EN, 2 Columns)" />
              <ApplicationSummary
                title="Application Summary"
                title_ar="ملخص الطلب"
                language="en"
                platform="mobile"
                data={APP_SUMMARY_DATA}
                DocumentsComponent={MobileDocumentsComponent}
              />

              <SectionHeader title="ApplicationSummary — Arabic / RTL (2 Columns)" />
              <ApplicationSummary
                title="Application Summary"
                title_ar="ملخص الطلب"
                language="ar"
                platform="mobile"
                data={APP_SUMMARY_DATA}
                DocumentsComponent={MobileDocumentsComponent}
              />

              <SectionHeader title="ApplicationSummary — Single Column (EN)" />
              <ApplicationSummary
                title="Application Summary"
                title_ar="ملخص الطلب"
                language="en"
                platform="mobile"
                data={[APP_SUMMARY_DATA[0]]}
                DocumentsComponent={MobileDocumentsComponent}
              />

              <SectionHeader title="ApplicationSummary — Second Column Only (GenericCards / Interaction / Documents)" />
              <ApplicationSummary
                title="Application Summary"
                title_ar="ملخص الطلب"
                language="en"
                platform="mobile"
                data={[APP_SUMMARY_DATA[1]]}
                DocumentsComponent={MobileDocumentsComponent}
              />

              {/* ── Bot ───────────────────────────────────────────── */}
              <SectionHeader title="Bot" />
              <Bot
                language={LANG}
                message="Hello! How can I help you today?"
                message_ar="مرحبا! كيف يمكنني مساعدتك اليوم؟"
                status={botStatus}
                onClick={(s) => setBotStatus(s)}
              />
            </View>
          </Layout>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  sectionHeader: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#008dcb",
    borderRadius: 6,
  },
  sectionHeaderText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
