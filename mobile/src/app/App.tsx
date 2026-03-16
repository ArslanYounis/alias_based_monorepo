import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Label } from "@platform/Label";
import { Caption } from "@platform/Caption";
import { Tooltip } from "@platform/Tooltip";
import { Checkbox } from "@platform/Checkbox";
import { Radio } from "@platform/Radio";
import { CheckRadioLabel } from "@platform/CheckRadioLabel";
import { AddButton } from "@platform/AddButton";
import { Bk_DateInput } from "@platform/bk_DateInput";
import { Fields } from "@platform/Fields";
import { TextInput } from "@platform/TextInput";
import { PhoneInput } from "@platform/PhoneInput";
import { TextArea } from "@platform/TextArea";
import { Select } from "@platform/Select";
import { MultiSelect } from "@platform/MultiSelect";
import { CurrencyInput } from "@platform/CurrencyInput";
import { NumberInput } from "@platform/NumberInput";
import { DateSelect } from "@platform/DateSelect";
import { CheckboxField } from "@platform/CheckboxField";
import { CheckboxInput } from "@platform/CheckboxInput";
import { RadioField } from "@platform/RadioField";
import { RadioInput } from "@platform/RadioInput";
import { Toast } from "../ui/Toast";
import { Header } from "../ui/Header";
import { Bot } from "../ui/Bot";
import { Buttons } from "../ui/Buttons";
import Settings from "~/assets/svg/icons/Settings";
import SelectArrow from "~/assets/svg/icons/SelectArrow";
import { Typography } from "../ui/Typography";
import { Breadcrumb } from "../ui/Breadcrumb";
import { Pagination } from "../ui/Pagination";
import { AddMoreButton } from "../ui/AddMoreButton";
import { Plus } from "lucide-react-native";
import { Prompt } from "../ui/Prompt";
import { ScreenLoader } from "../ui/ScreenLoader";
import TitleBar from "../components/TitleBar";
import { FilterBar } from "../ui/FilterBar";
import Signature from "../components/Signature";
import { UploadDocuments } from "@platform/UploadDocuments";
import Table from "@shared/components/Table";
import OwnerCard from "@shared/components/OwnerCard";
import PlotCard from "@shared/components/PlotCard";
import ModalTitle from "@shared/components/ModalTitle";
import ModalSteps from "@shared/components/ModalSteps";
import GenericCard from "@shared/components/GenericCard";
import GenericCards from "@shared/components/GenericCards";
import GenericTableCard from "@shared/components/GenericTableCard";
import CardTitle from "@shared/components/CardTitle";
import ViewOwnerDetail from "@shared/components/ViewOwnerDetail";
import ApplicationMessage from "@shared/components/ApplicationMessage";
import { SearchPlot } from "@shared/components/SearchPlot";
import { OwnerSearch } from "@shared/components/OwnerSearch";
import axios from "axios";
import { CustomDrawer } from "../ui/CustomDrawer";
import ViewPlotDetail from "@shared/components/ViewPlotDetail/ViewPlotDetail";
import Payment from "@shared/components/Payment";
import PaymentDetails from "@shared/components/PaymentDetails";
import ApplicationSummary from "@shared/components/ApplicationSummary";

/* ── Shared data ── */
const selectOptions = [
  { label: "Option A", label_ar: "الخيار أ", value: "a" },
  { label: "Option B", label_ar: "الخيار ب", value: "b" },
  { label: "Option C", label_ar: "الخيار ج", value: "c" },
];

const checkOptions = [
  { label: "Choice 1", label_ar: "الخيار ١", value: "1" },
  { label: "Choice 2", label_ar: "الخيار ٢", value: "2" },
  { label: "Choice 3", label_ar: "الخيار ٣", value: "3" },
];

const TOOLTIP_DIRS = [
  "none",
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
  "left-top",
  "left-center",
  "left-bottom",
  "right-top",
  "right-center",
  "right-bottom",
] as const;

export default function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  /* G-0.4 Checkbox */
  const [cbInteractive, setCbInteractive] = useState(false);
  /* G-0.5 Radio */
  const [radioGroup, setRadioGroup] = useState("");
  /* G-0.8 Bk_DateInput */
  const [dateInVal, setDateInVal] = useState("");
  /* G-0.9 Fields */
  const [fText, setFText] = useState("");
  const [fTextarea, setFTextarea] = useState("");
  const [fSelect, setFSelect] = useState("");
  const [fMulti, setFMulti] = useState<string[]>([]);
  const [fDate, setFDate] = useState("");
  const [fCurrency, setFCurrency] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fNumber, setFNumber] = useState("");
  /* G-2 Form state */
  const [tiVal, setTiVal] = useState("");
  const [piVal, setPiVal] = useState("");
  const [taVal, setTaVal] = useState("");
  const [selVal, setSelVal] = useState("");
  const [msVal, setMsVal] = useState<string[]>([]);
  const [curVal, setCurVal] = useState("");
  const [numVal, setNumVal] = useState("");
  const [dsVal, setDsVal] = useState("");
  const [cbfVal, setCbfVal] = useState(false);
  const [cbiVal, setCbiVal] = useState<string[]>([]);
  const [rfVal, setRfVal] = useState("");
  const [riVal, setRiVal] = useState("");
  const [textValue, setTextValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState("");

  axios.defaults.baseURL =
    "https://onehub-runtime-backend-dncuhce5dygpbydu.canadacentral-01.azurewebsites.net/";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    (async function () {
      await axios.post(`/dmt/login`, { email: "admin", password: "321" });
    })();
  }, []);

  const normalizedData: UiBlock[][] = [
    [
      {
        type: "agent",
        data: {
          agent: {
            name: "English Name",
            name_ar: "الاسم العربي",
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
          onPressView: () => console.log("View clicked"),
          onPressPlotChange: () => console.log("Plot change clicked"),
          onPressOwners: () => console.log("Owners clicked"),
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
          showViewButton: true,
          showPlotsButton: true,
          showEditButton: false,
          onPressAction: ({ action, owner }) => console.log(action, owner),
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
                {
                  title: "Edit",
                  title_ar: "تعديل",
                  onClick: () => console.log("Edit clicked"),
                },
                {
                  title: "View",
                  title_ar: "عرض",
                  onClick: () => console.log("View clicked"),
                },
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
            {
              key: "field",
              label: "Field",
              label_ar: "الحقل",
            },
            {
              key: "col1",
              label: "Value 1",
              label_ar: "القيمة 1",
            },
            {
              key: "col2",
              label: "Value 2",
              label_ar: "القيمة 2",
            },
            {
              key: "col3",
              label: "Value 3",
              label_ar: "القيمة 3",
            },
            {
              key: "col4",
              label: "Value 4",
              label_ar: "القيمة 4",
            },
            {
              key: "col5",
              label: "Value 5",
              label_ar: "القيمة 5",
            },
          ],
          rowsData: [
            {
              label: "Identity Details",
              label_ar: "تفاصيل الهوية",
              button: { title: "Hello", onClick: () => alert("hello") },
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
                {
                  label: "Archive Number",
                  label_ar: "رقم الأرشيف",
                  value: "7921",
                  value_ar: "7921",
                },
                {
                  label: "Archive Number",
                  label_ar: "رقم الأرشيف",
                  value: "7921",
                  value_ar: "7921",
                },
                {
                  label: "Archive Number",
                  label_ar: "رقم الأرشيف",
                  value: "7921",
                  value_ar: "7921",
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
                  label: "Share",
                  label_ar: "الحصة",
                  value: "100% Allotment 50% Share",
                  value_ar: "100% تخصيص 50% حصة",
                },

                {
                  label: "Share",
                  label_ar: "الحصة",
                  value: "100% Allotment 50% Share",
                  value_ar: "100% تخصيص 50% حصة",
                },
              ],
            },
            {
              label: "Right Hold Type",
              label_ar: "نوع حق الحيازة",
              extraItems: [
                {
                  value: "Ownership Musataha",
                  value_ar: "ملكية مستطاعة",
                },
                {
                  value: "Ownership Musataha",
                  value_ar: "ملكية مستطاعة",
                },
                {
                  value: "Ownership Musataha",
                  value_ar: "ملكية مستطاعة",
                },
                {
                  value: "Ownership Musataha",
                  value_ar: "ملكية مستطاعة",
                },
                {
                  value: "Ownership Musataha",
                  value_ar: "ملكية مستطاعة",
                },
              ],
            },
          ],
          showFooterButtons: true,
          footerButton: [
            {
              title: "Edit",
              title_ar: "تعديل",
              onClick: () => console.log("Edit clicked"),
            },
            {
              title: "View",
              title_ar: "عرض",
              onClick: () => console.log("View clicked"),
            },
          ],
          handlePaginationInternally: false,
          showPagination: true,
          currentPage: 1,
          totalPages: 10,
          pageSize: 5,
          onPageChange: (page) => console.log(page),
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
                {
                  title: "Edit",
                  title_ar: "تعديل",
                  onClick: () => console.log("Edit clicked"),
                },
                {
                  title: "View",
                  title_ar: "عرض",
                  onClick: () => console.log("View clicked"),
                },
              ],
              showFooterButtons: true,
              footerButton: [
                {
                  title: "Edit",
                  title_ar: "تعديل",
                  type: "primary",
                  onClick: () => console.log("Edit clicked"),
                },
                {
                  title: "View",
                  title_ar: "عرض",
                  type: "secondary",
                  onClick: () => console.log("View clicked"),
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
            {
              title: "Edit",
              title_ar: "تعديل",
              onClick: () => console.log("Edit clicked"),
            },
            {
              title: "View",
              title_ar: "عرض",
              onClick: () => console.log("View clicked"),
            },
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
            {
              documentName: "Proof of Residence",
              documentName_ar: "إثبات الإقامة",
              isUploaded: true,
              downloadUrl: "https://example.com/document3.pdf",
            },
          ],
          type: "base",
        },
      },
    ],
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1, marginTop: 50 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={new QueryClient()}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Language toggle */}
            <Pressable
              style={[styles.toggleBtn, { marginBottom: 24 }]}
              onPress={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
            >
              <Text style={styles.toggleBtnText}>
                Toggle Language ({language})
              </Text>
            </Pressable>

            {/* ═══════════════════════════════════════════════ */}
            {/* G-0 — Foundation / Sub-Components              */}
            {/* ═══════════════════════════════════════════════ */}

            {/* ── G-0.1 Label ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.1 — Label</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <Label
                label="Field Label"
                label_ar="تسمية الحقل"
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <Label
                label="Required Field"
                label_ar="حقل مطلوب"
                required
                language={language}
              />

              <Text style={styles.variantLabel}>
                showInfoIcon=true + tooltipText
              </Text>
              <Label
                label="Info Field"
                label_ar="حقل معلومات"
                showInfoIcon
                tooltipText="This is a tooltip"
                tooltipText_ar="هذه تلميحة"
                language={language}
              />

              <Text style={styles.variantLabel}>required + showInfoIcon</Text>
              <Label
                label="Full Label"
                label_ar="تسمية كاملة"
                required
                showInfoIcon
                tooltipText="Tooltip text"
                tooltipText_ar="نص التلميحة"
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <Label
                label="Disabled Label"
                label_ar="تسمية معطلة"
                disabled
                language={language}
              />

              <Text style={styles.variantLabel}>disabled + showInfoIcon</Text>
              <Label
                label="Disabled Info"
                label_ar="معلومات معطلة"
                disabled
                showInfoIcon
                tooltipText="Disabled tooltip"
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <Label label="Field Label" label_ar="تسمية الحقل" language="ar" />

              <Text style={styles.variantLabel}>
                language=ar + required + showInfoIcon
              </Text>
              <Label
                label="Full Label"
                label_ar="تسمية كاملة"
                required
                showInfoIcon
                tooltipText="Tooltip"
                tooltipText_ar="تلميحة"
                language="ar"
              />
            </View> */}

            {/* ── G-0.2 Caption ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.2 — Caption</Text>

              <Text style={styles.variantLabel}>captionLeft only</Text>
              <Caption
                captionLeft="Left caption"
                captionLeft_ar="تعليق يسار"
                language={language}
              />

              <Text style={styles.variantLabel}>captionRight only</Text>
              <Caption
                captionRight="Right caption"
                captionRight_ar="تعليق يمين"
                language={language}
              />

              <Text style={styles.variantLabel}>
                captionLeft + captionRight
              </Text>
              <Caption
                captionLeft="Left"
                captionLeft_ar="يسار"
                captionRight="Right"
                captionRight_ar="يمين"
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <Caption
                captionLeft="Left"
                hasError
                errorMessage="This field is required"
                errorMessage_ar="هذا الحقل مطلوب"
                language={language}
              />

              <Text style={styles.variantLabel}>
                hasError — error replaces captionLeft
              </Text>
              <Caption
                captionLeft="Hint text"
                captionLeft_ar="نص تلميحي"
                hasError
                errorMessage="Validation error"
                errorMessage_ar="خطأ في التحقق"
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <Caption
                captionLeft="Disabled caption"
                captionLeft_ar="تعليق معطل"
                disabled
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <Caption
                captionLeft="Left"
                captionLeft_ar="يسار"
                captionRight="Right"
                captionRight_ar="يمين"
                language="ar"
              />
            </View> */}

            {/* ── G-0.3 Tooltip ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                G-0.3 — Tooltip (all 13 directions)
              </Text>
              {TOOLTIP_DIRS.map((dir) => (
                <View key={dir} style={styles.tooltipRow}>
                  <Text style={styles.variantLabel}>direction="{dir}"</Text>
                  <Tooltip
                    text={`Tooltip: ${dir}`}
                    text_ar={`تلميحة: ${dir}`}
                    direction={dir}
                    language={language}
                  />
                </View>
              ))}
            </View> */}

            {/* ── G-0.4 Checkbox ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.4 — Checkbox</Text>

              <Text style={styles.variantLabel}>Default (unchecked)</Text>
              <Checkbox id="cb-default" checked={false} onChange={() => {}} />

              <Text style={styles.variantLabel}>checked=true</Text>
              <Checkbox id="cb-checked" checked onChange={() => {}} />

              <Text style={styles.variantLabel}>Interactive (controlled)</Text>
              <Checkbox
                id="cb-interactive"
                checked={cbInteractive}
                onChange={(_id, val) => setCbInteractive(val)}
              />

              <Text style={styles.variantLabel}>disabled + unchecked</Text>
              <Checkbox
                id="cb-dis-un"
                checked={false}
                disabled
                onChange={() => {}}
              />

              <Text style={styles.variantLabel}>disabled + checked</Text>
              <Checkbox id="cb-dis-ch" checked disabled onChange={() => {}} />

              <Text style={styles.variantLabel}>hasError + unchecked</Text>
              <Checkbox
                id="cb-err-un"
                checked={false}
                hasError
                onChange={() => {}}
              />

              <Text style={styles.variantLabel}>hasError + checked</Text>
              <Checkbox id="cb-err-ch" checked hasError onChange={() => {}} />
            </View> */}

            {/* ── G-0.5 Radio ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.5 — Radio</Text>

              <Text style={styles.variantLabel}>Default (unchecked)</Text>
              <Radio id="r-default" checked={false} onChange={() => {}} />

              <Text style={styles.variantLabel}>checked=true</Text>
              <Radio id="r-checked" checked onChange={() => {}} />

              <Text style={styles.variantLabel}>Radio group (interactive)</Text>
              {["opt-a", "opt-b", "opt-c"].map((v) => (
                <Radio
                  key={v}
                  id={v}
                  name="demo-group"
                  checked={radioGroup === v}
                  onChange={(id) => setRadioGroup(id)}
                />
              ))}

              <Text style={styles.variantLabel}>disabled + unchecked</Text>
              <Radio
                id="r-dis-un"
                checked={false}
                disabled
                onChange={() => {}}
              />

              <Text style={styles.variantLabel}>disabled + checked</Text>
              <Radio id="r-dis-ch" checked disabled onChange={() => {}} />

              <Text style={styles.variantLabel}>hasError + unchecked</Text>
              <Radio
                id="r-err-un"
                checked={false}
                hasError
                onChange={() => {}}
              />

              <Text style={styles.variantLabel}>hasError + checked</Text>
              <Radio id="r-err-ch" checked hasError onChange={() => {}} />
            </View> */}

            {/* ── G-0.6 CheckRadioLabel ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.6 — CheckRadioLabel</Text>

              <Text style={styles.variantLabel}>Default (en)</Text>
              <CheckRadioLabel
                label="Accept terms"
                label_ar="أوافق على الشروط"
                language={language}
                onClick={() => {}}
                htmlFor="crl-1"
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <CheckRadioLabel
                label="Disabled label"
                label_ar="تسمية معطلة"
                disabled
                language={language}
                onClick={() => {}}
                htmlFor="crl-2"
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <CheckRadioLabel
                label="Accept terms"
                label_ar="أوافق على الشروط"
                language="ar"
                onClick={() => {}}
                htmlFor="crl-3"
              />

              <Text style={styles.variantLabel}>disabled + language=ar</Text>
              <CheckRadioLabel
                label="Disabled"
                label_ar="معطل"
                disabled
                language="ar"
                onClick={() => {}}
                htmlFor="crl-4"
              />
            </View> */}

            {/* ── G-0.7 AddButton ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.7 — AddButton</Text>

              <Text style={styles.variantLabel}>Default (enabled)</Text>
              <AddButton onClick={() => {}} />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <AddButton disabled onClick={() => {}} />
            </View> */}

            {/* ── G-0.8 Bk_DateInput ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.8 — Bk_DateInput</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <Bk_DateInput
                placeholder="DD/MM/YYYY"
                language={language}
                value={dateInVal}
                onDateChange={(v) => setDateInVal(v ?? "")}
              />

              <Text style={styles.variantLabel}>label + required</Text>
              <Bk_DateInput
                label="Date of Birth"
                placeholder="DD/MM/YYYY"
                required
                language={language}
                value=""
                onDateChange={() => {}}
                captionLeft="left"
                captionRight="right"
              />

              <Text style={styles.variantLabel}>hasError + errMessage</Text>
              <Bk_DateInput
                label="Date"
                placeholder="DD/MM/YYYY"
                hasError
                errMessage="Invalid date"
                language={language}
                value=""
                onDateChange={() => {}}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <Bk_DateInput
                label="Date"
                placeholder="DD/MM/YYYY"
                disabled
                language={language}
                value=""
                onDateChange={() => {}}
              />

              <Text style={styles.variantLabel}>infoText (caption)</Text>
              <Bk_DateInput
                label="Date"
                placeholder="DD/MM/YYYY"
                infoText="Select a valid date"
                language={language}
                value=""
                onDateChange={() => {}}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <Bk_DateInput
                label="التاريخ"
                placeholder="يوم/شهر/سنة"
                language="ar"
                value=""
                onDateChange={() => {}}
              />
            </View> */}

            {/* ── G-0.9 Fields ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.9 — Fields</Text>

              <Text style={styles.variantLabel}>type="text" (default)</Text>
              <Fields
                type="text"
                placeholder="Enter text"
                value={fText}
                onChange={(v) => setFText(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>type="text" hasError</Text>
              <Fields
                type="text"
                placeholder="Enter text"
                value=""
                onChange={() => {}}
                hasError
                language={language}
              />

              <Text style={styles.variantLabel}>type="text" disabled</Text>
              <Fields
                type="text"
                placeholder="Enter text"
                value=""
                onChange={() => {}}
                disabled
                language={language}
              />

              <Text style={styles.variantLabel}>type="textarea"</Text>
              <Fields
                type="textarea"
                placeholder="Enter long text"
                value={fTextarea}
                onChange={(v) => setFTextarea(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>type="select" (single)</Text>
              <Fields
                type="select"
                selectType="single"
                placeholder="Choose..."
                value={fSelect}
                onChange={(v) => setFSelect(String(v))}
                options={selectOptions}
                language={language}
              />

              <Text style={styles.variantLabel}>type="select" (multi)</Text>
              <Fields
                type="select"
                selectType="multi"
                placeholder="Choose multiple..."
                value={fMulti.join(",")}
                onChange={(v) =>
                  setFMulti(
                    typeof v === "string"
                      ? v
                        ? v.split(",")
                        : []
                      : (v as string[])
                  )
                }
                options={selectOptions}
                language={language}
              />

              <Text style={styles.variantLabel}>type="date"</Text>
              <Fields
                type="date"
                placeholder="DD/MM/YYYY"
                value={fDate}
                onChange={(v) => setFDate(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>type="currency"</Text>
              <Fields
                type="currency"
                placeholder="0.00"
                value={fCurrency}
                onChange={(v) => setFCurrency(String(v))}
                currencySymbol="AED"
                language={language}
              />

              <Text style={styles.variantLabel}>type="phone"</Text>
              <Fields
                type="phone"
                placeholder="50 000 0000"
                value={fPhone}
                onChange={(v) => setFPhone(String(v))}
                phoneCode="+971"
                language={language}
              />

              <Text style={styles.variantLabel}>type="number"</Text>
              <Fields
                type="number"
                placeholder="0"
                value={fNumber}
                onChange={(v) => setFNumber(String(v))}
                language={language}
              />
            </View> */}

            {/* ── G-0.10 Toast ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.10 — Toast</Text>

              <Text style={styles.variantLabel}>status="success"</Text>
              <Toast
                message="Operation completed successfully"
                status="success"
              />

              <Text style={styles.variantLabel}>status="error"</Text>
              <Toast
                message="An error occurred while processing"
                status="error"
              />

              <Text style={styles.variantLabel}>status="information"</Text>
              <Toast
                message="Your session will expire in 5 minutes"
                status="information"
              />

              <Text style={styles.variantLabel}>status="action"</Text>
              <Toast
                message="New update available. Click to install"
                status="action"
              />

              <Text style={styles.variantLabel}>Long message example</Text>
              <Toast
                message="This is a very long toast message that demonstrates how the component handles extended text content and wrapping"
                status="success"
              />
            </View> */}

            {/* ── G-0.12 Header ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.11 — Header</Text>

              <Text style={styles.variantLabel}>Default (English)</Text>
              <Header
                language="en"
                onAvatarPress={() => console.log("Avatar pressed")}
              />

              <Text style={styles.variantLabel}>With Breadcrumb</Text>
              <Header
                language="en"
                breadcrumbItems={[
                  { label: "Home", onClick: () => console.log("Home clicked") },
                  {
                    label: "Dashboard",
                    onClick: () => console.log("Dashboard clicked"),
                  },
                  {
                    label: "Reports",
                    onClick: () => console.log("Reports clicked"),
                  },
                ]}
                onAvatarPress={() => console.log("Avatar pressed")}
              />
            </View> */}

            {/* ── G-0.15 Bot ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.13 — Bot</Text>

              <Text style={styles.variantLabel}>Status: Close (Default)</Text>
              <Bot
                language="en"
                status="close"
                message="Hello! How can I help you today?"
                message_ar="مرحبا! كيف يمكنني مساعدتك اليوم؟"
                onClick={(newStatus) =>
                  console.log("Bot status changed to:", newStatus)
                }
              />

              <Text style={styles.variantLabel}>Status: Open (English)</Text>
              <Bot
                language="en"
                status="open"
                message="Hello! How can I help you today?"
                message_ar="مرحبا! كيف يمكنني مساعدتك اليوم؟"
                onClick={(newStatus) =>
                  console.log("Bot status changed to:", newStatus)
                }
              />

              <Text style={styles.variantLabel}>Status: Open (Arabic RTL)</Text>
              <Bot
                language="ar"
                status="open"
                message="Hello! How can I help you today?"
                message_ar="مرحبا! كيف يمكنني مساعدتك اليوم؟"
                onClick={(newStatus) =>
                  console.log("Bot status changed to:", newStatus)
                }
              />

              <Text style={styles.variantLabel}>Custom Message</Text>
              <Bot
                language="en"
                status="open"
                message="I'm here to assist you with any questions about your account!"
                message_ar="أنا هنا لمساعدتك في أي أسئلة حول حسابك!"
                onClick={(newStatus) =>
                  console.log("Bot status changed to:", newStatus)
                }
              />

              <Text style={styles.variantLabel}>Long Message Example</Text>
              <Bot
                language="en"
                status="open"
                message="This is a very long message that demonstrates how the bot component handles extended text content and wrapping within the speech bubble. It should wrap nicely and maintain readability."
                message_ar="هذه رسالة طويلة جدًا توضح كيفية تعامل مكون bot مع المحتوى النصي الممتد والتفاف النص داخل فقاعة الكلام. يجب أن يلتف بشكل جيد ويحافظ على سهولة القراءة."
                onClick={(newStatus) =>
                  console.log("Bot status changed to:", newStatus)
                }
              />

              <Text style={styles.variantLabel}>Interactive Demo</Text>
              <View className="p-4 bg-gray-50 rounded-lg">
                <Text className="text-sm text-gray-600 mb-3">
                  Click the bot icon to toggle between open/close states:
                </Text>
                <Bot
                  language="en"
                  status="close"
                  message="Click me to chat! I'm here to help."
                  message_ar="انقر فوقي للدردشة! أنا هنا للمساعدة."
                  onClick={(newStatus) =>
                    console.log("Bot status toggled to:", newStatus)
                  }
                />
              </View>
            </View> */}

            {/* ═══════════════════════════════════════════════ */}
            {/* G-2 — Form Components                          */}
            {/* ═══════════════════════════════════════════════ */}

            {/* ── G-2.1 TextInput ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.1 — TextInput</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <TextInput
                label="Text Input"
                label_ar="حقل نصي"
                placeholder="Enter value"
                placeholder_ar="أدخل القيمة"
                value={tiVal}
                onChange={(v) => setTiVal(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <TextInput
                label="Required"
                label_ar="مطلوب"
                placeholder="Required field"
                placeholder_ar="حقل مطلوب"
                required
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                showInfoIcon + tooltipText
              </Text>
              <TextInput
                label="With Tooltip"
                label_ar="مع تلميحة"
                placeholder="Hover for info"
                placeholder_ar="معلومات"
                showInfoIcon
                tooltipText="Additional info"
                tooltipText_ar="معلومات إضافية"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <TextInput
                label="Error State"
                label_ar="حالة خطأ"
                placeholder="Invalid"
                hasError
                errorMessage="This field is required"
                errorMessage_ar="هذا الحقل مطلوب"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <TextInput
                label="Disabled"
                label_ar="معطل"
                placeholder="Cannot edit"
                placeholder_ar="لا يمكن التعديل"
                disabled
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                captionLeft + captionRight
              </Text>
              <TextInput
                label="With Captions"
                label_ar="مع التعليقات"
                placeholder="Enter value"
                captionLeft="Hint text"
                captionLeft_ar="نص تلميحي"
                captionRight="0/100"
                captionRight_ar="٠/١٠٠"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <TextInput
                label="Text Input"
                label_ar="حقل نصي"
                placeholder="Enter value"
                placeholder_ar="أدخل القيمة"
                required
                value=""
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.2 PhoneInput ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.2 — PhoneInput</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <PhoneInput
                label="Phone Number"
                label_ar="رقم الهاتف"
                placeholder="50 000 0000"
                placeholder_ar="٥٠ ٠٠٠ ٠٠٠٠"
                phoneCode="+971"
                value={piVal}
                onChange={(v) => setPiVal(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <PhoneInput
                label="Phone"
                label_ar="الهاتف"
                placeholder="50 000 0000"
                phoneCode="+971"
                required
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <PhoneInput
                label="Phone"
                label_ar="الهاتف"
                placeholder="50 000 0000"
                phoneCode="+971"
                hasError
                errorMessage="Invalid phone number"
                errorMessage_ar="رقم هاتف غير صالح"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <PhoneInput
                label="Phone"
                label_ar="الهاتف"
                placeholder="50 000 0000"
                phoneCode="+971"
                disabled
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <PhoneInput
                label="Phone"
                label_ar="رقم الهاتف"
                placeholder="50 000 0000"
                placeholder_ar="٥٠ ٠٠٠ ٠٠٠٠"
                phoneCode="+971"
                required
                value=""
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.3 TextArea ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.3 — TextArea</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <TextArea
                label="Description"
                label_ar="وصف"
                placeholder="Enter description"
                placeholder_ar="أدخل الوصف"
                value={taVal}
                onChange={(v) => setTaVal(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <TextArea
                label="Notes"
                label_ar="ملاحظات"
                placeholder="Required notes"
                required
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <TextArea
                label="Notes"
                label_ar="ملاحظات"
                placeholder="Enter notes"
                hasError
                errorMessage="Notes are required"
                errorMessage_ar="الملاحظات مطلوبة"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <TextArea
                label="Notes"
                label_ar="ملاحظات"
                placeholder="Cannot edit"
                disabled
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <TextArea
                label="Description"
                label_ar="وصف"
                placeholder="Enter description"
                placeholder_ar="أدخل الوصف"
                required
                value=""
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.4 Select ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.4 — Select</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <Select
                label="Select Option"
                label_ar="اختر خياراً"
                placeholder="Choose..."
                placeholder_ar="اختر..."
                options={selectOptions}
                value={selVal}
                onChange={(v) => setSelVal(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <Select
                label="Required Select"
                label_ar="اختيار مطلوب"
                placeholder="Choose..."
                required
                options={selectOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                showInfoIcon + tooltipText
              </Text>
              <Select
                label="Select with Info"
                label_ar="اختيار مع معلومات"
                placeholder="Choose..."
                showInfoIcon
                tooltipText="Select one option"
                tooltipText_ar="اختر خياراً واحداً"
                options={selectOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <Select
                label="Select"
                label_ar="اختيار"
                placeholder="Choose..."
                hasError
                errorMessage="Please select an option"
                errorMessage_ar="الرجاء اختيار خيار"
                options={selectOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <Select
                label="Disabled Select"
                label_ar="اختيار معطل"
                placeholder="Cannot select"
                disabled
                options={selectOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                title + title_ar (section header)
              </Text>
              <Select
                label="Select"
                label_ar="اختيار"
                placeholder="Choose..."
                title="Locations"
                title_ar="المواقع"
                options={selectOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <Select
                label="Select"
                label_ar="اختيار"
                placeholder="Choose..."
                placeholder_ar="اختر..."
                required
                options={selectOptions}
                value=""
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.5 MultiSelect ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.5 — MultiSelect</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <MultiSelect
                label="Multi Select"
                label_ar="اختيار متعدد"
                placeholder="Choose multiple..."
                placeholder_ar="اختر متعدداً..."
                options={selectOptions}
                value={msVal}
                onChange={(v) => setMsVal(v)}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <MultiSelect
                label="Required Multi"
                label_ar="اختيار متعدد مطلوب"
                placeholder="Choose..."
                required
                options={selectOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>maxSelection=2</Text>
              <MultiSelect
                label="Max 2"
                label_ar="بحد أقصى ٢"
                placeholder="Choose up to 2"
                options={selectOptions}
                maxSelection={2}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>showAddButton=true</Text>
              <MultiSelect
                label="With Add Button"
                label_ar="مع زر إضافة"
                placeholder="Choose..."
                options={selectOptions}
                showAddButton
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <MultiSelect
                label="Multi Select"
                label_ar="اختيار متعدد"
                placeholder="Choose..."
                hasError
                errorMessage="At least one selection required"
                errorMessage_ar="مطلوب اختيار واحد على الأقل"
                options={selectOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <MultiSelect
                label="Disabled Multi"
                label_ar="اختيار متعدد معطل"
                placeholder="Cannot select"
                disabled
                options={selectOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <MultiSelect
                label="Multi Select"
                label_ar="اختيار متعدد"
                placeholder="Choose..."
                placeholder_ar="اختر..."
                required
                options={selectOptions}
                value={[]}
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.6 CurrencyInput ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.6 — CurrencyInput</Text>

              <Text style={styles.variantLabel}>Default (AED)</Text>
              <CurrencyInput
                label="Amount"
                label_ar="المبلغ"
                placeholder="0.00"
                placeholder_ar="٠٫٠٠"
                currencySymbol="AED"
                value={curVal}
                onChange={(v) => setCurVal(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <CurrencyInput
                label="Amount"
                label_ar="المبلغ"
                placeholder="0.00"
                required
                currencySymbol="AED"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>USD symbol</Text>
              <CurrencyInput
                label="Amount (USD)"
                label_ar="المبلغ (دولار)"
                placeholder="0.00"
                currencySymbol="USD"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <CurrencyInput
                label="Amount"
                label_ar="المبلغ"
                placeholder="0.00"
                currencySymbol="AED"
                hasError
                errorMessage="Invalid amount"
                errorMessage_ar="مبلغ غير صالح"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <CurrencyInput
                label="Amount"
                label_ar="المبلغ"
                placeholder="0.00"
                currencySymbol="AED"
                disabled
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <CurrencyInput
                label="Amount"
                label_ar="المبلغ"
                placeholder="0.00"
                placeholder_ar="٠٫٠٠"
                currencySymbol="AED"
                required
                value=""
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.7 NumberInput ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.7 — NumberInput</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <NumberInput
                label="Quantity"
                label_ar="الكمية"
                placeholder="0"
                placeholder_ar="٠"
                value={numVal}
                onChange={(v) => setNumVal(String(v))}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <NumberInput
                label="Count"
                label_ar="العدد"
                placeholder="0"
                required
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <NumberInput
                label="Number"
                label_ar="رقم"
                placeholder="0"
                hasError
                errorMessage="Must be a positive number"
                errorMessage_ar="يجب أن يكون رقماً موجباً"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <NumberInput
                label="Number"
                label_ar="رقم"
                placeholder="0"
                disabled
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                captionLeft + captionRight
              </Text>
              <NumberInput
                label="Area"
                label_ar="المساحة"
                placeholder="0"
                captionLeft="Enter area in m²"
                captionLeft_ar="أدخل المساحة بالمتر المربع"
                captionRight="m²"
                captionRight_ar="م²"
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <NumberInput
                label="Quantity"
                label_ar="الكمية"
                placeholder="0"
                placeholder_ar="٠"
                required
                value=""
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.8 DateSelect ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.8 — DateSelect</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <DateSelect
                label="Date"
                placeholder="DD/MM/YYYY"
                language={language}
                value={dsVal}
                onDateChange={(d) =>
                  setDsVal(d ? d.toISOString().split("T")[0] : "")
                }
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <DateSelect
                label="Required Date"
                placeholder="DD/MM/YYYY"
                required
                language={language}
                value=""
                onDateChange={() => {}}
              />

              <Text style={styles.variantLabel}>hasError + errMessage</Text>
              <DateSelect
                label="Date"
                placeholder="DD/MM/YYYY"
                hasError
                errMessage="Invalid date"
                language={language}
                value=""
                onDateChange={() => {}}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <DateSelect
                label="Date"
                placeholder="DD/MM/YYYY"
                disabled
                language={language}
                value=""
                onDateChange={() => {}}
              />

              <Text style={styles.variantLabel}>infoText (caption)</Text>
              <DateSelect
                label="Date"
                placeholder="DD/MM/YYYY"
                infoText="Select a date within range"
                language={language}
                value=""
                onDateChange={() => {}}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <DateSelect
                label="التاريخ"
                placeholder="يوم/شهر/سنة"
                required
                language="ar"
                value=""
                onDateChange={() => {}}
              />
            </View> */}

            {/* ── G-2.9 CheckboxField ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.9 — CheckboxField</Text>

              <Text style={styles.variantLabel}>Default (unchecked)</Text>
              <CheckboxField
                label="Accept Terms"
                label_ar="أوافق على الشروط"
                checked={false}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>Interactive (controlled)</Text>
              <CheckboxField
                label="Interactive"
                label_ar="تفاعلي"
                checked={cbfVal}
                onChange={(v) => setCbfVal(v)}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true + checked</Text>
              <CheckboxField
                label="Required & Checked"
                label_ar="مطلوب ومحدد"
                required
                checked
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError=true</Text>
              <CheckboxField
                label="Must Accept"
                label_ar="يجب الموافقة"
                checked={false}
                hasError
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled + unchecked</Text>
              <CheckboxField
                label="Disabled"
                label_ar="معطل"
                checked={false}
                disabled
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled + checked</Text>
              <CheckboxField
                label="Disabled Checked"
                label_ar="معطل ومحدد"
                checked
                disabled
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <CheckboxField
                label="Accept"
                label_ar="أوافق"
                checked={false}
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.10 CheckboxInput ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.10 — CheckboxInput</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <CheckboxInput
                label="Preferences"
                label_ar="التفضيلات"
                options={checkOptions}
                value={cbiVal}
                onChange={(v) => setCbiVal(v)}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <CheckboxInput
                label="Required Options"
                label_ar="خيارات مطلوبة"
                required
                options={checkOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                showInfoIcon + tooltipText
              </Text>
              <CheckboxInput
                label="Options with Info"
                label_ar="خيارات مع معلومات"
                showInfoIcon
                tooltipText="Select all that apply"
                tooltipText_ar="اختر كل ما ينطبق"
                options={checkOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <CheckboxInput
                label="Checkboxes"
                label_ar="مربعات الاختيار"
                hasError
                errorMessage="Select at least one"
                errorMessage_ar="اختر واحداً على الأقل"
                options={checkOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <CheckboxInput
                label="Disabled Options"
                label_ar="خيارات معطلة"
                disabled
                options={checkOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                captionLeft + captionRight
              </Text>
              <CheckboxInput
                label="Options"
                label_ar="خيارات"
                captionLeft="Select preferences"
                captionLeft_ar="اختر التفضيلات"
                captionRight="0 selected"
                captionRight_ar="٠ محدد"
                options={checkOptions}
                value={[]}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <CheckboxInput
                label="Options"
                label_ar="خيارات"
                required
                options={checkOptions}
                value={[]}
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.11 RadioField ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.11 — RadioField</Text>

              <Text style={styles.variantLabel}>Default (unchecked)</Text>
              <RadioField
                label="Option A"
                label_ar="الخيار أ"
                value="a"
                checked={false}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>checked=true</Text>
              <RadioField
                label="Option B"
                label_ar="الخيار ب"
                value="b"
                checked
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>Interactive group</Text>
              {checkOptions.map((opt) => (
                <RadioField
                  key={opt.value}
                  label={opt.label}
                  label_ar={opt.label_ar}
                  value={opt.value}
                  checked={rfVal === opt.value}
                  onChange={(v) => setRfVal(v)}
                  language={language}
                />
              ))}

              <Text style={styles.variantLabel}>required=true</Text>
              <RadioField
                label="Required Option"
                label_ar="خيار مطلوب"
                value="req"
                required
                checked={false}
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError=true</Text>
              <RadioField
                label="Error Option"
                label_ar="خيار خطأ"
                value="err"
                checked={false}
                hasError
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled + unchecked</Text>
              <RadioField
                label="Disabled"
                label_ar="معطل"
                value="dis"
                checked={false}
                disabled
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled + checked</Text>
              <RadioField
                label="Disabled Checked"
                label_ar="معطل ومحدد"
                value="disc"
                checked
                disabled
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <RadioField
                label="Option"
                label_ar="خيار"
                value="ar-opt"
                checked={false}
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ── G-2.12 RadioInput ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-2.12 — RadioInput</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <RadioInput
                label="Choose Option"
                label_ar="اختر خياراً"
                options={checkOptions}
                value={riVal}
                onChange={(v) => setRiVal(v)}
                language={language}
              />

              <Text style={styles.variantLabel}>required=true</Text>
              <RadioInput
                label="Required Choice"
                label_ar="اختيار مطلوب"
                required
                options={checkOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                showInfoIcon + tooltipText
              </Text>
              <RadioInput
                label="Choice with Info"
                label_ar="اختيار مع معلومات"
                showInfoIcon
                tooltipText="Select one option"
                tooltipText_ar="اختر خياراً واحداً"
                options={checkOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>hasError + errorMessage</Text>
              <RadioInput
                label="Radio Group"
                label_ar="مجموعة راديو"
                hasError
                errorMessage="Please select an option"
                errorMessage_ar="الرجاء اختيار خيار"
                options={checkOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <RadioInput
                label="Disabled Group"
                label_ar="مجموعة معطلة"
                disabled
                options={checkOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>
                captionLeft + captionRight
              </Text>
              <RadioInput
                label="Options"
                label_ar="خيارات"
                captionLeft="Select one"
                captionLeft_ar="اختر واحداً"
                captionRight="Required"
                captionRight_ar="مطلوب"
                options={checkOptions}
                value=""
                onChange={() => {}}
                language={language}
              />

              <Text style={styles.variantLabel}>language=ar</Text>
              <RadioInput
                label="Choose"
                label_ar="اختر"
                required
                options={checkOptions}
                value=""
                onChange={() => {}}
                language="ar"
              />
            </View> */}

            {/* ═══════════════════════════════════════════════ */}
            {/* G-3 — UI Primitives                     */}
            {/* ═══════════════════════════════════════════════ */}

            {/* ── G-3.1 Buttons ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-3.1 — Buttons</Text>

              <Text style={styles.variantLabel}>Primary Buttons</Text>

              {[
                {
                  label: "Small (s)",
                  props: { size: "s" as const, title: "Small Button" },
                },
                {
                  label: "Medium (m) - Default",
                  props: { size: "m" as const, title: "Medium Button" },
                },
                {
                  label: "Large (l)",
                  props: { size: "l" as const, title: "Large Button" },
                },
              ].map((item, index) => (
                <React.Fragment key={`primary-${index}`}>
                  <Text style={styles.variantLabel}>{item.label}</Text>
                  <Buttons
                    language="en"
                    type="primary"
                    title={item.props.title}
                    onClick={() => console.log(`${item.props.title} clicked`)}
                    {...item.props}
                  />
                </React.Fragment>
              ))}

              <Text style={styles.variantLabel}>Button Types</Text>

              {[
                { type: "primary" as const, title: "Primary" },
                { type: "secondary" as const, title: "Secondary" },
                { type: "tertiary" as const, title: "Tertiary" },
                { type: "text-link" as const, title: "Text Link" },
                { type: "delete" as const, title: "Delete" },
              ].map((item, index) => (
                <React.Fragment key={`type-${index}`}>
                  <Text style={styles.variantLabel}>type="{item.type}"</Text>
                  <Buttons
                    language="en"
                    type={item.type}
                    title={item.title}
                    onClick={() => console.log(`${item.type} clicked`)}
                  />
                </React.Fragment>
              ))}

              <Text style={styles.variantLabel}>With Icons</Text>

              <Text style={styles.variantLabel}>Left Icon Only</Text>
              <Buttons
                language="en"
                type="primary"
                title="Settings"
                leftIcon={<Settings className="w-4 h-4" />}
                onClick={() => console.log("Settings clicked")}
              />

              <Text style={styles.variantLabel}>Right Icon Only</Text>
              <Buttons
                language="en"
                type="primary"
                title="Next"
                rightIcon={<SelectArrow className="w-4 h-4" />}
                onClick={() => console.log("Next clicked")}
              />

              <Text style={styles.variantLabel}>Both Icons</Text>
              <Buttons
                language="en"
                type="primary"
                title="Both Icons"
                leftIcon={<Settings className="w-4 h-4" />}
                rightIcon={<SelectArrow className="w-4 h-4" />}
                onClick={() => console.log("Both icons clicked")}
              />

              <Text style={styles.variantLabel}>Button States</Text>

              <Text style={styles.variantLabel}>Disabled</Text>
              <Buttons
                language="en"
                type="primary"
                title="Disabled Button"
                disabled={true}
                onClick={() => console.log("This should not fire")}
              />

              <Text style={styles.variantLabel}>Full Width</Text>
              <Buttons
                language="en"
                type="primary"
                title="Full Width Button"
                fullWidth={true}
                onClick={() => console.log("Full width clicked")}
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>

              {[
                {
                  type: "primary" as const,
                  title: "زر أساسي",
                  title_ar: "زر أساسي",
                },
                {
                  type: "secondary" as const,
                  title: "زر ثانوي",
                  title_ar: "زر ثانوي",
                },
                { type: "delete" as const, title: "حذف", title_ar: "حذف" },
              ].map((item, index) => (
                <React.Fragment key={`arabic-${index}`}>
                  <Text style={styles.variantLabel}>
                    type="{item.type}" (Arabic)
                  </Text>
                  <Buttons
                    language="ar"
                    type={item.type}
                    title={item.title}
                    title_ar={item.title_ar}
                    onClick={() => console.log(`Arabic ${item.type} clicked`)}
                  />
                </React.Fragment>
              ))}

              <Text style={styles.variantLabel}>Custom Icon Color</Text>

              <Buttons
                language="en"
                type="primary"
                title="Colored Icons"
                leftIcon={<Settings className="w-4 h-4" />}
                rightIcon={<SelectArrow className="w-4 h-4" />}
                iconColor="#FF5733"
                onClick={() => console.log("Colored icons clicked")}
              />

              <Text style={styles.variantLabel}>Size Comparison</Text>

              <View className="flex-row items-center gap-2 flex-wrap">
                <Buttons
                  language="en"
                  type="primary"
                  size="s"
                  title="Small"
                  onClick={() => {}}
                />
                <Buttons
                  language="en"
                  type="primary"
                  size="m"
                  title="Medium"
                  onClick={() => {}}
                />
                <Buttons
                  language="en"
                  type="primary"
                  size="l"
                  title="Large"
                  onClick={() => {}}
                />
              </View>

              <Text style={styles.variantLabel}>Type Comparison</Text>

              <View className="flex-row items-center gap-2 flex-wrap">
                <Buttons
                  language="en"
                  type="primary"
                  title="Primary"
                  onClick={() => {}}
                />
                <Buttons
                  language="en"
                  type="secondary"
                  title="Secondary"
                  onClick={() => {}}
                />
                <Buttons
                  language="en"
                  type="tertiary"
                  title="Tertiary"
                  onClick={() => {}}
                />
                <Buttons
                  language="en"
                  type="text-link"
                  title="Text Link"
                  onClick={() => {}}
                />
                <Buttons
                  language="en"
                  type="delete"
                  title="Delete"
                  onClick={() => {}}
                />
              </View>
            </View> */}

            {/* ── G-3.2 Typography ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-3.2 — Typography</Text>

              <Text style={styles.variantLabel}>Heading Variants</Text>

              {[
                {
                  variant: "h1-shouting" as const,
                  text: "h1-shouting - Shouting Heading",
                },
                { variant: "h1-hero" as const, text: "h1-hero - Hero Heading" },
                { variant: "h1" as const, text: "h1 - Main Heading" },
                { variant: "h2" as const, text: "h2 - Section Heading" },
                { variant: "h3" as const, text: "h3 - Subsection Heading" },
                { variant: "h4" as const, text: "h4 - Small Heading" },
              ].map((item, index) => (
                <React.Fragment key={`heading-${index}`}>
                  <Text style={styles.variantLabel}>{item.variant}</Text>
                  <Typography
                    variant={item.variant}
                    text={item.text}
                    language="en"
                    color="default"
                  />
                </React.Fragment>
              ))}

              <Text style={styles.variantLabel}>Text Variants - Regular</Text>

              {[
                {
                  variant: "text-lg" as const,
                  text: "text-lg - Large body text for important content",
                },
                {
                  variant: "text-md" as const,
                  text: "text-md - Medium body text for general content",
                },
                {
                  variant: "text-sm" as const,
                  text: "text-sm - Small body text for secondary content",
                },
                {
                  variant: "text-xs" as const,
                  text: "text-xs - Extra small text for captions and metadata",
                },
              ].map((item, index) => (
                <React.Fragment key={`text-${index}`}>
                  <Text style={styles.variantLabel}>{item.variant}</Text>
                  <Typography
                    variant={item.variant}
                    text={item.text}
                    language="en"
                    color="default"
                  />
                </React.Fragment>
              ))}

              <Text style={styles.variantLabel}>Text Variants - Bold</Text>

              {[
                {
                  variant: "text-bold-lg" as const,
                  text: "text-bold-lg - Large bold text",
                },
                {
                  variant: "text-bold-md" as const,
                  text: "text-bold-md - Medium bold text",
                },
                {
                  variant: "text-bold-sm" as const,
                  text: "text-bold-sm - Small bold text",
                },
                {
                  variant: "text-bold-xs" as const,
                  text: "text-bold-xs - Extra small bold text",
                },
                {
                  variant: "text-bold-xxs" as const,
                  text: "text-bold-xxs - Extra extra small bold text",
                },
              ].map((item, index) => (
                <React.Fragment key={`bold-${index}`}>
                  <Text style={styles.variantLabel}>{item.variant}</Text>
                  <Typography
                    variant={item.variant}
                    text={item.text}
                    language="en"
                    color="default"
                  />
                </React.Fragment>
              ))}

              <Text style={styles.variantLabel}>
                Color Variants (using text-md)
              </Text>

              {[
                {
                  color: "default" as const,
                  text: "default - Standard text color",
                },
                {
                  color: "dimmed" as const,
                  text: "dimmed - Dimmed/disabled text",
                },
                {
                  color: "primary" as const,
                  text: "primary - Primary brand color",
                },
                { color: "link" as const, text: "link - Link text color" },
                {
                  color: "link-hover" as const,
                  text: "link-hover - Link hover state",
                },
              ].map((item, index) => (
                <React.Fragment key={`color-${index}`}>
                  <Text style={styles.variantLabel}>color="{item.color}"</Text>
                  <Typography
                    variant="text-md"
                    text={item.text}
                    language="en"
                    color={item.color}
                  />
                </React.Fragment>
              ))}

              <Text style={styles.variantLabel}>Arabic RTL</Text>

              {[
                {
                  variant: "h1" as const,
                  text: "عنوان رئيسي",
                  text_ar: "عنوان رئيسي",
                },
                {
                  variant: "h2" as const,
                  text: "عنوان القسم",
                  text_ar: "عنوان القسم",
                },
                {
                  variant: "text-md" as const,
                  text: "نص عادي للقراءة",
                  text_ar: "نص عادي للقراءة",
                },
                {
                  variant: "text-bold-md" as const,
                  text: "نص غامق للتأكيد",
                  text_ar: "نص غامق للتأكيد",
                },
              ].map((item, index) => (
                <React.Fragment key={`arabic-${index}`}>
                  <Text style={styles.variantLabel}>
                    {item.variant} (Arabic)
                  </Text>
                  <Typography
                    variant={item.variant}
                    text={item.text}
                    text_ar={item.text_ar}
                    language="ar"
                    color="default"
                  />
                </React.Fragment>
              ))}

              <View className="space-y-1">
                <View className="flex-row items-center gap-4">
                  <Typography
                    variant="text-lg"
                    text="Large Regular"
                    language="en"
                  />
                  <Typography
                    variant="text-bold-lg"
                    text="Large Bold"
                    language="en"
                  />
                </View>
                <View className="flex-row items-center gap-4">
                  <Typography
                    variant="text-md"
                    text="Medium Regular"
                    language="en"
                  />
                  <Typography
                    variant="text-bold-md"
                    text="Medium Bold"
                    language="en"
                  />
                </View>
                <View className="flex-row items-center gap-4">
                  <Typography
                    variant="text-sm"
                    text="Small Regular"
                    language="en"
                  />
                  <Typography
                    variant="text-bold-sm"
                    text="Small Bold"
                    language="en"
                  />
                </View>
                <View className="flex-row items-center gap-4">
                  <Typography
                    variant="text-xs"
                    text="XS Regular"
                    language="en"
                  />
                  <Typography
                    variant="text-bold-xs"
                    text="XS Bold"
                    language="en"
                  />
                </View>
              </View>
            </View> */}

            {/* ── G-3.3 Breadcrumb ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-3.3 — Breadcrumb</Text>

              <Text style={styles.variantLabel}>Default (2 items)</Text>
              <Breadcrumb
                language="en"
                items={[{ label: "Home" }, { label: "Level 1" }]}
              />

              <Text style={styles.variantLabel}>3 Items - Last Selected</Text>
              <Breadcrumb
                language="en"
                items={[
                  { label: "Home", onClick: () => console.log("Home clicked") },
                  {
                    label: "Products",
                    onClick: () => console.log("Products clicked"),
                  },
                  { label: "Electronics" },
                ]}
              />

              <Text style={styles.variantLabel}>
                4 Items - Custom Selected Index (index 1)
              </Text>
              <Breadcrumb
                language="en"
                selectedItemIndex={1}
                items={[
                  { label: "Home", onClick: () => console.log("Home clicked") },
                  {
                    label: "Category",
                    onClick: () => console.log("Category clicked"),
                  },
                  {
                    label: "Subcategory",
                    onClick: () => console.log("Subcategory clicked"),
                  },
                  { label: "Product" },
                ]}
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <Breadcrumb
                language="ar"
                items={[
                  {
                    label: "Home",
                    label_ar: "الرئيسية",
                    onClick: () => console.log("الرئيسية clicked"),
                  },
                  {
                    label: "Products",
                    label_ar: "المنتجات",
                    onClick: () => console.log("المنتجات clicked"),
                  },
                  { label: "Electronics", label_ar: "الإلكترونيات" },
                ]}
              />

              <Text style={styles.variantLabel}>Clickable Items</Text>
              <Breadcrumb
                language="en"
                items={[
                  {
                    label: "Dashboard",
                    onClick: () => Alert.alert("Dashboard clicked"),
                  },
                  {
                    label: "Reports",
                    onClick: () => Alert.alert("Reports clicked"),
                  },
                  {
                    label: "Sales Report",
                    onClick: () => Alert.alert("Sales Report clicked"),
                  },
                  { label: "Q1 2026" },
                ]}
              />

              <Text style={styles.variantLabel}>Long Labels</Text>
              <Breadcrumb
                language="en"
                items={[
                  { label: "Very Long Home Page Name That Might Wrap" },
                  {
                    label:
                      "Extremely Long Category Name That Could Cause Issues",
                  },
                  { label: "Current Page With Very Long Title" },
                ]}
              />

              <Text style={styles.variantLabel}>Different Configurations</Text>

              {[
                { label: "2 Items", items: 2 },
                { label: "3 Items", items: 3 },
                { label: "4 Items", items: 4 },
                { label: "5 Items", items: 5 },
              ].map((config, index) => (
                <React.Fragment key={`config-${index}`}>
                  <Text style={styles.variantLabel}>{config.label}</Text>
                  <Breadcrumb
                    language="en"
                    items={Array.from({ length: config.items }, (_, i) => ({
                      label: `Level ${i}`,
                      ...(i < config.items - 1
                        ? { onClick: () => console.log(`Level ${i} clicked`) }
                        : {}),
                    }))}
                  />
                </React.Fragment>
              ))}
            </View> */}

            {/* ── G-3.4 Pagination ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-3.4 — Pagination</Text>
              <Text style={styles.variantLabel}>Basic (Center Position)</Text>
              <Pagination
                currentPage={3}
                totalPages={10}
                onPageChange={(page) => console.log("Page changed to:", page)}
                language="en"
                pageSize={0}
              />
            </View> */}

            {/* ── G-3.5 AddMoreButton ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-3.5 — AddMoreButton</Text>

              <Text style={styles.variantLabel}>Default (English)</Text>
              <AddMoreButton
                title="Add More"
                onClick={() => console.log("Add More clicked")}
                language="en"
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <AddMoreButton
                title="Add More"
                title_ar="إضافة المزيد"
                onClick={() => console.log("إضافة المزيد clicked")}
                language="ar"
              />

              <Text style={styles.variantLabel}>Custom Plus Icon (Larger)</Text>
              <AddMoreButton
                title="Add with Custom Icon"
                onClick={() => console.log("Custom icon clicked")}
                plusIcon={<Plus size={24} color="#3b82f6" />}
                language="en"
              />
            </View> */}

            {/* ── G-3.6 Prompt ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-3.6 — Prompt</Text>

              <Text style={styles.variantLabel}>Default (English)</Text>
              <Prompt
                title="Are you sure?"
                subtitle="This action cannot be undone."
                onYesClick={() => console.log("Yes clicked")}
                onNoClick={() => console.log("No clicked")}
                language="en"
              />
            </View> */}

            {/* ── G-3.7 ScreenLoader ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-3.7 — ScreenLoader</Text>

              <Text style={styles.variantLabel}>Default </Text>
              <ScreenLoader isLoading={false} />
            </View> */}

            {/* ═══════════════════════════════════════════════ */}
            {/* G-4 — Recommended placement                   */}
            {/* ═══════════════════════════════════════════════ */}

            {/* ── G-4.1 TitleBar ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-4.1 — TitleBar</Text>

              <Text style={styles.variantLabel}>Default Title</Text>
              <TitleBar title="Dashboard" language="en" />

              <Text style={styles.variantLabel}>Title + Acronym</Text>
              <TitleBar title="User Management" acronym="UM" language="en" />

              <Text style={styles.variantLabel}>Title Only (No Acronym)</Text>
              <TitleBar title="Settings" showAcronym={false} language="en" />

              <Text style={styles.variantLabel}>Primary Button</Text>
              <TitleBar
                title="Projects"
                acronym="PRJ"
                showButton
                buttonLabel="Create Project"
                buttonType="primary"
                language="en"
                onClick={() => console.log("Primary clicked")}
              />

              <Text style={styles.variantLabel}>Secondary Button</Text>
              <TitleBar
                title="Tasks"
                acronym="TSK"
                showButton
                buttonLabel="Add Task"
                buttonType="secondary"
                language="en"
                onClick={() => console.log("Secondary clicked")}
              />

              <Text style={styles.variantLabel}>Tertiary Button</Text>
              <TitleBar
                title="Reports"
                acronym="RPT"
                showButton
                buttonLabel="Generate"
                buttonType="tertiary"
                language="en"
                onClick={() => console.log("Tertiary clicked")}
              />

              <Text style={styles.variantLabel}>Text Link Button</Text>
              <TitleBar
                title="Analytics"
                acronym="ANL"
                showButton
                buttonLabel="View More"
                buttonType="text-link"
                language="en"
                onClick={() => console.log("Text link clicked")}
              />

              <Text style={styles.variantLabel}>Delete Button</Text>
              <TitleBar
                title="Danger Zone"
                acronym="DEL"
                showButton
                buttonLabel="Delete"
                buttonType="delete"
                language="en"
                onClick={() => console.log("Delete clicked")}
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <TitleBar
                title="Dashboard"
                title_ar="لوحة التحكم"
                acronym="DB"
                showButton
                buttonLabel="Create"
                buttonLabel_ar="إنشاء"
                buttonType="primary"
                language="ar"
                onClick={() => console.log("Arabic clicked")}
              />

              <Text style={styles.variantLabel}>Long Title</Text>
              <TitleBar
                title="Extremely Long Page Title That Might Wrap On Smaller Screens"
                acronym="LNG"
                showButton
                buttonLabel="Action"
                buttonType="primary"
                language="en"
              />

              <Text style={styles.variantLabel}>Different Configurations</Text>

              {[
                { label: "Title Only", showButton: false, showAcronym: false },
                {
                  label: "Title + Acronym",
                  showButton: false,
                  showAcronym: true,
                },
                {
                  label: "Title + Button",
                  showButton: true,
                  showAcronym: false,
                },
                {
                  label: "Title + Acronym + Button",
                  showButton: true,
                  showAcronym: true,
                },
              ].map((config, index) => (
                <React.Fragment key={`title-config-${index}`}>
                  <Text style={styles.variantLabel}>{config.label}</Text>
                  <TitleBar
                    title="Sample Page"
                    acronym="SP"
                    language="en"
                    showButton={config.showButton}
                    showAcronym={config.showAcronym}
                    buttonLabel="Action"
                    buttonType="primary"
                    onClick={() => console.log("Action clicked")}
                  />
                </React.Fragment>
              ))}
            </View> */}

            {/* ── G-4.2 OwnerSearch ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-4.2 — OwnerSearch</Text>
              <OwnerSearch
                title="Search Owner"
                title_ar="البحث عن المالك"
                subtitle="Find owners by company or individual owner"
                subtitle_ar="ابحث عن المالك حسب الشركة أو المالك الفردي"
                initialOwnerType="company"
                // selected={mockSelected}
                language="en"
                // onSubmit={handleSubmit}
                platform="mobile"
              />
            </View> */}

            {/* ── G-4.3 FilterBar ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-4.3 — FilterBar</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <FilterBar
                language="en"
                searchColumns={["Name", "Email", "Role"]}
                filterOptions={["Active", "Inactive", "Pending"]}
              />

              <Text style={styles.variantLabel}>With Filters</Text>
              <FilterBar
                language="en"
                searchColumns={["Name", "Email"]}
                filterOptions={["Active", "Inactive", "Archived"]}
                sortOptions={["Newest First", "Oldest First"]}
                applicationOptions={["My Applications", "All Applications"]}
              />

              <Text style={styles.variantLabel}>Column Selection</Text>
              <FilterBar
                language="en"
                searchColumns={["Name", "Email", "Department", "Role"]}
                selectedSearchColumns={["Name"]}
                onSearchColumnsChange={(cols) =>
                  console.log("Selected Columns:", cols)
                }
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <FilterBar
                language="ar"
                searchPlaceholder="بحث"
                searchPlaceholder_ar="بحث"
                searchColumns={["الاسم", "البريد الإلكتروني", "القسم"]}
                filterButtonLabel="All Filters"
                filterButtonLabel_ar="جميع المرشحات"
                filterOptions={["نشط", "غير نشط", "قيد الانتظار"]}
                resetButtonLabel="Default Filter"
                resetButtonLabel_ar="المرشح الافتراضي"
              />
            </View> */}

            {/* ── G-4.4 Payment ── */}
            {/* <View>
              <Text style={styles.sectionTitle}>G-4.4 — Payment</Text>
              <Payment
                language="en"
                platform="mobile"
                applicationId="ptmVwwNZMaaKc0HwhTMMHWc3HeZiJXZm"
              />
            </View> */}

            {/* ── G-4.6 Signature ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-4.6 — Signature</Text>

              <Text style={styles.variantLabel}>
                Default Signature (Light Theme)
              </Text>
              <Signature
                language="en"
                title="Sign to Approve"
                buttonText="Approve"
                theme="light"
                onSubmit={(data) => console.log("Signed SVG:", data.signature)}
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <Signature
                language="ar"
                title="Sign to Approve"
                title_ar="وقع للموافقة"
                buttonText="Approve"
                buttonText_ar="موافق"
                onSubmit={(data) =>
                  console.log("Arabic Signed SVG:", data.signature)
                }
              />
            </View> */}

            {/* ── G-4.7 UploadDocuments ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-4.7 — UploadDocuments</Text>

              <Text style={styles.variantLabel}>Single Document Upload</Text>
              <UploadDocuments
                language="en"
                theme="light"
                documents={[
                  {
                    documentName: "Passport",
                    allowedTypes: ["pdf", "jpg", "png"],
                    fileSize: 5 * 1024 * 1024, // 5 MB
                    fileTypeErrorMessage: "Invalid file type",
                    fileSizeErrorMessage: "File is too large",
                    uploadUrl: "https://example.com/upload/passport",
                    downloadUrl: "https://example.com/download/passport.pdf",
                  },
                ]}
                onFileChange={({ file, uploadUrl }) =>
                  console.log("File changed:", file, "Upload URL:", uploadUrl)
                }
              />

              <Text style={styles.variantLabel}>Multiple Documents</Text>
              <UploadDocuments
                language="en"
                theme="dark"
                documents={[
                  {
                    documentName: "Passport",
                    allowedTypes: ["pdf", "jpg", "png"],
                    fileSize: 5 * 1024 * 1024,
                    uploadUrl: "https://example.com/upload/passport",
                  },
                  {
                    documentName: "Driver's License",
                    allowedTypes: ["pdf", "jpg", "png"],
                    fileSize: 3 * 1024 * 1024,
                    uploadUrl: "https://example.com/upload/license",
                  },
                  {
                    documentName: "Resume",
                    allowedTypes: ["pdf", "docx"],
                    fileSize: 10 * 1024 * 1024,
                    uploadUrl: "https://example.com/upload/resume",
                  },
                ]}
                onFileChange={({ file, uploadUrl }) =>
                  console.log("File changed:", file, "Upload URL:", uploadUrl)
                }
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <UploadDocuments
                language="ar"
                theme="dark"
                documents={[
                  {
                    documentName: "Passport",
                    documentName_ar: "جواز السفر",
                    allowedTypes: ["pdf", "jpg", "png"],
                    fileSize: 5 * 1024 * 1024,
                    uploadUrl: "https://example.com/upload/passport",
                    downloadUrl: "https://example.com/download/passport.pdf",
                  },
                  {
                    documentName: "Driver's License",
                    documentName_ar: "رخصة القيادة",
                    allowedTypes: ["pdf", "jpg", "png"],
                    fileSize: 3 * 1024 * 1024,
                    uploadUrl: "https://example.com/upload/license",
                  },
                ]}
                onFileChange={({ file, uploadUrl }) =>
                  console.log(
                    "Arabic file changed:",
                    file,
                    "Upload URL:",
                    uploadUrl
                  )
                }
              />

              <Text style={styles.variantLabel}>Already Uploaded</Text>
              <UploadDocuments
                language="en"
                theme="light"
                documents={[
                  {
                    documentName: "Passport",
                    isUploaded: true,
                    downloadUrl: "https://example.com/download/passport.pdf",
                  },
                ]}
                onFileChange={({ file, uploadUrl }) =>
                  console.log("Attempted file change:", file, uploadUrl)
                }
              />
            </View> */}

            {/* ── G-4.8 ViewPlotDetail ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-4.8 — ViewPlotDetail</Text>
              <ViewPlotDetail
                plotIds={["12345"]}
                plotTitle="Plot Details"
                plotTitle_ar="تفاصيل القطعة"
                showOwnerDetails={true}
              />
            </View> */}
            {/* ── G-4.10 Payment Details ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-4.10 — Payment Details</Text>
              <PaymentDetails
                applicationId="APP-001"
                language="en"
                payments={[
                  {
                    applicationPaymentId: 1,
                    municipalityId: 101,
                    paymentDescriptionE: "Building Permit Fee",
                    paymentDescriptionA: "رسوم تصريح البناء",
                    municipalityNameE: "Dubai Municipality",
                    municipalityNameA: "بلدية دبي",
                    paidByName: "John Doe",
                    receiptNumber: "",
                    receiptDate: "",
                    amountDue: "500 AED",
                    amountInWords: "Five Hundred Dirhams",
                    vatAmount: "25 AED",
                  },
                  {
                    applicationPaymentId: 2,
                    municipalityId: 102,
                    paymentDescriptionE: "Inspection Fee",
                    paymentDescriptionA: "رسوم التفتيش",
                    municipalityNameE: "Abu Dhabi Municipality",
                    municipalityNameA: "بلدية أبوظبي",
                    paidByName: "John Doe",
                    receiptNumber: "REC123",
                    receiptDate: "2025-02-01",
                    amountDue: "300 AED",
                    amountInWords: "Three Hundred Dirhams",
                    vatAmount: "15 AED",
                  },
                ]}
                isLoading={false}
                onOverrideComplete={() => console.log("Override Done")}
              />
            </View> */}

            {/* ── G-4.11 Application Summary ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                G-4.11 — Application Summary
              </Text>
              <ApplicationSummary data={normalizedData} platform="mobile" />
            </View> */}

            {/* ═══════════════════════════════════════════════ */}
            {/* G-5 — Shared Components                 */}
            {/* ═══════════════════════════════════════════════ */}

            {/* ── G-5.1 Application Table ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.1 — Application Table</Text>


              <Text style={styles.variantLabel}>Default</Text>
              <Table
                language="en"
                platform="mobile"
                columns={[
                  {
                    header: "Details",
                    header_ar: "تفاصيل",
                    accessorKey: "details",
                  },
                  {
                    header: "Owner",
                    header_ar: "المالك",
                    accessorKey: "owner",
                  },
                  {
                    header: "Plot",
                    header_ar: "قطعة أرض",
                    accessorKey: "plot",
                  },
                  {
                    header: "Approval",
                    header_ar: "الموافقة",
                    accessorKey: "approval",
                  },
                  {
                    header: "Payment",
                    header_ar: "الدفع",
                    accessorKey: "payment",
                  },
                  {
                    header: "Print",
                    header_ar: "طباعة",
                    accessorKey: "print",
                  },
                ]}
                data={[
                  {
                    applicationTitle: "New / Racing",
                    applicationTitle_ar: "جديد / سباق",
                    location: "Abu Dhabi City",
                    location_ar: "مدينة أبوظبي",
                    timeDate: "13:51 - 21/06/2025",
                    daysRemaining: "X Days Remaining",
                    id: "202500268615",
                    currentStep: 3,
                    additionalColumns: [
                      {
                        action: "Ahmed Mohammed 111",
                        stepName: "Al Ketbi",
                        userName: "Username",
                        role: "Role",
                        type: "pending",
                        version: "multi-row",
                        // version: "hybrid",
                        totalSteps: 6,
                        currentStep: 4,
                        currentStepStatus: "complete",
                      },
                      {
                        action: "Ahmed Mohammed",
                        stepName: "Al Ketbi",
                        imageURL:
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHSsMJwWbiNM-sWtPsfvq1mdV0rxJ-t7t-JQ&s",
                        currentStep: 4,
                        type: "action-other",
                        version: "image-row",
                      },
                      {
                        action: "Ahmed Mohammed",
                        stepName: "Al Ketbi",
                        currentStep: 4,
                        type: "action",
                        version: "single-row",
                      },
                      {
                        action: "Pending",
                        stepName: "Payment Pending",
                        currentStep: 4,
                        type: "pending",
                        version: "hybrid",
                        totalSteps: 6,
                        currentStepStatus: "pending",
                      },
                      {
                        action: "Pending",
                        stepName: "Print Pending",
                        currentStep: 4,
                        type: "failed",
                        version: "single-row",
                        direction: "vertical",
                      },
                    ],
                  },
                  {
                    applicationTitle: "New / Racing",
                    applicationTitle_ar: "جديد / سباق",
                    location: "Abu Dhabi City",
                    location_ar: "مدينة أبوظبي",
                    timeDate: "16:57 - 19/06/2025",
                    timeDate_ar: "16:57 - 19/06/2025",
                    daysRemaining: "X Days Remaining",
                    id: "202500268102",
                    currentStep: 1,
                    additionalColumns: [
                      {
                        action: "Ahmed Mohammed 111",
                        stepName: "Al Ketbi",
                        userName: "Username",
                        role: "Role",
                        type: "success",
                        version: "single-row",
                      },
                      {
                        action: "Ahmed Mohammed",
                        stepName: "Al Ketbi",
                        imageURL:
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHSsMJwWbiNM-sWtPsfvq1mdV0rxJ-t7t-JQ&s",
                        currentStep: 4,
                        type: "action",
                        version: "image-row",
                      },
                      {
                        action: "Ahmed Mohammed",
                        stepName: "Al Ketbi",
                        userName: "Username",
                        role: "Role",
                        currentStep: 4,
                        type: "action-other",
                        version: "multi-row",
                      },
                      {
                        action: "Pending",
                        stepName: "Payment Pending",
                        userName: "Username",
                        role: "Role",
                        currentStep: 4,
                        type: "failed",
                        version: "hybrid",
                        totalSteps: 6,
                        currentStepStatus: "failed",
                      },
                      {
                        action: "Pending",
                        stepName: "Print Pending",
                        currentStep: 4,
                        type: "pending",
                        version: "single-row",
                        direction: "vertical",
                      },
                    ],
                  },
                ]}
              />
            </View> */}

            {/* ── G-5.2 Owner Card ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.2 — OwnerCard</Text>

              <Text style={styles.variantLabel}>Default Owner Card</Text>
              <OwnerCard
                language="en"
                platform="mobile"
                title="Owner Information"
                owners={[
                  {
                    ownerId: "1",
                    ownerArgs: "owner-1",
                    name: "John Doe",
                    fields: [
                      { label: "Email", value: "john@example.com" },
                      { label: "Phone", value: "+971 50 123 4567" },
                      { label: "Role", value: "Primary Owner" },
                    ],
                  },
                ]}
                onPressAction={({ action, owner }) =>
                  console.log("Action:", action, "Owner:", owner)
                }
              />

              <Text style={styles.variantLabel}>Multiple Owners</Text>
              <OwnerCard
                language="en"
                platform="mobile"
                title="Owners"
                itemsPerRow="1"
                owners={[
                  {
                    ownerId: "1",
                    ownerArgs: "owner-1",
                    name: "John Doe",
                    fields: [
                      { label: "Email", value: "john@example.com" },
                      { label: "Phone", value: "+971 50 123 4567" },
                      { label: "Role", value: "Primary Owner" },
                    ],
                  },
                  {
                    ownerId: "2",
                    ownerArgs: "owner-2",
                    name: "Jane Smith",
                    fields: [
                      { label: "Email", value: "jane@example.com" },
                      { label: "Phone", value: "+971 55 987 6543" },
                      { label: "Role", value: "Co Owner" },
                    ],
                  },
                ]}
                onPressAction={({ action, owner }) =>
                  console.log("Action:", action, "Owner:", owner)
                }
              />

              <Text style={styles.variantLabel}>With Delete Action</Text>
              <OwnerCard
                language="en"
                platform="mobile"
                title="Owners"
                showDeleteButton
                owners={[
                  {
                    ownerId: "3",
                    ownerArgs: "owner-3",
                    name: "Michael Brown",
                    fields: [
                      { label: "Email", value: "michael@example.com" },
                      { label: "Phone", value: "+971 54 222 3333" },
                      { label: "Role", value: "Owner" },
                    ],
                  },
                ]}
                onPressAction={({ action, owner }) =>
                  console.log("Action:", action, "Owner:", owner)
                }
              />

              <Text style={styles.variantLabel}>Expandable Card</Text>
              <OwnerCard
                language="en"
                platform="mobile"
                title="Owner Details"
                isExpandable
                owners={[
                  {
                    ownerId: "4",
                    ownerArgs: "owner-4",
                    name: "Sarah Wilson",
                    fields: [
                      { label: "Email", value: "sarah@example.com" },
                      { label: "Phone", value: "+971 52 444 1111" },
                      { label: "Role", value: "Owner" },
                      { label: "Address", value: "Dubai Marina" },
                      { label: "Status", value: "Active" },
                    ],
                  },
                ]}
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <OwnerCard
                language="ar"
                platform="mobile"
                title="معلومات المالك"
                title_ar="معلومات المالك"
                owners={[
                  {
                    ownerId: "5",
                    ownerArgs: "owner-5",
                    name: "John Doe",
                    name_ar: "جون دو",
                    fields: [
                      {
                        label: "Email",
                        label_ar: "البريد الإلكتروني",
                        value: "john@example.com",
                      },
                      {
                        label: "Phone",
                        label_ar: "الهاتف",
                        value: "+971 50 123 4567",
                      },
                      { label: "Role", label_ar: "الدور", value: "Owner" },
                    ],
                  },
                ]}
              />
            </View> */}

            {/* ── G-5.3 PlotCard ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.3 — PlotCard</Text>

              <Text style={styles.variantLabel}>Default Plot Card</Text>
              <PlotCard
                language="en"
                title="Plot Information"
                platform="mobile"
                plots={[
                  {
                    plotId: "1",
                    plotArgs: "plot-1",
                    plotNumber: "PL-001",
                    fields: [
                      { label: "Location", value: "Dubai Marina" },
                      { label: "Area", value: "500 sqm" },
                      { label: "Status", value: "Active" },
                    ],
                  },
                ]}
                onPressView={(plot) => console.log("View Plot:", plot)}
              />

              <Text style={styles.variantLabel}>Multiple Plots</Text>
              <PlotCard
                language="en"
                title="Plots"
                platform="mobile"
                plots={[
                  {
                    plotId: "2",
                    plotArgs: "plot-2",
                    plotNumber: "PL-002",
                    fields: [
                      { label: "Location", value: "Abu Dhabi" },
                      { label: "Area", value: "750 sqm" },
                      { label: "Status", value: "Pending" },
                    ],
                  },
                  {
                    plotId: "3",
                    plotArgs: "plot-3",
                    plotNumber: "PL-003",
                    fields: [
                      { label: "Location", value: "Sharjah" },
                      { label: "Area", value: "620 sqm" },
                      { label: "Status", value: "Approved" },
                    ],
                  },
                ]}
                onPressView={(plot) => console.log("View Plot:", plot)}
              />

              <Text style={styles.variantLabel}>Change Plot Action</Text>
              <PlotCard
                language="en"
                title="Plot"
                platform="mobile"
                showChangePlotButton
                plots={[
                  {
                    plotId: "4",
                    plotArgs: "plot-4",
                    plotNumber: "PL-004",
                    fields: [
                      { label: "Location", value: "Dubai Hills" },
                      { label: "Area", value: "800 sqm" },
                      { label: "Status", value: "Active" },
                    ],
                  },
                ]}
                onPressPlotChange={(plot) =>
                  console.log("Change Plot Clicked:", plot)
                }
              />

              <Text style={styles.variantLabel}>Owners Action</Text>
              <PlotCard
                language="en"
                title="Plot"
                showOwnersButton
                platform="mobile"
                plots={[
                  {
                    plotId: "5",
                    plotArgs: "plot-5",
                    plotNumber: "PL-005",
                    fields: [
                      { label: "Location", value: "Jumeirah" },
                      { label: "Area", value: "900 sqm" },
                      { label: "Status", value: "Active" },
                    ],
                  },
                ]}
                onPressOwners={(plot) =>
                  console.log("Owners Button Clicked:", plot)
                }
              />

              <Text style={styles.variantLabel}>Expandable Plot Card</Text>
              <PlotCard
                language="en"
                title="Plot Details"
                platform="mobile"
                plots={[
                  {
                    plotId: "6",
                    plotArgs: "plot-6",
                    plotNumber: "PL-006",
                    fields: [
                      { label: "Location", value: "Palm Jumeirah" },
                      { label: "Area", value: "1000 sqm" },
                      { label: "Status", value: "Active" },
                      { label: "Category", value: "Residential" },
                      { label: "Ownership", value: "Private" },
                    ],
                  },
                ]}
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <PlotCard
                language="ar"
                title="معلومات القطعة"
                title_ar="معلومات القطعة"
                platform="mobile"
                plots={[
                  {
                    plotId: "7",
                    plotArgs: "plot-7",
                    plotNumber: "PL-007",
                    plotNumber_ar: "PL-007",
                    fields: [
                      {
                        label: "Location",
                        label_ar: "الموقع",
                        value: "Dubai",
                        value_ar: "دبي",
                      },
                      {
                        label: "Area",
                        label_ar: "المساحة",
                        value: "500 sqm",
                        value_ar: "٥٠٠ متر مربع",
                      },
                      {
                        label: "Status",
                        label_ar: "الحالة",
                        value: "Active",
                        value_ar: "نشط",
                      },
                    ],
                  },
                ]}
              />
            </View> */}

            {/* ── G-5.4 Modal Title ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.4 — Modal Title</Text>
              <ModalTitle label="Title" platform="mobile" />
              <ModalTitle label_ar="العنوان" language="ar" platform="mobile" />
            </View> */}

            {/* ── G-5.5 Modal Steps ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.5 — Modal Steps</Text>
              <ModalSteps title="Title" subText="Step 1 of 2" />
              <ModalSteps
                title_ar="العنوان"
                subText_ar="الخطوة 1 من 2"
                language="ar"
              />
            </View> */}

            {/* ── G-5.6 GenericCard ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.6 — GenericCard</Text>

              <Text style={styles.variantLabel}>Default Card</Text>
              <GenericCard
                platform="mobile"
                title="Application Details"
                title_ar="Application Details"
                rowsData={[
                  { label: "Application ID", value: "APP-001" },
                  { label: "Applicant Name", value: "John Doe" },
                  { label: "Status", value: "Pending" },
                ]}
                language="en"
              />

              <Text style={styles.variantLabel}>Card With Buttons</Text>
              <GenericCard
                platform="mobile"
                title="Owner Details"
                title_ar="Owner Details"
                cardTitleLabel="Owner"
                rowsData={[
                  { label: "Name", value: "Jane Smith" },
                  { label: "Email", value: "jane@example.com" },
                  { label: "Phone", value: "+971 55 111 2222" },
                ]}
                showButtons
                buttons={[
                  {
                    title: "View",
                    title_ar: "عرض",
                    onClick: () => console.log("View clicked"),
                  },
                  {
                    title: "Edit",
                    title_ar: "تعديل",
                    onClick: () => console.log("Edit clicked"),
                  },
                ]}
                language="en"
              />

              <Text style={styles.variantLabel}>Expandable Card</Text>
              <GenericCard
                platform="mobile"
                title="Plot Information"
                title_ar="Plot Information"
                cardTitleLabel="Plot Number"
                cardTitleValue="PL-001"
                rowsData={[
                  { label: "Location", value: "Dubai Marina" },
                  { label: "Area", value: "500 sqm" },
                  { label: "Status", value: "Active" },
                  { label: "Category", value: "Residential" },
                  { label: "Ownership", value: "Private" },
                ]}
                showMoreButton
                language="en"
              />

              <Text style={styles.variantLabel}>Card With Documents</Text>
              <GenericCard
                platform="mobile"
                title="Verification"
                title_ar="Verification"
                rowsData={[
                  { label: "Application ID", value: "APP-002" },
                  { label: "Applicant Name", value: "Michael Brown" },
                ]}
                hasDocuments
                documents={[
                  {
                    id: "doc-1",
                    documentName: "Passport Copy",
                    isUploaded: true,
                    onDownloadClick: () => console.log("Download Passport"),
                  },
                  {
                    id: "doc-2",
                    documentName: "Emirates ID",
                    isUploaded: true,
                    onDownloadClick: () => console.log("Download Emirates ID"),
                  },
                ]}
                language="en"
              />

              <Text style={styles.variantLabel}>Footer Buttons</Text>
              <GenericCard
                platform="mobile"
                title="Review Application"
                title_ar="Review Application"
                rowsData={[
                  { label: "Application ID", value: "APP-003" },
                  { label: "Applicant", value: "Sarah Wilson" },
                  { label: "Status", value: "Under Review" },
                ]}
                showFooterButtons
                footerButton={[
                  {
                    title: "Approve",
                    type: "primary",
                    onClick: () => console.log("Approve clicked"),
                  },
                  {
                    title: "Reject",
                    type: "delete",
                    onClick: () => console.log("Reject clicked"),
                  },
                ]}
                language="en"
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <GenericCard
                platform="mobile"
                title="تفاصيل الطلب"
                title_ar="تفاصيل الطلب"
                cardTitleLabel="رقم الطلب"
                cardTitleValue="APP-004"
                rowsData={[
                  { label: "الاسم", value: "أحمد علي" },
                  { label: "الحالة", value: "قيد المراجعة" },
                  { label: "الموقع", value: "دبي" },
                ]}
                language="ar"
              />
            </View> */}

            {/* ── G-5.7 GenericCards ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.7 — GenericCards</Text>

              <Text style={styles.variantLabel}>Single Card</Text>
              <GenericCards
                language="en"
                title="Application"
                platform="mobile"
                cardsData={[
                  {
                    id: "1",
                    cardTitleLabel: "Application ID",
                    cardTitleValue: "APP-001",
                    rowsData: [
                      { label: "Applicant", value: "John Doe" },
                      { label: "Status", value: "Pending" },
                      { label: "Location", value: "Dubai" },
                    ],
                  },
                ]}
              />

              <Text style={styles.variantLabel}>Two Cards Per Row</Text>
              <GenericCards
                language="en"
                title="Applications"
                itemsPerRow="2"
                platform="mobile"
                cardsData={[
                  {
                    id: "2",
                    cardTitleLabel: "Application ID",
                    cardTitleValue: "APP-002",
                    rowsData: [
                      { label: "Applicant", value: "Jane Smith" },
                      { label: "Status", value: "Approved" },
                      { label: "Location", value: "Abu Dhabi" },
                    ],
                  },
                  {
                    id: "3",
                    cardTitleLabel: "Application ID",
                    cardTitleValue: "APP-003",
                    rowsData: [
                      { label: "Applicant", value: "Michael Brown" },
                      { label: "Status", value: "Pending" },
                      { label: "Location", value: "Sharjah" },
                    ],
                  },
                ]}
              />

              <Text style={styles.variantLabel}>Three Cards Grid</Text>
              <GenericCards
                language="en"
                title="Plots"
                itemsPerRow="3"
                platform="mobile"
                cardsData={[
                  {
                    id: "4",
                    cardTitleLabel: "Plot",
                    cardTitleValue: "PL-001",
                    rowsData: [
                      { label: "Area", value: "500 sqm" },
                      { label: "Status", value: "Active" },
                    ],
                  },
                  {
                    id: "5",
                    cardTitleLabel: "Plot",
                    cardTitleValue: "PL-002",
                    rowsData: [
                      { label: "Area", value: "620 sqm" },
                      { label: "Status", value: "Pending" },
                    ],
                  },
                  {
                    id: "6",
                    cardTitleLabel: "Plot",
                    cardTitleValue: "PL-003",
                    rowsData: [
                      { label: "Area", value: "700 sqm" },
                      { label: "Status", value: "Approved" },
                    ],
                  },
                ]}
              />

              <Text style={styles.variantLabel}>Cards With Buttons</Text>
              <GenericCards
                language="en"
                title="Owners"
                platform="mobile"
                showButtons
                buttons={[
                  {
                    title: "View",
                    onClick: (card) => console.log("View:", card),
                  },
                  {
                    title: "Edit",
                    onClick: (card) => console.log("Edit:", card),
                  },
                ]}
                cardsData={[
                  {
                    id: "7",
                    cardTitleLabel: "Owner",
                    cardTitleValue: "John Doe",
                    rowsData: [
                      { label: "Email", value: "john@example.com" },
                      { label: "Phone", value: "+971 50 111 2222" },
                      { label: "Role", value: "Primary Owner" },
                    ],
                  },
                  {
                    id: "8",
                    cardTitleLabel: "Owner",
                    cardTitleValue: "Jane Smith",
                    rowsData: [
                      { label: "Email", value: "jane@example.com" },
                      { label: "Phone", value: "+971 55 333 4444" },
                      { label: "Role", value: "Co Owner" },
                    ],
                  },
                ]}
              />

              <Text style={styles.variantLabel}>Expandable Cards</Text>
              <GenericCards
                language="en"
                title="Plot Details"
                platform="mobile"
                cardsData={[
                  {
                    id: "9",
                    cardTitleLabel: "Plot Number",
                    cardTitleValue: "PL-010",
                    rowsData: [
                      { label: "Location", value: "Dubai Marina" },
                      { label: "Area", value: "900 sqm" },
                      { label: "Status", value: "Active" },
                      { label: "Category", value: "Residential" },
                      { label: "Ownership", value: "Private" },
                    ],
                  },
                ]}
              />

              <Text style={styles.variantLabel}>Arabic RTL</Text>
              <GenericCards
                language="ar"
                title="الطلبات"
                title_ar="الطلبات"
                platform="mobile"
                cardsData={[
                  {
                    id: "10",
                    cardTitleLabel: "رقم الطلب",
                    cardTitleValue: "APP-010",
                    rowsData: [
                      { label: "الاسم", value: "أحمد علي" },
                      { label: "الحالة", value: "قيد المراجعة" },
                      { label: "الموقع", value: "دبي" },
                    ],
                  },
                ]}
              />
            </View> */}

            {/* ── G-5.8 GenericTableCard ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.8 — GenericTableCard</Text>

              <Text style={styles.variantLabel}>Default Table</Text>
              <GenericTableCard
                platform="mobile"
                title="Owner Information"
                title_ar="معلومات المالك"
                description="Description"
                description_ar="Arabic Description"
                cardTitleLabel="Card Title Label"
                cardTitleValue="Card Title Value"
                variant="medium"
                isExpanded={true}
                isExpandable={true}
                titleButtons={[
                  {
                    title: "Edit",
                    title_ar: "تعديل",
                    onClick: () => Alert.alert("Edit button clicked"),
                  },
                  {
                    title: "Delete",
                    title_ar: "حذف",
                    onClick: () => Alert.alert("Delete button clicked"),
                  },
                ]}
                showButtons={true}
                buttons={[
                  {
                    title: "Edit",
                    title_ar: "تعديل",
                    onClick: () => Alert.alert("Edit button clicked"),
                  },
                  {
                    title: "Delete",
                    title_ar: "حذف",
                    onClick: () => Alert.alert("Delete button clicked"),
                  },
                ]}
                rowVariant="6colButton"
                columnsData={[
                  {
                    key: "field",
                    label: "Field",
                    label_ar: "الحقل",
                  },
                  {
                    key: "col1",
                    label: "Value 1",
                    label_ar: "القيمة 1",
                  },
                  {
                    key: "col2",
                    label: "Value 2",
                    label_ar: "القيمة 2",
                  },
                  {
                    key: "col3",
                    label: "Value 3",
                    label_ar: "القيمة 3",
                  },
                  {
                    key: "col4",
                    label: "Value 4",
                    label_ar: "القيمة 4",
                  },
                  {
                    key: "col5",
                    label: "Value 5",
                    label_ar: "القيمة 5",
                  },
                ]}
                rowsData={[
                  {
                    label: "Identity Details",
                    label_ar: "تفاصيل الهوية",
                    button: { title: "Hello", onClick: () => alert("hello") },
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
                      {
                        label: "Archive Number",
                        label_ar: "رقم الأرشيف",
                        value: "7921",
                        value_ar: "7921",
                      },
                      {
                        label: "Archive Number",
                        label_ar: "رقم الأرشيف",
                        value: "7921",
                        value_ar: "7921",
                      },
                      {
                        label: "Archive Number",
                        label_ar: "رقم الأرشيف",
                        value: "7921",
                        value_ar: "7921",
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
                        label: "Share",
                        label_ar: "الحصة",
                        value: "100% Allotment 50% Share",
                        value_ar: "100% تخصيص 50% حصة",
                      },

                      {
                        label: "Share",
                        label_ar: "الحصة",
                        value: "100% Allotment 50% Share",
                        value_ar: "100% تخصيص 50% حصة",
                      },
                    ],
                  },
                  {
                    label: "Right Hold Type",
                    label_ar: "نوع حق الحيازة",
                    extraItems: [
                      {
                        value: "Ownership Musataha",
                        value_ar: "ملكية مستطاعة",
                      },
                      {
                        value: "Ownership Musataha",
                        value_ar: "ملكية مستطاعة",
                      },
                      {
                        value: "Ownership Musataha",
                        value_ar: "ملكية مستطاعة",
                      },
                      {
                        value: "Ownership Musataha",
                        value_ar: "ملكية مستطاعة",
                      },
                      {
                        value: "Ownership Musataha",
                        value_ar: "ملكية مستطاعة",
                      },
                    ],
                  },
                ]}
                showFooterButtons={true}
                footerButton={[
                  {
                    title: "Edit",
                    title_ar: "تعديل",
                    onClick: () => Alert.alert("Edit button clicked"),
                  },
                  {
                    title: "Delete",
                    title_ar: "حذف",
                    onClick: () => Alert.alert("Delete button clicked"),
                  },
                ]}
                showPagination={true}
                currentPage={1}
                totalPages={10}
                pageSize={5}
                onPageChange={(page) => console.log(page)}
              />
            </View> */}

            {/* ── G-5.9 Card Title ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.9 — Card Title</Text>
              <CardTitle
                platform="mobile"
                title="Project Details"
                title_ar="تفاصيل المشروع"
                description="This is a description for the project card"
                subText="Updated 2 days ago"
                isExpandable
                isExpanded={true}
                variant="medium"
                language="en"
                showButtons={false}
                showBorder={false}
              />
              <CardTitle
                platform="mobile"
                title="Project Details"
                title_ar="تفاصيل المشروع"
                description="This is a description for the project card"
                buttons={[
                  {
                    title: "Edit",
                    type: "primary",
                    onClick: () => Alert.alert("Edit clicked"),
                  },
                  {
                    title: "Delete",
                    type: "delete",
                    onClick: () => Alert.alert("Delete clicked"),
                  },
                ]}
                isExpandable={false}
                isExpanded={true}
                variant="medium"
                language="en"
                showButtons={true}
                showBorder={false}
              />
              <CardTitle
                platform="mobile"
                title="Project Details"
                title_ar="تفاصيل المشروع"
                description="This is a description"
                subText="2 days ago"
                status="Pending"
                isExpandable={false}
                isExpanded={true}
                variant="medium"
                language="en"
                showButtons={false}
                showBorder={false}
              />
            </View> */}

            {/* ── G-5.10 ViewOwnerDetail ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-5.10 — ViewOwnerDetail</Text>
              <ViewOwnerDetail
                language="en"
                mainTitle="Plot Ownership Details"
                owner={{
                  name: "Ahmed Khalid",
                  details: [
                    { label: "Nationality", value: "UAE" },
                    { label: "Emirates ID", value: "784-1234-5678901-2" },
                    { label: "Ownership Share", value: "50%" },
                    { label: "Contact Number", value: "+971 50 123 4567" },
                    { label: "Email", value: "ahmed.khalid@email.com" },
                  ],
                }}
              />
              <ViewOwnerDetail
                language="ar"
                mainTitle="تفاصيل ملكية الأرض"
                ownerText="المالك"
                owner={{
                  name: "أحمد خالد",
                  details: [
                    { label: "الجنسية", value: "الإمارات" },
                    { label: "رقم الهوية", value: "784-1234-5678901-2" },
                    { label: "نسبة الملكية", value: "50٪" },
                    { label: "رقم الهاتف", value: "+971 50 123 4567" },
                    {
                      label: "البريد الإلكتروني",
                      value: "ahmed.khalid@email.com",
                    },
                  ],
                }}
              />
            </View> */}

            {/* ── G-5.12 ApplicationMessage ── */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                G-5.12 — ApplicationMessage
              </Text>
              <ApplicationMessage
                status="success"
                title="Application Submitted"
                description="Your application has been submitted successfully."
                platform="mobile"
              />
              <ApplicationMessage
                platform="mobile"
                status="error"
                title="Missing Information"
                description="Please enter your Emirates ID to continue."
                type="text"
                fieldType="uaeid"
                label="Emirates ID"
                value={textValue}
                required
                onInputChange={(val) => setTextValue(val as string)}
              />{" "}
              <ApplicationMessage
                platform="mobile"
                status="information"
                title="Select Application Type"
                description="Please choose the type of application."
                fieldType="select"
                selectType="single"
                label="Application Type"
                value={selectValue}
                options={[
                  { label: "Plot Allocation", value: "allocation" },
                  { label: "Ownership Transfer", value: "transfer" },
                  { label: "Plot Merge", value: "merge" },
                ]}
                onInputChange={(val) => setSelectValue(val as string)}
              />{" "}
              <ApplicationMessage
                platform="mobile"
                status="action"
                title="Select Required Documents"
                description="Choose all documents you want to upload."
                type="checkbox"
                label="Documents"
                value={checkboxValue}
                options={[
                  { label: "Passport", value: "passport" },
                  { label: "Emirates ID", value: "uaeid" },
                  { label: "Property Contract", value: "contract" },
                ]}
                onInputChange={(val) => setCheckboxValue(val as string[])}
              />{" "}
              <ApplicationMessage
                platform="mobile"
                status="information"
                title="Ownership Type"
                description="Select ownership category."
                type="radio"
                label="Ownership"
                value={radioValue}
                options={[
                  { label: "Individual", value: "individual" },
                  { label: "Company", value: "company" },
                ]}
                onInputChange={(val) => setRadioValue(val as string)}
              />{" "}
              <ApplicationMessage
                platform="mobile"
                status="action"
                title="Continue Application"
                description="Click the button below to proceed."
                type="button"
                label="Continue"
                onClick={() => Alert.alert("Continue clicked")}
              />{" "}
              <ApplicationMessage
                platform="mobile"
                language="ar"
                status="success"
                title="تم إرسال الطلب"
                description="تم إرسال طلبك بنجاح."
                type="button"
                label="متابعة"
                label_ar="متابعة"
                onClick={() => Alert.alert("متابعة")}
              />
            </View> */}

            {/* ── G-5.14 SearchPlot ── */}
            {/* <View>
              <Text style={styles.sectionTitle}>G-5.14 — SearchPlot</Text>
              <SearchPlot
                platform="mobile"
                title="Search Plot"
                subtitle="Choose how you want to search for plot ownership"
                initialOwnerType="plot"
                // onSubmit={handleSubmit}
                enabledTabs={{
                  plot: true,
                  company: true,
                  owner: true,
                  randomAllocation: false,
                }}
              />
              <CustomDrawer open={true} />
            </View> */}
          </ScrollView>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  section: { marginBottom: 40 },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 15,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 6,
  },
  variantLabel: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  tooltipRow: { marginBottom: 8 },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  toggleBtnText: { fontSize: 12 },
});
