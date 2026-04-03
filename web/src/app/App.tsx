import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@platform/Layout";
// G-0
import { Label } from "@/ui/Label";
import { Caption } from "@/ui/Caption";
import { Tooltip } from "@/ui/Tooltip";
import { Checkbox } from "@/ui/Checkbox";
import { Radio } from "@/ui/Radio";
import { CheckRadioLabel } from "@/ui/CheckRadioLabel";
import { AddButton } from "@/ui/AddButton";
import { Bk_DateInput } from "@/ui/bk_DateInput";
import { Fields } from "@/ui/Fields";
// G-2
import { TextInput } from "@/ui/TextInput";
import { PhoneInput } from "@/ui/PhoneInput";
import { TextArea } from "@/ui/TextArea";
import { Select } from "@/ui/Select";
import { MultiSelect } from "@/ui/MultiSelect";
import { CurrencyInput } from "@/ui/CurrencyInput";
import { NumberInput } from "@/ui/NumberInput";
import { DateSelect } from "@/ui/DateSelect";
import { CheckboxField } from "@/ui/CheckboxField";
import { CheckboxInput } from "@/ui/CheckboxInput";
import { RadioField } from "@/ui/RadioField";
import { RadioInput } from "@/ui/RadioInput";
import { Toast } from "@/ui/Toast";
import { Logo } from "@/ui/Logo";
import { Avatar } from "@/ui/Avatar";
import { Buttons } from "@/ui/Buttons";
import { ArrowLeft, ArrowRight, Delete } from "lucide-react";
import { Typography } from "@/ui/Typography";
import { Breadcrumb } from "@/ui/Breadcrumb";
import { Prompt } from "@/ui/Prompt";
import { ScreenLoader } from "@/ui/ScreenLoader";
import TitleBar from "@/components/TitleBar";
import { FilterBar } from "@/ui/FilterBar";
import Signature from "@/ui/Signature";
import { UploadDocuments } from "@platform/UploadDocuments";
import axios from "axios";
import { ViewPlotDetail } from "@shared/components/ViewPlotDetail";
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
import Payment from "@shared/components/Payment";
import PaymentDetails from "@shared/components/PaymentDetails";
import ApplicationSummary, {
  type ApplicationSummaryProps,
  type UiBlock,
} from "@shared/components/ApplicationSummary";

const ST = "text-bold-l text-text-default mb-2";
const SS = "text-bold-s text-text-dimmed mb-1 mt-3";

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

function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  // G-0 interactive state
  const [cbInteractive, setCbInteractive] = useState(false);
  const [radioGroup, setRadioGroup] = useState("");
  const [dateInVal, setDateInVal] = useState("");
  // G-0.9 Fields
  const [fText, setFText] = useState("");
  const [fTextarea, setFTextarea] = useState("");
  const [fSelect, setFSelect] = useState("");
  const [fMulti, setFMulti] = useState("");
  const [fDate, setFDate] = useState("");
  const [fCurrency, setFCurrency] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fNumber, setFNumber] = useState("");
  const [fUaeid, setFUaeid] = useState("");
  // G-2 interactive state
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

  const layoutMenuItems = [
    { label: "Profile", label_ar: "الملف الشخصي", onClick: () => {} },
    { label: "Logout", label_ar: "تسجيل الخروج", onClick: () => {} },
  ];
  const layoutBreadcrumbItems = [
    { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
    {
      label: "G-0 & G-2 Components",
      label_ar: "مكونات G-0 و G-2",
      onClick: () => {},
    },
  ];

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

  axios.defaults.baseURL =
    "https://onehub-runtime-backend-dncuhce5dygpbydu.canadacentral-01.azurewebsites.net/";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    (async function () {
      await axios.post(`/dmt/login`, { email: "admin", password: "321" });
    })();
  }, []);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Layout
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
        isEditing={false}
        menuItems={layoutMenuItems}
        breadcrumbItems={layoutBreadcrumbItems}
        showHeader
        showSidebar
        showFooter
        toast={{ message: "", status: "success" }}
      >
        <div className="p-6 flex flex-col gap-10">
          {/* ══════════════════════════ G-0.1 Label ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.1 — Label</h2>
            <p className={SS}>default</p>
            <Label
              language={language}
              label="Field Label"
              label_ar="تسمية الحقل"
            />

            <p className={SS}>required=true</p>
            <Label
              language={language}
              label="Required Field"
              label_ar="حقل مطلوب"
              required
            />

            <p className={SS}>showInfoIcon=true</p>
            <Label
              language={language}
              label="Info Field"
              label_ar="حقل معلومات"
              showInfoIcon
              tooltipText="Additional info"
              tooltipText_ar="معلومات إضافية"
            />

            <p className={SS}>required=true + showInfoIcon=true</p>
            <Label
              language={language}
              label="Required + Info"
              label_ar="مطلوب + معلومات"
              required
              showInfoIcon
              tooltipText="This field is required"
              tooltipText_ar="هذا الحقل مطلوب"
            />

            <p className={SS}>disabled=true</p>
            <Label
              language={language}
              label="Disabled Label"
              label_ar="تسمية معطلة"
              disabled
            />

            <p className={SS}>disabled=true + showInfoIcon=true</p>
            <Label
              language={language}
              label="Disabled + Info"
              label_ar="معطل + معلومات"
              disabled
              showInfoIcon
              tooltipText="Disabled tooltip"
              tooltipText_ar="تلميح معطل"
            />

            <p className={SS}>language="ar" forced, required + showInfoIcon</p>
            <Label
              language="ar"
              label="Field"
              label_ar="الحقل"
              required
              showInfoIcon
              tooltipText="Arabic tooltip"
              tooltipText_ar="تلميح عربي"
            />
          </section> */}

          {/* ══════════════════════════ G-0.2 Caption ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.2 — Caption</h2>
            <p className={SS}>default (both captions)</p>
            <Caption
              language={language}
              captionLeft="Left caption"
              captionLeft_ar="التسمية اليسرى"
              captionRight="Right caption"
              captionRight_ar="التسمية اليمنى"
            />

            <p className={SS}>captionLeft only</p>
            <Caption
              language={language}
              captionLeft="Left only"
              captionLeft_ar="اليسار فقط"
            />

            <p className={SS}>captionRight only</p>
            <Caption
              language={language}
              captionRight="Right only"
              captionRight_ar="اليمين فقط"
            />

            <p className={SS}>hasError=true + errorMessage</p>
            <Caption
              language={language}
              captionLeft="Left"
              captionLeft_ar="اليسار"
              hasError
              errorMessage="This field is required"
              errorMessage_ar="هذا الحقل مطلوب"
            />

            <p className={SS}>disabled=true</p>
            <Caption
              language={language}
              captionLeft="Disabled left"
              captionLeft_ar="معطل يسار"
              captionRight="Disabled right"
              captionRight_ar="معطل يمين"
              disabled
            />

            <p className={SS}>language="ar" forced</p>
            <Caption
              language="ar"
              captionLeft="Left"
              captionLeft_ar="يسار"
              captionRight="Right"
              captionRight_ar="يمين"
            />
          </section> */}

          {/* ══════════════════════════ G-0.3 Tooltip ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.3 — Tooltip (all directions)</h2>
            <div className="flex flex-wrap gap-10 mt-6 mb-6">
              {TOOLTIP_DIRS.map((dir) => (
                <div key={dir} className="flex flex-col items-center gap-1">
                  <p className="text-xs text-text-dimmed">{dir}</p>
                  <div className="relative mt-4 mb-4">
                    <Tooltip
                      language={language}
                      text="Tooltip"
                      text_ar="تلميح"
                      direction={dir}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className={SS}>language="ar" forced, direction="top-right"</p>
            <div className="relative mt-4 mb-4 w-fit">
              <Tooltip
                language="ar"
                text="Tooltip"
                text_ar="تلميح نصي"
                direction="top-right"
              />
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.4 Checkbox ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.4 — Checkbox</h2>
            <div className="flex flex-wrap gap-8 mt-2">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">unchecked</p>
                <Checkbox id="cb-un" checked={false} onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">checked</p>
                <Checkbox id="cb-ch" checked={true} onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">interactive</p>
                <Checkbox
                  id="cb-int"
                  checked={cbInteractive}
                  onChange={(_id, v) => setCbInteractive(v)}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <Checkbox
                  id="cb-dis-un"
                  checked={false}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <Checkbox
                  id="cb-dis-ch"
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <Checkbox
                  id="cb-err"
                  checked={false}
                  hasError
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.5 Radio ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.5 — Radio</h2>
            <div className="flex flex-wrap gap-8 mt-2">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">unchecked</p>
                <Radio
                  id="r-un"
                  name="r-static"
                  checked={false}
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">checked</p>
                <Radio
                  id="r-ch"
                  name="r-static2"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">interactive group</p>
                <div className="flex gap-3">
                  {["a", "b", "c"].map((v) => (
                    <Radio
                      key={v}
                      id={`r-grp-${v}`}
                      name="r-group"
                      checked={radioGroup === v}
                      onChange={() => setRadioGroup(v)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <Radio
                  id="r-dis-un"
                  name="r-dis"
                  checked={false}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <Radio
                  id="r-dis-ch"
                  name="r-dis2"
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <Radio
                  id="r-err"
                  name="r-err"
                  checked={false}
                  hasError
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.6 CheckRadioLabel ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.6 — CheckRadioLabel</h2>
            <p className={SS}>default</p>
            <CheckRadioLabel
              language={language}
              label="Option Label"
              label_ar="تسمية الخيار"
            />

            <p className={SS}>disabled</p>
            <CheckRadioLabel
              language={language}
              label="Disabled Label"
              label_ar="تسمية معطلة"
              disabled
            />

            <p className={SS}>language="ar" forced</p>
            <CheckRadioLabel language="ar" label="Label" label_ar="التسمية" />
          </section> */}

          {/* ══════════════════════════ G-0.7 AddButton ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.7 — AddButton</h2>
            <div className="flex gap-8 mt-2">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">enabled</p>
                <AddButton onClick={() => console.log("add")} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled</p>
                <AddButton disabled onClick={() => {}} />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.8 DateInput (Bk_DateInput) ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.8 — DateInput (Bk_DateInput)</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (no label, interactive)</p>
                <Bk_DateInput
                  language={language}
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  value={dateInVal}
                  onDateChange={(d) =>
                    setDateInVal(d ? d.toISOString().split("T")[0] : "")
                  }
                />
              </div>
              <div>
                <p className={SS}>label + required</p>
                <Bk_DateInput
                  language={language}
                  label="Date of Birth"
                  label_ar="تاريخ الميلاد"
                  required
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errMessage</p>
                <Bk_DateInput
                  language={language}
                  label="Date"
                  label_ar="التاريخ"
                  hasError
                  errMessage="Date is required"
                  errMessage_ar="التاريخ مطلوب"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled (pre-filled)</p>
                <Bk_DateInput
                  language={language}
                  label="Date (disabled)"
                  label_ar="التاريخ (معطل)"
                  disabled
                  value="2025-06-15"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>with infoText</p>
                <Bk_DateInput
                  language={language}
                  label="Date"
                  label_ar="التاريخ"
                  infoText="Pick from calendar"
                  infoText_ar="اختر من التقويم"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>caption left</p>
                <Bk_DateInput
                  language={language}
                  label="Date"
                  label_ar="التاريخ"
                  captionLeft="DD/MM/YYYY"
                  captionLeft_ar="يوم/شهر/سنة"
                  // captionPosition="left"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>caption right</p>
                <Bk_DateInput
                  language={language}
                  label="Date"
                  label_ar="التاريخ"
                  captionRight="Optional"
                  captionRight_ar="اختياري"
                  // captionPosition="right"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <Bk_DateInput
                  language="ar"
                  label="Date"
                  label_ar="التاريخ"
                  required
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.9 Fields ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.9 — Fields</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>type="text" (interactive)</p>
                <Fields
                  language={language}
                  type="text"
                  placeholder="Enter text"
                  placeholder_ar="أدخل النص"
                  value={fText}
                  onChange={setFText}
                />
              </div>
              <div>
                <p className={SS}>type="text" hasError</p>
                <Fields
                  language={language}
                  type="text"
                  placeholder="Enter text"
                  placeholder_ar="أدخل النص"
                  value=""
                  onChange={() => {}}
                  hasError
                  errorMessage="Required"
                  errorMessage_ar="مطلوب"
                />
              </div>
              <div>
                <p className={SS}>type="text" disabled</p>
                <Fields
                  language={language}
                  type="text"
                  placeholder="Disabled"
                  placeholder_ar="معطل"
                  value="Disabled value"
                  onChange={() => {}}
                  disabled
                />
              </div>
              <div>
                <p className={SS}>type="textarea" (interactive)</p>
                <Fields
                  language={language}
                  type="textarea"
                  placeholder="Enter text..."
                  placeholder_ar="أدخل النص..."
                  value={fTextarea}
                  onChange={setFTextarea}
                />
              </div>
              <div>
                <p className={SS}>type="select" single (interactive)</p>
                <Fields
                  language={language}
                  type="select"
                  selectType="single"
                  placeholder="Select option"
                  placeholder_ar="اختر خياراً"
                  value={fSelect}
                  onChange={setFSelect}
                  options={selectOptions}
                />
              </div>
              <div>
                <p className={SS}>type="select" multi (interactive)</p>
                <Fields
                  language={language}
                  type="select"
                  selectType="multi"
                  placeholder="Select options"
                  placeholder_ar="اختر الخيارات"
                  value={fMulti}
                  onChange={setFMulti}
                  options={selectOptions}
                />
              </div>
              <div>
                <p className={SS}>type="date" (interactive)</p>
                <Fields
                  language={language}
                  type="date"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  value={fDate}
                  onChange={setFDate}
                />
              </div>
              <div>
                <p className={SS}>type="currency" AED (interactive)</p>
                <Fields
                  language={language}
                  type="currency"
                  currencySymbol="AED"
                  placeholder="0.00"
                  placeholder_ar="٠.٠٠"
                  value={fCurrency}
                  onChange={setFCurrency}
                />
              </div>
              <div>
                <p className={SS}>type="phone" +971 (interactive)</p>
                <Fields
                  language={language}
                  type="phone"
                  phoneCode="+971"
                  placeholder="5x xxx xxxx"
                  placeholder_ar="٥× ××× ××××"
                  value={fPhone}
                  onChange={setFPhone}
                />
              </div>
              <div>
                <p className={SS}>type="number" (interactive)</p>
                <Fields
                  language={language}
                  type="number"
                  placeholder="Enter number"
                  placeholder_ar="أدخل الرقم"
                  value={fNumber}
                  onChange={setFNumber}
                />
              </div>
              <div>
                <p className={SS}>type="uaeid" (interactive)</p>
                <Fields
                  language={language}
                  type="uaeid"
                  placeholder="784-XXXX-XXXXXXX-X"
                  placeholder_ar="784-XXXX-XXXXXXX-X"
                  value={fUaeid}
                  onChange={setFUaeid}
                />
              </div>
              <div>
                <p className={SS}>type="text" language="ar" forced</p>
                <Fields
                  language="ar"
                  type="text"
                  placeholder="Enter text"
                  placeholder_ar="أدخل النص"
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.10 Toast ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.10 — Toast</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>success variant</p>
                <Toast
                  message="Operation completed successfully!"
                  status="success"
                />
              </div>
              <div>
                <p className={SS}>error variant</p>
                <Toast
                  message="Something went wrong. Please try again."
                  status="error"
                />
              </div>
              <div>
                <p className={SS}>information variant</p>
                <Toast
                  message="Your profile has been updated."
                  status="information"
                />
              </div>
              <div>
                <p className={SS}>action variant</p>
                <Toast
                  message="New update available. Click to install."
                  status="action"
                />
              </div>
              <div>
                <p className={SS}>default (no status)</p>
                <Toast message="This is a default toast message." />
              </div>
              <div>
                <p className={SS}>with long message</p>
                <Toast
                  message="This is a very long toast message that will wrap."
                  status="information"
                />
              </div>
              <div>
                <p className={SS}>success (Arabic content)</p>
                <Toast message="تمت العملية بنجاح" status="success" />
              </div>
              <div>
                <p className={SS}>error (Arabic content)</p>
                <Toast message="حدث خطأ. حاول مرة اخرى" status="error" />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.16 Logo ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.16 — Logo</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>full variant</p>
                <Logo type="full" />
              </div>
              <div>
                <p className={SS}>icon variant</p>
                <Logo type="icon" />
              </div>
              <div>
                <p className={SS}>hub variant (OneHubsvg)</p>
                <Logo type="hub" />
              </div>
              <div>
                <p className={SS}>full with custom className</p>
                <Logo
                  type="full"
                  className="border border-gray-200 rounded p-2"
                />
              </div>
              <div>
                <p className={SS}>icon with custom size (64x64)</p>
                <Logo type="icon" width="64px" height="64px" />
              </div>
              <div>
                <p className={SS}>hub with custom color (via className)</p>
                <Logo type="hub" className="text-blue-600" />
              </div>
              <div>
                <p className={SS}>full with custom dimensions</p>
                <Logo type="full" width="200px" height="44px" />
              </div>
              <div>
                <p className={SS}>icon with custom className + size</p>
                <Logo
                  type="icon"
                  width="48px"
                  height="48px"
                  className="bg-gray-100 p-2 rounded-full"
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-0.17 Avatar ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.17 — Avatar</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>with image (no status)</p>
                <Avatar
                  imageUrl="https://adrec-images.mastermind-mindset.com/dmtIocn.svg"
                  avatarSize={48}
                />
              </div>
              <div>
                <p className={SS}>with image + inProgress status</p>
                <Avatar
                  imageUrl="https://adrec-images.mastermind-mindset.com/dmtIocn.svg"
                  status="inProgress"
                  avatarSize={48}
                  badgeSize={16}
                />
              </div>
              <div>
                <p className={SS}>with initials (complete)</p>
                <Avatar
                  initials="JD"
                  status="complete"
                  avatarSize={48}
                  badgeSize={16}
                  initialsTextColor="#3B82F6"
                  initialsBorderColor="#CBD5E1"
                />
              </div>
              <div>
                <p className={SS}>with initials (failed)</p>
                <Avatar
                  initials="AR"
                  status="failed"
                  avatarSize={48}
                  badgeSize={16}
                  initialsFontSize={18}
                  initialsTextColor="#8B5CF6"
                />
              </div>
              <div>
                <p className={SS}>with initials (pending)</p>
                <Avatar
                  initials="MK"
                  status="pending"
                  avatarSize={48}
                  badgeSize={16}
                  initialsFontSize={18}
                />
              </div>
              <div>
                <p className={SS}>default placeholder</p>
                <Avatar avatarSize={48} />
              </div>
            </div>
          </section> */}

          {/* <div className="border-t border-gray-300 my-4" />
          <h1 className="text-bold-l text-text-default">
            Group 2 — Form Components
          </h1> */}

          {/* ══════════════════════════ G-2.1 TextInput ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.1 — TextInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <TextInput
                  language={language}
                  label="Full Name"
                  label_ar="الاسم الكامل"
                  placeholder="Enter name"
                  placeholder_ar="أدخل الاسم"
                  value={tiVal}
                  onChange={setTiVal}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <TextInput
                  language={language}
                  label="Username"
                  label_ar="اسم المستخدم"
                  required
                  showInfoIcon
                  tooltipText="Unique identifier"
                  tooltipText_ar="معرف فريد"
                  placeholder="Enter username"
                  placeholder_ar="أدخل اسم المستخدم"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <TextInput
                  language={language}
                  label="Email"
                  label_ar="البريد الإلكتروني"
                  hasError
                  errorMessage="Invalid email"
                  errorMessage_ar="بريد إلكتروني غير صالح"
                  placeholder="Enter email"
                  placeholder_ar="أدخل البريد"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <TextInput
                  language={language}
                  label="ID"
                  label_ar="الرقم"
                  disabled
                  value="DIS-001"
                  placeholder=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>with captions left + right</p>
                <TextInput
                  language={language}
                  label="Password"
                  label_ar="كلمة المرور"
                  captionLeft="Min 8 chars"
                  captionLeft_ar="٨ أحرف على الأقل"
                  captionRight="Optional"
                  captionRight_ar="اختياري"
                  placeholder="Enter password"
                  placeholder_ar="أدخل كلمة المرور"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>fieldType="uaeid"</p>
                <TextInput
                  language={language}
                  label="UAE ID"
                  label_ar="الهوية الإماراتية"
                  fieldType="uaeid"
                  placeholder="784-XXXX-XXXXXXX-X"
                  placeholder_ar="784-XXXX-XXXXXXX-X"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced, required</p>
                <TextInput
                  language="ar"
                  label="Name"
                  label_ar="الاسم"
                  required
                  placeholder="Enter"
                  placeholder_ar="أدخل"
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.2 PhoneInput ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.2 — PhoneInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default +971 (interactive)</p>
                <PhoneInput
                  language={language}
                  label="Mobile"
                  label_ar="الجوال"
                  placeholder="5x xxx xxxx"
                  placeholder_ar="٥× ××× ××××"
                  value={piVal}
                  onChange={setPiVal}
                />
              </div>
              <div>
                <p className={SS}>required</p>
                <PhoneInput
                  language={language}
                  label="Phone"
                  label_ar="الهاتف"
                  required
                  placeholder="5x xxx xxxx"
                  placeholder_ar="٥× ××× ××××"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <PhoneInput
                  language={language}
                  label="Phone"
                  label_ar="الهاتف"
                  hasError
                  errorMessage="Invalid phone"
                  errorMessage_ar="رقم هاتف غير صالح"
                  placeholder="5x xxx xxxx"
                  placeholder_ar="٥× ××× ××××"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <PhoneInput
                  language={language}
                  label="Phone"
                  label_ar="الهاتف"
                  disabled
                  value="501234567"
                  placeholder="5x xxx xxxx"
                  placeholder_ar="٥× ××× ××××"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>phoneCode="+1" (US)</p>
                <PhoneInput
                  language={language}
                  label="US Phone"
                  label_ar="هاتف أمريكي"
                  phoneCode="+1"
                  placeholder="(xxx) xxx-xxxx"
                  placeholder_ar="(xxx) xxx-xxxx"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <PhoneInput
                  language="ar"
                  label="Phone"
                  label_ar="الهاتف"
                  required
                  placeholder="5x xxx xxxx"
                  placeholder_ar="٥× ××× ××××"
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.3 TextArea ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.3 — TextArea</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <TextArea
                  language={language}
                  label="Notes"
                  label_ar="ملاحظات"
                  placeholder="Enter notes..."
                  placeholder_ar="أدخل الملاحظات..."
                  value={taVal}
                  onChange={setTaVal}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <TextArea
                  language={language}
                  label="Description"
                  label_ar="الوصف"
                  required
                  showInfoIcon
                  tooltipText="Describe in detail"
                  tooltipText_ar="صف بالتفصيل"
                  placeholder="Enter description"
                  placeholder_ar="أدخل الوصف"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <TextArea
                  language={language}
                  label="Remarks"
                  label_ar="الملاحظات"
                  hasError
                  errorMessage="Remarks required"
                  errorMessage_ar="الملاحظات مطلوبة"
                  placeholder="Enter remarks"
                  placeholder_ar="أدخل الملاحظات"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <TextArea
                  language={language}
                  label="Notes"
                  label_ar="ملاحظات"
                  disabled
                  value="Disabled content"
                  placeholder=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>with captions</p>
                <TextArea
                  language={language}
                  label="Comments"
                  label_ar="التعليقات"
                  captionLeft="Max 500 chars"
                  captionLeft_ar="الحد الأقصى ٥٠٠ حرف"
                  captionRight="Optional"
                  captionRight_ar="اختياري"
                  placeholder="Enter comments"
                  placeholder_ar="أدخل التعليقات"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <TextArea
                  language="ar"
                  label="Notes"
                  label_ar="ملاحظات"
                  placeholder="Enter notes"
                  placeholder_ar="أدخل الملاحظات"
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.4 Select ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.4 — Select</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default, no selection (interactive)</p>
                <Select
                  language={language}
                  label="Category"
                  label_ar="الفئة"
                  placeholder="Select category"
                  placeholder_ar="اختر الفئة"
                  options={selectOptions}
                  value={selVal}
                  onChange={setSelVal}
                />
              </div>
              <div>
                <p className={SS}>pre-selected value="b"</p>
                <Select
                  language={language}
                  label="Category"
                  label_ar="الفئة"
                  placeholder="Select"
                  placeholder_ar="اختر"
                  options={selectOptions}
                  value="b"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <Select
                  language={language}
                  label="Type"
                  label_ar="النوع"
                  required
                  showInfoIcon
                  tooltipText="Select a type"
                  tooltipText_ar="اختر النوع"
                  placeholder="Select type"
                  placeholder_ar="اختر النوع"
                  options={selectOptions}
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <Select
                  language={language}
                  label="Status"
                  label_ar="الحالة"
                  hasError
                  errorMessage="Selection required"
                  errorMessage_ar="الاختيار مطلوب"
                  placeholder="Select status"
                  placeholder_ar="اختر الحالة"
                  options={selectOptions}
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <Select
                  language={language}
                  label="Zone"
                  label_ar="المنطقة"
                  disabled
                  placeholder="Select zone"
                  placeholder_ar="اختر المنطقة"
                  options={selectOptions}
                  value="a"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>with dropdown title</p>
                <Select
                  language={language}
                  label="Area"
                  label_ar="المساحة"
                  title="Choose an Area"
                  title_ar="اختر منطقة"
                  placeholder="Select area"
                  placeholder_ar="اختر منطقة"
                  options={selectOptions}
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <Select
                  language="ar"
                  label="Category"
                  label_ar="الفئة"
                  placeholder="Select"
                  placeholder_ar="اختر"
                  options={selectOptions}
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.5 MultiSelect ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.5 — MultiSelect</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default, no selection (interactive)</p>
                <MultiSelect
                  language={language}
                  label="Categories"
                  label_ar="الفئات"
                  placeholder="Select categories"
                  placeholder_ar="اختر الفئات"
                  options={selectOptions}
                  value={msVal}
                  onChange={setMsVal}
                />
              </div>
              <div>
                <p className={SS}>pre-selected ["a","c"]</p>
                <MultiSelect
                  language={language}
                  label="Categories"
                  label_ar="الفئات"
                  placeholder="Select"
                  placeholder_ar="اختر"
                  options={selectOptions}
                  value={["a", "c"]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <MultiSelect
                  language={language}
                  label="Tags"
                  label_ar="العلامات"
                  required
                  showInfoIcon
                  tooltipText="Select multiple"
                  tooltipText_ar="اختر متعدد"
                  placeholder="Select tags"
                  placeholder_ar="اختر العلامات"
                  options={selectOptions}
                  value={[]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <MultiSelect
                  language={language}
                  label="Services"
                  label_ar="الخدمات"
                  hasError
                  errorMessage="Select at least one"
                  errorMessage_ar="اختر واحداً على الأقل"
                  placeholder="Select"
                  placeholder_ar="اختر"
                  options={selectOptions}
                  value={[]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled with selection</p>
                <MultiSelect
                  language={language}
                  label="Categories"
                  label_ar="الفئات"
                  disabled
                  placeholder="Select"
                  placeholder_ar="اختر"
                  options={selectOptions}
                  value={["b"]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>showAddButton=true</p>
                <MultiSelect
                  language={language}
                  label="Tags"
                  label_ar="العلامات"
                  showAddButton
                  placeholder="Select tags"
                  placeholder_ar="اختر العلامات"
                  options={selectOptions}
                  value={[]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <MultiSelect
                  language="ar"
                  label="Categories"
                  label_ar="الفئات"
                  placeholder="Select"
                  placeholder_ar="اختر"
                  options={selectOptions}
                  value={[]}
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.6 CurrencyInput ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.6 — CurrencyInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default AED (interactive)</p>
                <CurrencyInput
                  language={language}
                  label="Amount"
                  label_ar="المبلغ"
                  placeholder="0.00"
                  placeholder_ar="٠.٠٠"
                  value={curVal}
                  onChange={setCurVal}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <CurrencyInput
                  language={language}
                  label="Rent Amount"
                  label_ar="مبلغ الإيجار"
                  required
                  showInfoIcon
                  tooltipText="Annual rent"
                  tooltipText_ar="الإيجار السنوي"
                  placeholder="0.00"
                  placeholder_ar="٠.٠٠"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <CurrencyInput
                  language={language}
                  label="Fees"
                  label_ar="الرسوم"
                  hasError
                  errorMessage="Enter valid amount"
                  errorMessage_ar="أدخل مبلغاً صالحاً"
                  placeholder="0.00"
                  placeholder_ar="٠.٠٠"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <CurrencyInput
                  language={language}
                  label="Amount"
                  label_ar="المبلغ"
                  disabled
                  value="5000"
                  placeholder="0.00"
                  placeholder_ar="٠.٠٠"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>currencySymbol="USD"</p>
                <CurrencyInput
                  language={language}
                  label="USD Amount"
                  label_ar="المبلغ بالدولار"
                  currencySymbol="USD"
                  placeholder="0.00"
                  placeholder_ar="٠.٠٠"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <CurrencyInput
                  language="ar"
                  label="Amount"
                  label_ar="المبلغ"
                  placeholder="0.00"
                  placeholder_ar="٠.٠٠"
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.7 NumberInput ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.7 — NumberInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <NumberInput
                  language={language}
                  label="Quantity"
                  label_ar="الكمية"
                  placeholder="Enter number"
                  placeholder_ar="أدخل الرقم"
                  value={numVal}
                  onChange={setNumVal}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <NumberInput
                  language={language}
                  label="Area (m²)"
                  label_ar="المساحة (م²)"
                  required
                  showInfoIcon
                  tooltipText="Area in m²"
                  tooltipText_ar="المساحة بالأمتار المربعة"
                  placeholder="0"
                  placeholder_ar="٠"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <NumberInput
                  language={language}
                  label="Count"
                  label_ar="العدد"
                  hasError
                  errorMessage="Enter valid number"
                  errorMessage_ar="أدخل رقماً صالحاً"
                  placeholder="0"
                  placeholder_ar="٠"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <NumberInput
                  language={language}
                  label="Units"
                  label_ar="الوحدات"
                  disabled
                  value="42"
                  placeholder="0"
                  placeholder_ar="٠"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>with captions</p>
                <NumberInput
                  language={language}
                  label="Units"
                  label_ar="الوحدات"
                  captionLeft="Min: 1"
                  captionLeft_ar="الحد الأدنى: ١"
                  captionRight="Max: 100"
                  captionRight_ar="الحد الأقصى: ١٠٠"
                  placeholder="1–100"
                  placeholder_ar="١–١٠٠"
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <NumberInput
                  language="ar"
                  label="Number"
                  label_ar="الرقم"
                  placeholder="Enter"
                  placeholder_ar="أدخل"
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.8 DateSelect ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.8 — DateSelect</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <DateSelect
                  language={language}
                  label="Contract Date"
                  label_ar="تاريخ العقد"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={(d) =>
                    setDsVal(d ? d.toISOString().split("T")[0] : "")
                  }
                  value={dsVal}
                />
              </div>
              <div>
                <p className={SS}>required + infoText</p>
                <DateSelect
                  language={language}
                  label="Start Date"
                  label_ar="تاريخ البداية"
                  required
                  infoText="Pick the start date"
                  infoText_ar="اختر تاريخ البداية"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errMessage</p>
                <DateSelect
                  language={language}
                  label="End Date"
                  label_ar="تاريخ الانتهاء"
                  hasError
                  errMessage="Date is required"
                  errMessage_ar="التاريخ مطلوب"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled with value</p>
                <DateSelect
                  language={language}
                  label="Expiry"
                  label_ar="انتهاء الصلاحية"
                  disabled
                  value="2025-12-31"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>caption left</p>
                <DateSelect
                  language={language}
                  label="Issue Date"
                  label_ar="تاريخ الإصدار"
                  captionLeft="Gregorian calendar"
                  captionLeft_ar="التقويم الميلادي"
                  // captionPosition="left"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>caption right</p>
                <DateSelect
                  language={language}
                  label="Renewal Date"
                  label_ar="تاريخ التجديد"
                  captionRight="Optional"
                  captionRight_ar="اختياري"
                  captionPosition="right"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <DateSelect
                  language="ar"
                  label="Date"
                  label_ar="التاريخ"
                  required
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>pre-selected value</p>
                <DateSelect
                  language={language}
                  label="Date"
                  label_ar="التاريخ"
                  value="2025-03-15"
                  placeholder="Select date"
                  placeholder_ar="اختر التاريخ"
                  onDateChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.9 CheckboxField ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.9 — CheckboxField</h2>
            <div className="flex flex-wrap gap-6 mt-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">unchecked</p>
                <CheckboxField
                  language={language}
                  id="cbf-un"
                  label="Accept terms"
                  label_ar="قبول الشروط"
                  checked={false}
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">checked</p>
                <CheckboxField
                  language={language}
                  id="cbf-ch"
                  label="Accept terms"
                  label_ar="قبول الشروط"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">interactive</p>
                <CheckboxField
                  language={language}
                  id="cbf-int"
                  label="Subscribe"
                  label_ar="اشتراك"
                  checked={cbfVal}
                  onChange={setCbfVal}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <CheckboxField
                  language={language}
                  id="cbf-dis-un"
                  label="Disabled"
                  label_ar="معطل"
                  checked={false}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <CheckboxField
                  language={language}
                  id="cbf-dis-ch"
                  label="Disabled"
                  label_ar="معطل"
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <CheckboxField
                  language={language}
                  id="cbf-err"
                  label="Required"
                  label_ar="مطلوب"
                  checked={false}
                  hasError
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">language="ar" forced</p>
                <CheckboxField
                  language="ar"
                  id="cbf-ar"
                  label="Accept"
                  label_ar="قبول"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.10 CheckboxInput ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.10 — CheckboxInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default, no selection (interactive)</p>
                <CheckboxInput
                  language={language}
                  label="Preferences"
                  label_ar="التفضيلات"
                  options={checkOptions}
                  value={cbiVal}
                  onChange={setCbiVal}
                />
              </div>
              <div>
                <p className={SS}>pre-selected ["1","3"]</p>
                <CheckboxInput
                  language={language}
                  label="Preferences"
                  label_ar="التفضيلات"
                  options={checkOptions}
                  value={["1", "3"]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <CheckboxInput
                  language={language}
                  label="Choices"
                  label_ar="الاختيارات"
                  required
                  showInfoIcon
                  tooltipText="Select at least one"
                  tooltipText_ar="اختر واحداً على الأقل"
                  options={checkOptions}
                  value={[]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <CheckboxInput
                  language={language}
                  label="Services"
                  label_ar="الخدمات"
                  hasError
                  errorMessage="Select at least one"
                  errorMessage_ar="اختر خدمة واحدة على الأقل"
                  options={checkOptions}
                  value={[]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled with selection</p>
                <CheckboxInput
                  language={language}
                  label="Disabled"
                  label_ar="معطل"
                  disabled
                  options={checkOptions}
                  value={["2"]}
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <CheckboxInput
                  language="ar"
                  label="Choices"
                  label_ar="الاختيارات"
                  options={checkOptions}
                  value={[]}
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.11 RadioField ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.11 — RadioField</h2>
            <div className="flex flex-wrap gap-6 mt-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">unchecked</p>
                <RadioField
                  language={language}
                  id="rf-un"
                  value="opt1"
                  label="Option 1"
                  label_ar="الخيار ١"
                  checked={false}
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">checked</p>
                <RadioField
                  language={language}
                  id="rf-ch"
                  value="opt1"
                  label="Option 1"
                  label_ar="الخيار ١"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">interactive group</p>
                <div className="flex gap-4">
                  {["A", "B", "C"].map((v) => (
                    <RadioField
                      key={v}
                      language={language}
                      id={`rf-grp-${v}`}
                      value={v}
                      label={`Opt ${v}`}
                      label_ar={`خيار ${v}`}
                      checked={rfVal === v}
                      onChange={setRfVal}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <RadioField
                  language={language}
                  id="rf-dis-un"
                  value="d"
                  label="Disabled"
                  label_ar="معطل"
                  checked={false}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <RadioField
                  language={language}
                  id="rf-dis-ch"
                  value="d2"
                  label="Disabled"
                  label_ar="معطل"
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <RadioField
                  language={language}
                  id="rf-err"
                  value="e"
                  label="Error"
                  label_ar="خطأ"
                  checked={false}
                  hasError
                  onChange={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">language="ar" forced</p>
                <RadioField
                  language="ar"
                  id="rf-ar"
                  value="ar"
                  label="Arabic"
                  label_ar="عربي"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-2.12 RadioInput ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.12 — RadioInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>no selection (interactive)</p>
                <RadioInput
                  language={language}
                  label="Gender"
                  label_ar="الجنس"
                  options={checkOptions}
                  value={riVal}
                  onChange={setRiVal}
                />
              </div>
              <div>
                <p className={SS}>pre-selected value="2"</p>
                <RadioInput
                  language={language}
                  label="Gender"
                  label_ar="الجنس"
                  options={checkOptions}
                  value="2"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <RadioInput
                  language={language}
                  label="Type"
                  label_ar="النوع"
                  required
                  showInfoIcon
                  tooltipText="Select a type"
                  tooltipText_ar="اختر نوعاً"
                  options={checkOptions}
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <RadioInput
                  language={language}
                  label="Status"
                  label_ar="الحالة"
                  hasError
                  errorMessage="Selection required"
                  errorMessage_ar="الاختيار مطلوب"
                  options={checkOptions}
                  value=""
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>disabled with selection</p>
                <RadioInput
                  language={language}
                  label="Category"
                  label_ar="الفئة"
                  disabled
                  options={checkOptions}
                  value="1"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <RadioInput
                  language="ar"
                  label="Type"
                  label_ar="النوع"
                  options={checkOptions}
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </section> */}

          {/* <div className="border-t border-gray-300 my-4" />
          <h1 className="text-bold-l text-text-default">
            Group 3 — UI Primitives
          </h1> */}

          {/* ══════════════════════════ G-3.1 Buttons ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-3.1 — Buttons</h2>

            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Primary Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>primary - small</p>
                  <Buttons
                    title="Submit"
                    type="primary"
                    size="s"
                    onClick={() => console.log("Primary small clicked")}
                  />
                </div>
                <div>
                  <p className={SS}>primary - medium (default)</p>
                  <Buttons
                    title="Submit"
                    type="primary"
                    size="m"
                    onClick={() => console.log("Primary medium clicked")}
                  />
                </div>
                <div>
                  <p className={SS}>primary - large</p>
                  <Buttons
                    title="Submit"
                    type="primary"
                    size="l"
                    onClick={() => console.log("Primary large clicked")}
                  />
                </div>
                <div>
                  <p className={SS}>primary - disabled</p>
                  <Buttons
                    title="Submit"
                    type="primary"
                    disabled
                    onClick={() => console.log("Should not fire")}
                  />
                </div>
                <div>
                  <p className={SS}>primary - full width</p>
                  <Buttons
                    title="Submit"
                    type="primary"
                    fullWidth
                    onClick={() => console.log("Full width clicked")}
                  />
                </div>
                <div>
                  <p className={SS}>primary - with icons</p>
                  <Buttons
                    title="Submit"
                    type="primary"
                    leftIcon={<ArrowLeft size={14} />}
                    rightIcon={<ArrowRight size={14} />}
                    onClick={() => console.log("With icons clicked")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Secondary Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>secondary - default</p>
                  <Buttons
                    title="Cancel"
                    type="secondary"
                    onClick={() => console.log("Secondary clicked")}
                  />
                </div>
                <div>
                  <p className={SS}>secondary - disabled</p>
                  <Buttons title="Cancel" type="secondary" disabled />
                </div>
                <div>
                  <p className={SS}>secondary - with left icon</p>
                  <Buttons
                    title="Back"
                    type="secondary"
                    leftIcon={<ArrowLeft size={14} />}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Tertiary Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>tertiary - default</p>
                  <Buttons title="Learn More" type="tertiary" />
                </div>
                <div>
                  <p className={SS}>tertiary - disabled</p>
                  <Buttons title="Learn More" type="tertiary" disabled />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Text Link Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>text-link - default</p>
                  <Buttons title="Forgot Password?" type="text-link" />
                </div>
                <div>
                  <p className={SS}>text-link - disabled</p>
                  <Buttons title="Forgot Password?" type="text-link" disabled />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Delete Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>delete - default</p>
                  <Buttons title="Delete" type="delete" />
                </div>
                <div>
                  <p className={SS}>delete - disabled</p>
                  <Buttons title="Delete" type="delete" disabled />
                </div>
                <div>
                  <p className={SS}>delete - with icon</p>
                  <Buttons
                    title="Delete"
                    type="delete"
                    leftIcon={<Delete size={14} />}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Arabic Language
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>primary - Arabic</p>
                  <Buttons
                    language="ar"
                    title="Submit"
                    title_ar="إرسال"
                    type="primary"
                  />
                </div>
                <div>
                  <p className={SS}>secondary - Arabic with icon</p>
                  <Buttons
                    language="ar"
                    title="Cancel"
                    title_ar="إلغاء"
                    type="secondary"
                    leftIcon={<ArrowLeft size={14} />}
                  />
                </div>
                <div>
                  <p className={SS}>delete - Arabic</p>
                  <Buttons
                    language="ar"
                    title="Delete"
                    title_ar="حذف"
                    type="delete"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Custom Icon Colors
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>primary with custom icon color</p>
                  <Buttons
                    title="Submit"
                    type="primary"
                    leftIcon={<ArrowLeft size={14} />}
                    iconColor="#FFD700"
                  />
                </div>
                <div>
                  <p className={SS}>secondary with custom icon color</p>
                  <Buttons
                    title="Cancel"
                    type="secondary"
                    leftIcon={<ArrowLeft size={14} />}
                    iconColor="#EF4444"
                  />
                </div>
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-3.2 Typography ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-3.2 — Typography</h2>

            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Heading Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>h1-shouting (80px)</p>
                  <Typography
                    variant="h1-shouting"
                    text="Welcome to DMT"
                    text_ar="مرحباً بكم في دي إم تي"
                  />
                </div>
                <div>
                  <p className={SS}>h1-hero (64px)</p>
                  <Typography
                    variant="h1-hero"
                    text="Hero Section"
                    text_ar="قسم البطل"
                  />
                </div>
                <div>
                  <p className={SS}>h1 (48px)</p>
                  <Typography
                    variant="h1"
                    text="Main Heading"
                    text_ar="العنوان الرئيسي"
                  />
                </div>
                <div>
                  <p className={SS}>h2 (32px)</p>
                  <Typography
                    variant="h2"
                    text="Section Heading"
                    text_ar="عنوان القسم"
                  />
                </div>
                <div>
                  <p className={SS}>h3 (24px)</p>
                  <Typography
                    variant="h3"
                    text="Subsection Heading"
                    text_ar="عنوان القسم الفرعي"
                  />
                </div>
                <div>
                  <p className={SS}>h4 (16px)</p>
                  <Typography
                    variant="h4"
                    text="Small Heading"
                    text_ar="عنوان صغير"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Body Text (Normal Weight)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>text-lg (20px)</p>
                  <Typography
                    variant="text-lg"
                    text="Large body text for important content"
                    text_ar="نص كبير للمحتوى المهم"
                  />
                </div>
                <div>
                  <p className={SS}>text-md (16px)</p>
                  <Typography
                    variant="text-md"
                    text="Medium body text - default size"
                    text_ar="نص متوسط ​​- الحجم الافتراضي"
                  />
                </div>
                <div>
                  <p className={SS}>text-sm (14px)</p>
                  <Typography
                    variant="text-sm"
                    text="Small body text for secondary content"
                    text_ar="نص صغير للمحتوى الثانوي"
                  />
                </div>
                <div>
                  <p className={SS}>text-xs (12px)</p>
                  <Typography
                    variant="text-xs"
                    text="Extra small text for metadata"
                    text_ar="نص صغير جداً للبيانات الوصفية"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Body Text (Bold Weight)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>text-bold-lg (20px)</p>
                  <Typography
                    variant="text-bold-lg"
                    text="Large bold text for emphasis"
                    text_ar="نص عريض كبير للتأكيد"
                  />
                </div>
                <div>
                  <p className={SS}>text-bold-md (16px)</p>
                  <Typography
                    variant="text-bold-md"
                    text="Medium bold text for emphasis"
                    text_ar="نص عريض متوسط ​​للتأكيد"
                  />
                </div>
                <div>
                  <p className={SS}>text-bold-sm (14px)</p>
                  <Typography
                    variant="text-bold-sm"
                    text="Small bold text for labels"
                    text_ar="نص عريض صغير للتسميات"
                  />
                </div>
                <div>
                  <p className={SS}>text-bold-xs (12px)</p>
                  <Typography
                    variant="text-bold-xs"
                    text="Extra small bold text"
                    text_ar="نص عريض صغير جداً"
                  />
                </div>
                <div>
                  <p className={SS}>text-bold-xxs (10px)</p>
                  <Typography
                    variant="text-bold-xxs"
                    text="Tiny bold text for badges"
                    text_ar="نص عريض صغير جداً للشارات"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Color Variants (using text-md)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>default color</p>
                  <Typography
                    variant="text-md"
                    color="default"
                    text="Default text color"
                    text_ar="لون النص الافتراضي"
                  />
                </div>
                <div>
                  <p className={SS}>dimmed color</p>
                  <Typography
                    variant="text-md"
                    color="dimmed"
                    text="Dimmed text color"
                    text_ar="لون نص خافت"
                  />
                </div>
                <div>
                  <p className={SS}>primary color</p>
                  <Typography
                    variant="text-md"
                    color="primary"
                    text="Primary text color"
                    text_ar="لون النص الأساسي"
                  />
                </div>
                <div>
                  <p className={SS}>link color</p>
                  <Typography
                    variant="text-md"
                    color="link"
                    text="Link text color"
                    text_ar="لون نص الرابط"
                  />
                </div>
                <div>
                  <p className={SS}>link hover color</p>
                  <Typography
                    variant="text-md"
                    color="link-hover"
                    text="Link hover text color"
                    text_ar="لون نص تحويم الرابط"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Arabic Examples (RTL)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>h2 - Arabic only</p>
                  <Typography
                    variant="h2"
                    language="ar"
                    text="English Fallback"
                    text_ar="مرحباً بكم في تطبيق دي إم تي"
                  />
                </div>
                <div>
                  <p className={SS}>text-lg - Arabic with primary color</p>
                  <Typography
                    variant="text-lg"
                    language="ar"
                    color="primary"
                    text="English Fallback"
                    text_ar="هذا نص طويل باللغة العربية لإظهار كيفية عمل المكون مع النص العربي"
                  />
                </div>
                <div>
                  <p className={SS}>text-bold-md - Arabic dimmed</p>
                  <Typography
                    variant="text-bold-md"
                    language="ar"
                    color="dimmed"
                    text="English Fallback"
                    text_ar="نص عريض عربي بلون خافت"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Mixed Examples
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>h1 with link color</p>
                  <Typography
                    variant="h1"
                    color="link"
                    text="Clickable Heading"
                    text_ar="عنوان قابل للنقر"
                  />
                </div>
                <div>
                  <p className={SS}>text-xs with dimmed color</p>
                  <Typography
                    variant="text-xs"
                    color="dimmed"
                    text="Additional metadata or footnotes"
                    text_ar="بيانات وصفية إضافية أو حواشي سفلية"
                  />
                </div>
                <div>
                  <p className={SS}>h3 with primary color</p>
                  <Typography
                    variant="h3"
                    color="primary"
                    text="Highlighted Section"
                    text_ar="قسم مميز"
                  />
                </div>
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-3.3 Breadcrumb ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-3.3 — Breadcrumb</h2>

            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Default Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>default (2 levels)</p>
                  <Breadcrumb
                    items={[
                      {
                        label: "Home",
                        label_ar: "الرئيسية",
                        onClick: () => alert("Home clicked"),
                      },
                      {
                        label: "Dashboard",
                        label_ar: "لوحة التحكم",
                        onClick: () => alert("Dashboard clicked"),
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>3 levels</p>
                  <Breadcrumb
                    items={[
                      {
                        label: "Home",
                        label_ar: "الرئيسية",
                        onClick: () => alert("Home clicked"),
                      },
                      {
                        label: "Products",
                        label_ar: "المنتجات",
                        onClick: () => alert("Products clicked"),
                      },
                      {
                        label: "Electronics",
                        label_ar: "الإلكترونيات",
                        onClick: () => alert("Electronics clicked"),
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>4 levels</p>
                  <Breadcrumb
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Categories", label_ar: "الفئات" },
                      { label: "Electronics", label_ar: "الإلكترونيات" },
                      { label: "Smartphones", label_ar: "الهواتف الذكية" },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>5 levels (deep navigation)</p>
                  <Breadcrumb
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Settings", label_ar: "الإعدادات" },
                      { label: "Account", label_ar: "الحساب" },
                      { label: "Profile", label_ar: "الملف الشخصي" },
                      { label: "Security", label_ar: "الأمان" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Selected Item Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>selected index = 0 (first item)</p>
                  <Breadcrumb
                    selectedItemIndex={0}
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Products", label_ar: "المنتجات" },
                      { label: "Details", label_ar: "التفاصيل" },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>selected index = 1 (middle item)</p>
                  <Breadcrumb
                    selectedItemIndex={1}
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Products", label_ar: "المنتجات" },
                      { label: "Details", label_ar: "التفاصيل" },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>selected index = 2 (last item - default)</p>
                  <Breadcrumb
                    selectedItemIndex={2}
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Products", label_ar: "المنتجات" },
                      { label: "Details", label_ar: "التفاصيل" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Hover Effects
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>
                    isSelectedHover = true (hover over last item)
                  </p>
                  <Breadcrumb
                    isSelectedHover={true}
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Products", label_ar: "المنتجات" },
                      {
                        label: "Details",
                        label_ar: "التفاصيل",
                        onClick: () => alert("Details clicked"),
                      },
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hover over "Details" to see link color
                  </p>
                </div>
                <div>
                  <p className={SS}>isSelectedHover = false (default)</p>
                  <Breadcrumb
                    isSelectedHover={false}
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Products", label_ar: "المنتجات" },
                      { label: "Details", label_ar: "التفاصيل" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Clickable Items
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>all items clickable</p>
                  <Breadcrumb
                    items={[
                      {
                        label: "Home",
                        onClick: () => alert("🏠 Home clicked"),
                      },
                      {
                        label: "Products",
                        onClick: () => alert("📦 Products clicked"),
                      },
                      {
                        label: "Details",
                        onClick: () => alert("🔍 Details clicked"),
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>some items clickable</p>
                  <Breadcrumb
                    items={[
                      { label: "Home", onClick: () => alert("Home clicked") },
                      { label: "Products" }, // no onClick
                      {
                        label: "Details",
                        onClick: () => alert("Details clicked"),
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>with isSelectedHover + clickable</p>
                  <Breadcrumb
                    isSelectedHover={true}
                    items={[
                      { label: "Home", onClick: () => alert("Home clicked") },
                      {
                        label: "Settings",
                        onClick: () => alert("Settings clicked"),
                      },
                      {
                        label: "Profile",
                        onClick: () => alert("Profile clicked"),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Arabic (RTL)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>Arabic - 3 levels</p>
                  <Breadcrumb
                    language="ar"
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Products", label_ar: "المنتجات" },
                      { label: "Details", label_ar: "التفاصيل" },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>Arabic - with clickable items</p>
                  <Breadcrumb
                    language="ar"
                    items={[
                      {
                        label: "Home",
                        label_ar: "الرئيسية",
                        onClick: () => alert("الرئيسية"),
                      },
                      {
                        label: "Account",
                        label_ar: "الحساب",
                        onClick: () => alert("الحساب"),
                      },
                      {
                        label: "Settings",
                        label_ar: "الإعدادات",
                        onClick: () => alert("الإعدادات"),
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>Arabic - with selected index</p>
                  <Breadcrumb
                    language="ar"
                    selectedItemIndex={1}
                    items={[
                      { label: "Home", label_ar: "الرئيسية" },
                      { label: "Products", label_ar: "المنتجات" },
                      { label: "Category", label_ar: "الفئة" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Mixed Examples
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>selected index + isSelectedHover</p>
                  <Breadcrumb
                    selectedItemIndex={1}
                    isSelectedHover={true}
                    items={[
                      { label: "Home", onClick: () => alert("Home") },
                      { label: "Products", onClick: () => alert("Products") },
                      {
                        label: "Electronics",
                        onClick: () => alert("Electronics"),
                      },
                      {
                        label: "Smartphones",
                        onClick: () => alert("Smartphones"),
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className={SS}>long labels</p>
                  <Breadcrumb
                    items={[
                      {
                        label: "Very Long Home Page Name",
                        label_ar: "اسم الصفحة الرئيسية الطويل جداً",
                      },
                      {
                        label: "Extended Category Name",
                        label_ar: "اسم الفئة الموسع",
                      },
                      {
                        label: "Detailed Product Description",
                        label_ar: "وصف المنتج المفصل",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-3.6 Prompt ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-3.6 — Prompt</h2>

            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Basic Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>default (English)</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Delete Item"
                      subtitle="Are you sure you want to delete this item? This action cannot be undone."
                      onYesClick={() => alert("✅ Yes clicked - Item deleted")}
                      onNoClick={() =>
                        alert("❌ No clicked - Action cancelled")
                      }
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>Arabic (RTL)</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      language="ar"
                      title="Delete Item"
                      title_ar="حذف العنصر"
                      subtitle="Are you sure you want to delete this item?"
                      subtitle_ar="هل أنت متأكد أنك تريد حذف هذا العنصر؟"
                      yesText="Yes"
                      yesText_ar="نعم"
                      noText="No"
                      noText_ar="لا"
                      onYesClick={() => alert("✅ نعم clicked")}
                      onNoClick={() => alert("❌ لا clicked")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Custom Button Text
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>confirm/cancel</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Save Changes"
                      subtitle="You have unsaved changes. Do you want to save them?"
                      yesText="Confirm"
                      noText="Cancel"
                      onYesClick={() => alert("✅ Changes saved")}
                      onNoClick={() => alert("❌ Changes discarded")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>continue/back</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Complete Registration"
                      subtitle="Please confirm your email address to continue."
                      yesText="Continue"
                      noText="Back"
                      onYesClick={() => alert("➡️ Continuing...")}
                      onNoClick={() => alert("⬅️ Going back")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>accept/decline</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Terms and Conditions"
                      subtitle="Do you accept the terms and conditions?"
                      yesText="Accept"
                      noText="Decline"
                      onYesClick={() => alert("✅ Terms accepted")}
                      onNoClick={() => alert("❌ Terms declined")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>proceed/cancel</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Payment Confirmation"
                      subtitle="Proceed with payment of $99.99?"
                      yesText="Proceed"
                      noText="Cancel"
                      onYesClick={() => alert("💰 Payment processing...")}
                      onNoClick={() => alert("🚫 Payment cancelled")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Arabic Variants (RTL)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>حذف الحساب (Delete Account)</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      language="ar"
                      title="Delete Account"
                      title_ar="حذف الحساب"
                      subtitle="Are you sure you want to delete your account?"
                      subtitle_ar="هل أنت متأكد أنك تريد حذف حسابك؟"
                      yesText="Yes"
                      yesText_ar="نعم"
                      noText="No"
                      noText_ar="لا"
                      onYesClick={() => alert("✅ Account deleted")}
                      onNoClick={() => alert("❌ Deletion cancelled")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>تسجيل الخروج (Logout)</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      language="ar"
                      title="Logout"
                      title_ar="تسجيل الخروج"
                      subtitle="Are you sure you want to logout?"
                      subtitle_ar="هل أنت متأكد أنك تريد تسجيل الخروج؟"
                      yesText="Logout"
                      yesText_ar="تسجيل الخروج"
                      noText="Stay"
                      noText_ar="البقاء"
                      onYesClick={() => alert("👋 Logging out...")}
                      onNoClick={() => alert("✅ Staying logged in")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>تأكيد الدفع (Payment Confirm)</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      language="ar"
                      title="Payment Confirmation"
                      title_ar="تأكيد الدفع"
                      subtitle="Confirm payment of 500 AED?"
                      subtitle_ar="تأكيد دفع 500 درهم؟"
                      yesText="Confirm"
                      yesText_ar="تأكيد"
                      noText="Cancel"
                      noText_ar="إلغاء"
                      onYesClick={() => alert("💰 Payment confirmed")}
                      onNoClick={() => alert("🚫 Payment cancelled")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Content Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>short title, long subtitle</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Warning!"
                      subtitle="This action will permanently delete all selected files and folders. This cannot be undone. Please make sure you have backups if needed."
                      yesText="Delete All"
                      noText="Cancel"
                      onYesClick={() => alert("⚠️ Deleting all files...")}
                      onNoClick={() => alert("✅ Deletion cancelled")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>long title, short subtitle</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="You are about to upgrade to the Premium Plan with Annual Billing"
                      subtitle="This will charge $199.99 today."
                      yesText="Upgrade Now"
                      noText="Not Now"
                      onYesClick={() => alert("⭐ Upgrading to Premium...")}
                      onNoClick={() => alert("⏸️ Upgrade postponed")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>very long both fields</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Important Security Update: Two-Factor Authentication Required for All Accounts"
                      subtitle="For your security, we now require all users to enable two-factor authentication. This process will take approximately 5 minutes to complete. You will need your mobile phone to scan a QR code."
                      yesText="Set Up Now"
                      noText="Remind Later"
                      onYesClick={() => alert("🔐 Setting up 2FA...")}
                      onNoClick={() => alert("⏰ Reminding later")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Common Use Cases
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>delete confirmation</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Delete User"
                      subtitle="Are you sure you want to delete user 'john@example.com'? All associated data will be lost."
                      onYesClick={() => alert("🗑️ User deleted")}
                      onNoClick={() => alert("✅ Deletion cancelled")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>discard changes</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Discard Changes"
                      subtitle="You have unsaved changes. Do you want to discard them?"
                      yesText="Discard"
                      noText="Keep Editing"
                      onYesClick={() => alert("🚫 Changes discarded")}
                      onNoClick={() => alert("✏️ Continuing to edit")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>logout confirmation</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Sign Out"
                      subtitle="Are you sure you want to sign out of your account?"
                      yesText="Sign Out"
                      noText="Stay Signed In"
                      onYesClick={() => alert("👋 Signed out")}
                      onNoClick={() => alert("✅ Staying signed in")}
                    />
                  </div>
                </div>
                <div>
                  <p className={SS}>leave page</p>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <Prompt
                      title="Leave Page?"
                      subtitle="You have unsaved changes. If you leave now, your changes will be lost."
                      yesText="Leave Anyway"
                      noText="Stay on Page"
                      onYesClick={() => alert("🚪 Leaving page...")}
                      onNoClick={() => alert("✅ Staying on page")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                In Context (no border)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>as it would appear in modal</p>
                  <Prompt
                    title="Confirm Action"
                    subtitle="Please confirm you want to proceed with this action."
                    onYesClick={() => alert("✅ Confirmed")}
                    onNoClick={() => alert("❌ Cancelled")}
                  />
                </div>
                <div>
                  <p className={SS}>Arabic in context</p>
                  <Prompt
                    language="ar"
                    title="تأكيد"
                    title_ar="تأكيد"
                    subtitle="يرجى تأكيد الإجراء"
                    subtitle_ar="يرجى تأكيد الإجراء"
                    yesText_ar="تأكيد"
                    noText_ar="إلغاء"
                    onYesClick={() => alert("✅ تم التأكيد")}
                    onNoClick={() => alert("❌ تم الإلغاء")}
                  />
                </div>
              </div>
            </div>
          </section> */}

          {/* ══════════════════════════ G-3.7 ScreenLoader ══════════════════════════ */}
          {/* <section className="flex flex-col gap-2">
            <h2 className={ST}>G-3.7 — ScreenLoader</h2>

            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Basic Variants
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={SS}>loading state (default GIF)</p>
                  <div className="relative border border-gray-200 rounded-lg p-4 bg-white h-[200px] overflow-hidden">
                    <ScreenLoader isLoading={false} />
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          <div className="border-t border-gray-300 my-4" />
          <h1 className="text-bold-l text-text-default">
            Group 4 — Recommended placement
          </h1>
        </div>
        {/* ══════════════════════════ G-4.1 Title Bar ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.1 — Title Bar</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Default Variants
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className={SS}>default title</p>
                <TitleBar title="Dashboard Overview" />
              </div>

              <div>
                <p className={SS}>title with acronym</p>
                <TitleBar title="User Management" acronym="USR" />
              </div>

              <div>
                <p className={SS}>title without acronym</p>
                <TitleBar title="Project Settings" showAcronym={false} />
              </div>

              <div>
                <p className={SS}>acronym only</p>
                <TitleBar acronym="CRM" showTitle={false} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Button Variants
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className={SS}>primary button</p>
                <TitleBar
                  title="Projects"
                  showButton
                  buttonLabel="Create Project"
                  buttonType="primary"
                  onClick={() => alert("Create Project")}
                />
              </div>

              <div>
                <p className={SS}>secondary button</p>
                <TitleBar
                  title="Projects"
                  showButton
                  buttonLabel="View Reports"
                  buttonType="secondary"
                />
              </div>

              <div>
                <p className={SS}>tertiary button</p>
                <TitleBar
                  title="Projects"
                  showButton
                  buttonLabel="Export Data"
                  buttonType="tertiary"
                />
              </div>

              <div>
                <p className={SS}>delete button</p>
                <TitleBar
                  title="User Profile"
                  showButton
                  buttonLabel="Delete Account"
                  buttonType="delete"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Arabic (RTL)
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className={SS}>arabic title</p>
                <TitleBar
                  language="ar"
                  title="Dashboard"
                  title_ar="لوحة التحكم"
                />
              </div>

              <div>
                <p className={SS}>arabic with button</p>
                <TitleBar
                  language="ar"
                  title="Users"
                  title_ar="المستخدمون"
                  showButton
                  buttonLabel="Add User"
                  buttonLabel_ar="إضافة مستخدم"
                />
              </div>

              <div>
                <p className={SS}>arabic with acronym</p>
                <TitleBar
                  language="ar"
                  title="إدارة المشاريع"
                  title_ar="إدارة المشاريع"
                  acronym="PRJ"
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* ══════════════════════════ G-4.2 OwnerSearch ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.2 — OwnerSearch</h2>
          <OwnerSearch
            title="Search Owner"
            title_ar="البحث عن المالك"
            subtitle="Find owners by company or individual owner"
            subtitle_ar="ابحث عن المالك حسب الشركة أو المالك الفردي"
            initialOwnerType="company"
            // selected={mockSelected}
            language="en"
            // onSubmit={handleSubmit}
          />
        </section> */}

        {/* ══════════════════════════ G-4.3 Filter Bar ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.3 — Filter Bar</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Default Variants
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>default filter bar</p>
                <FilterBar
                  searchColumns={["Name", "Email", "Role"]}
                  filterOptions={["Active", "Inactive", "Pending"]}
                />
              </div>

              <div>
                <p className={SS}>with search value</p>
                <FilterBar
                  searchValue="John"
                  searchColumns={["Name", "Email"]}
                  filterOptions={["Active", "Inactive"]}
                />
              </div>

              <div>
                <p className={SS}>with selected search column</p>
                <FilterBar
                  searchColumns={["Name", "Email", "Department"]}
                  selectedSearchColumns={["Email"]}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Arabic (RTL)
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>arabic filter bar</p>
                <FilterBar
                  language="ar"
                  searchColumns={["الاسم", "البريد الإلكتروني"]}
                  filterOptions={["نشط", "غير نشط"]}
                />
              </div>

              <div>
                <p className={SS}>arabic with active filters</p>
                <FilterBar
                  language="ar"
                  filterButtonCount={2}
                  searchColumns={["الاسم", "البريد"]}
                  filterOptions={["نشط", "غير نشط"]}
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* ══════════════════════════ G-4.4 Payment ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.4 — Payment</h2>
          <Payment
            language="en"
            applicationId="ptmVwwNZMaaKc0HwhTMMHWc3HeZiJXZm"
          />
        </section> */}

        {/* ══════════════════════════ G-4.6 Signature Component ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.6 — Signature</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Default Variants
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>with custom title & button</p>
                <Signature
                  title="Sign Here"
                  title_ar="وقع هنا"
                  buttonText="Confirm"
                  buttonText_ar="تأكيد"
                />
              </div>

              <div>
                <p className={SS}>with approve disabled initially</p>
                <Signature buttonText="Approve" buttonText_ar="موافق" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Arabic (RTL)
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>RTL with custom title & button</p>
                <Signature
                  language="ar"
                  title="توقيع هنا"
                  title_ar="توقيع هنا"
                  buttonText="تأكيد"
                  buttonText_ar="تأكيد"
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* ══════════════════════════ G-4.7 Upload Documents ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.7 — Upload Documents</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Default Variants
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>single document upload</p>
                <UploadDocuments
                  documents={[
                    {
                      documentName: "Passport",
                      documentName_ar: "جواز السفر",
                      allowedTypes: ["pdf", "jpg", "png"],
                      fileTypeErrorMessage: "Invalid file type",
                      fileTypeErrorMessage_ar: "نوع الملف غير صالح",
                      fileSize: 5 * 1024 * 1024,
                      fileSizeErrorMessage: "File too large",
                      fileSizeErrorMessage_ar: "الملف كبير جدًا",
                    },
                  ]}
                />
              </div>

              <div>
                <p className={SS}>multiple documents upload</p>
                <UploadDocuments
                  documents={[
                    {
                      documentName: "Passport",
                      documentName_ar: "جواز السفر",
                      allowedTypes: ["pdf", "jpg"],
                    },
                    {
                      documentName: "Driver License",
                      documentName_ar: "رخصة القيادة",
                      allowedTypes: ["pdf", "jpg"],
                    },
                    {
                      documentName: "Profile Picture",
                      documentName_ar: "صورة الملف الشخصي",
                      allowedTypes: ["png", "jpg"],
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Arabic (RTL)
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>single document RTL</p>
                <UploadDocuments
                  language="ar"
                  documents={[
                    {
                      documentName: "Passport",
                      documentName_ar: "جواز السفر",
                      allowedTypes: ["pdf", "jpg"],
                    },
                  ]}
                />
              </div>

              <div>
                <p className={SS}>multiple documents RTL</p>
                <UploadDocuments
                  language="ar"
                  documents={[
                    { documentName: "Passport", documentName_ar: "جواز السفر" },
                    {
                      documentName: "License",
                      documentName_ar: "رخصة القيادة",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* ══════════════════════════ G-4.8 View Plot Detail ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.8 — View Plot Detail</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Default Variants
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>single plot with owner details</p>
                <ViewPlotDetail
                  plotIds={["12345"]}
                  plotTitle="Plot Details"
                  plotTitle_ar="تفاصيل القطعة"
                  showOwnerDetails={true}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Owner Section Variants
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>owner details visible</p>
                <ViewPlotDetail
                  plotIds={["12345"]}
                  showOwnerDetails={true}
                  ownerText="Owner"
                  ownerText_ar="المالك"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Arabic (RTL)
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>RTL plot detail</p>
                <ViewPlotDetail
                  language="ar"
                  plotIds={["12345"]}
                  plotTitle="تفاصيل القطعة"
                  plotTitle_ar="تفاصيل القطعة"
                />
              </div>

              <div>
                <p className={SS}>RTL with owner section</p>
                <ViewPlotDetail
                  language="ar"
                  plotIds={["12345"]}
                  ownerText="المالك"
                  ownerText_ar="المالك"
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* ══════════════════════════ G-4.10 Payment Detail ══════════════════════════ */}
        <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.10 — Pyament Detail</h2>
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
        </section>

        {/* ══════════════════════════ G-4.11 Application Summary ══════════════════════════ */}
        <section className="flex flex-col gap-2">
          <h2 className={ST}>G-4.11 — Application Summary</h2>
          <ApplicationSummary data={normalizedData} />
        </section>

        {/* <div className="border-t border-gray-300 my-4" />
        <h1 className="text-bold-l text-text-default">
          Group 5 — Shared Components
        </h1> */}

        {/* ══════════════════════════ G-5.1 Application Table ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-5.1 — Application Table</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Static Data Example
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>application table with workflow cards</p>

                <Table
                  language="en"
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
                          type: "success",
                          version: "multi-row",
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
              </div>
            </div>
          </div>
        </section> */}

        {/* ══════════════════════════ G-5.2 Owner Card ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-5.2 — Owner Card</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Default Variant
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>single owner card</p>

                <OwnerCard
                  title="Owner Information"
                  title_ar="معلومات المالك"
                  owners={[
                    {
                      ownerId: "1",
                      ownerArgs: "owner-1",
                      name: "Ahmed Ali",
                      name_ar: "أحمد علي",
                      fields: [
                        {
                          label: "Nationality",
                          label_ar: "الجنسية",
                          value: "UAE",
                          value_ar: "الإمارات",
                        },
                        {
                          label: "ID Number",
                          label_ar: "رقم الهوية",
                          value: "784-1995-1234567-1",
                        },
                        { label: "Share", label_ar: "الحصة", value: "50%" },
                        {
                          label: "Archive Number",
                          label_ar: "رقم الأرشيف",
                          value: "ARC-001",
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Multiple Owners
            </h3>

            <OwnerCard
              itemsPerRow="2"
              title="Owner Information"
              title_ar="معلومات المالك"
              owners={[
                {
                  ownerId: "1",
                  ownerArgs: "owner-1",
                  name: "Ahmed Ali",
                  name_ar: "أحمد علي",
                  fields: [
                    { label: "Nationality", label_ar: "الجنسية", value: "UAE" },
                    { label: "Share", label_ar: "الحصة", value: "50%" },
                    {
                      label: "Archive Number",
                      label_ar: "رقم الأرشيف",
                      value: "ARC-001",
                    },
                  ],
                },
                {
                  ownerId: "2",
                  ownerArgs: "owner-2",
                  name: "Sara Khan",
                  name_ar: "سارة خان",
                  fields: [
                    {
                      label: "Nationality",
                      label_ar: "الجنسية",
                      value: "Pakistan",
                    },
                    { label: "Share", label_ar: "الحصة", value: "30%" },
                    {
                      label: "Archive Number",
                      label_ar: "رقم الأرشيف",
                      value: "ARC-002",
                    },
                  ],
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Action Buttons
            </h3>

            <OwnerCard
              title="Owner Information"
              owners={[
                {
                  ownerId: "1",
                  ownerArgs: "owner-1",
                  name: "Mohammed Hassan",
                  fields: [
                    { label: "Nationality", value: "UAE" },
                    { label: "Share", value: "60%" },
                    { label: "Archive Number", value: "ARC-003" },
                  ],
                },
              ]}
              showViewButton
              showPlotsButton
              showEditButton
              showDeleteButton
              onPressAction={({ action, owner }) =>
                alert(`${action} clicked for ${owner.name}`)
              }
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Expandable Card
            </h3>

            <OwnerCard
              title="Owner Information"
              isExpandable
              defaultShowMore={false}
              owners={[
                {
                  ownerId: "1",
                  ownerArgs: "owner-expand",
                  name: "Fatima Noor",
                  fields: [
                    { label: "Nationality", value: "UAE" },
                    { label: "Share", value: "45%" },
                    { label: "Archive Number", value: "ARC-004" },
                    { label: "MOI Unified Number", value: "123456789" },
                    { label: "Special Nationality", value: "No" },
                  ],
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Arabic (RTL)
            </h3>

            <OwnerCard
              language="ar"
              title="معلومات المالك"
              title_ar="معلومات المالك"
              owners={[
                {
                  ownerId: "1",
                  ownerArgs: "owner-ar",
                  name: "طلال أحمد",
                  name_ar: "طلال أحمد",
                  fields: [
                    {
                      label: "الجنسية",
                      label_ar: "الجنسية",
                      value: "الإمارات",
                    },
                    { label: "الحصة", label_ar: "الحصة", value: "50%" },
                    {
                      label: "رقم الأرشيف",
                      label_ar: "رقم الأرشيف",
                      value: "ARC-005",
                    },
                  ],
                },
              ]}
            />
          </div>
        </section> */}

        {/* ══════════════════════════ G-5.3 Plot Card ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-3.3 — Plot Card</h2>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Default Variant
            </h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <p className={SS}>single plot card</p>

                <PlotCard
                  title="Plot Information"
                  title_ar="معلومات القطعة"
                  plots={[
                    {
                      plotId: "1",
                      plotArgs: "plot-1",
                      plotNumber: "P-1024",
                      plotNumber_ar: "P-1024",
                      fields: [
                        {
                          label: "Zone",
                          label_ar: "المنطقة",
                          value: "Dubai Marina",
                          value_ar: "مرسى دبي",
                        },
                        {
                          label: "Municipality",
                          label_ar: "البلدية",
                          value: "Dubai Municipality",
                          value_ar: "بلدية دبي",
                        },
                        {
                          label: "Area",
                          label_ar: "المساحة",
                          value: "4500 sq.ft",
                          value_ar: "4500 قدم مربع",
                        },
                        {
                          label: "Land Use",
                          label_ar: "استخدام الأرض",
                          value: "Residential",
                          value_ar: "سكني",
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Multiple Plots
            </h3>

            <PlotCard
              title="Plot Information"
              plots={[
                {
                  plotId: "1",
                  plotArgs: "plot-1",
                  plotNumber: "P-1024",
                  fields: [
                    { label: "Zone", value: "Dubai Marina" },
                    { label: "Area", value: "4500 sq.ft" },
                    { label: "Land Use", value: "Residential" },
                  ],
                },
                {
                  plotId: "2",
                  plotArgs: "plot-2",
                  plotNumber: "P-2048",
                  fields: [
                    { label: "Zone", value: "Palm Jumeirah" },
                    { label: "Area", value: "5200 sq.ft" },
                    { label: "Land Use", value: "Commercial" },
                  ],
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Button Variants
            </h3>

            <PlotCard
              title="Plot Information"
              showViewButton
              showChangePlotButton
              showOwnersButton
              plots={[
                {
                  plotId: "1",
                  plotArgs: "plot-action",
                  plotNumber: "P-3001",
                  fields: [
                    { label: "Zone", value: "Business Bay" },
                    { label: "Area", value: "3800 sq.ft" },
                    { label: "Land Use", value: "Mixed Use" },
                  ],
                },
              ]}
              onPressView={(plot) => alert(`View ${plot.plotNumber}`)}
              onPressPlotChange={(plot) =>
                alert(`Change Plot ${plot.plotNumber}`)
              }
              onPressOwners={(plot) => alert(`Owners of ${plot.plotNumber}`)}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Expandable Cards
            </h3>

            <PlotCard
              title="Plot Details"
              defaultExpanded={false}
              defaultShowMore={false}
              plots={[
                {
                  plotId: "1",
                  plotArgs: "plot-expand",
                  plotNumber: "P-7777",
                  fields: [
                    { label: "Zone", value: "Downtown Dubai" },
                    { label: "Municipality", value: "Dubai Municipality" },
                    { label: "Area", value: "6000 sq.ft" },
                    { label: "Land Use", value: "Residential" },
                    {
                      label: "Construction Status",
                      value: "Under Construction",
                    },
                  ],
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Arabic (RTL)
            </h3>

            <PlotCard
              language="ar"
              title="معلومات القطعة"
              title_ar="معلومات القطعة"
              plots={[
                {
                  plotId: "1",
                  plotArgs: "plot-ar",
                  plotNumber: "P-9000",
                  plotNumber_ar: "P-9000",
                  fields: [
                    {
                      label: "المنطقة",
                      label_ar: "المنطقة",
                      value: "مرسى دبي",
                      value_ar: "مرسى دبي",
                    },
                    {
                      label: "المساحة",
                      label_ar: "المساحة",
                      value: "4500 قدم مربع",
                      value_ar: "4500 قدم مربع",
                    },
                    {
                      label: "استخدام الأرض",
                      label_ar: "استخدام الأرض",
                      value: "سكني",
                      value_ar: "سكني",
                    },
                  ],
                },
              ]}
            />
          </div>
        </section> */}

        {/* ══════════════════════════ G-5.4 Modal Title ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-5.4 — Modal Title</h2>
          <ModalTitle label="Title" />
          <ModalTitle label_ar="العنوان" language="ar" />
        </section> */}

        {/* ══════════════════════════ G-5.5 Modal Steps ══════════════════════════ */}
        {/* <section className="flex flex-col gap-2">
          <h2 className={ST}>G-5.5 — Modal Steps</h2>
          <ModalSteps title="Title" subText="Step 1 of 2" />
          <ModalSteps
            title_ar="العنوان"
            subText_ar="الخطوة 1 من 2"
            language="ar"
          />
        </section> */}

        {/* ══════════════════════════ G-5.6 Generic Card ══════════════════════════ */}
        {/* <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">G-5.6 — Generic Card</h2>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Default Variant
            </h3>

            <GenericCard
              title="Owner Details"
              title_ar="تفاصيل المالك"
              cardTitleLabel="Name"
              cardTitleLabel_ar="الاسم"
              cardTitleValue="Ahmed Khalid"
              cardTitleValue_ar="أحمد خالد"
              rowsData={[
                { label: "Nationality", value: "UAE" },
                { label: "Share", value: "50%" },
                { label: "ID Number", value: "784-1988-1234567-1" },
                { label: "Archive Number", value: "AR-2211" },
              ]}
              showMoreButton
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Expandable Card
            </h3>

            <GenericCard
              title="Plot Information"
              cardTitleLabel="Plot Number"
              cardTitleValue="P-1024"
              rowsData={[
                { label: "Zone", value: "Dubai Marina" },
                { label: "Area", value: "4500 sq.ft" },
                { label: "Land Use", value: "Residential" },
                { label: "Municipality", value: "Dubai Municipality" },
              ]}
              isExpandable
              defaultShowMore={false}
              showMoreButton
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Card With Action Buttons
            </h3>

            <GenericCard
              title="Owner Information"
              cardTitleLabel="Owner"
              cardTitleValue="Mohammed Ali"
              showButtons
              buttons={[
                {
                  title: "View",
                  onClick: () => alert("View clicked"),
                },
                {
                  title: "Edit",
                  onClick: () => alert("Edit clicked"),
                },
              ]}
              rowsData={[
                { label: "Nationality", value: "UAE" },
                { label: "Share", value: "100%" },
                { label: "ID Number", value: "784-1990-9999999-1" },
              ]}
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Card With Documents
            </h3>

            <GenericCard
              title="Application Documents"
              cardTitleLabel="Application"
              cardTitleValue="APP-1123"
              rowsData={[
                { label: "Application Type", value: "Plot Registration" },
                { label: "Status", value: "Pending" },
              ]}
              hasDocuments
              documents={[
                {
                  id: "1",
                  documentName: "Passport Copy",
                  isUploaded: true,
                  onDownloadClick: () => alert("Download Passport"),
                },
                {
                  id: "2",
                  documentName: "UAE ID",
                  isUploaded: true,
                  onDownloadClick: () => alert("Download ID"),
                },
                {
                  id: "3",
                  documentName: "Ownership Certificate",
                  isUploaded: false,
                },
              ]}
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Footer Buttons
            </h3>

            <GenericCard
              title="Plot Approval"
              cardTitleLabel="Plot"
              cardTitleValue="P-9999"
              rowsData={[
                { label: "Zone", value: "Business Bay" },
                { label: "Area", value: "5200 sq.ft" },
              ]}
              showFooterButtons
              footerButton={[
                {
                  title: "Approve",
                  type: "primary",
                  onClick: () => alert("Approved"),
                },
                {
                  title: "Reject",
                  type: "delete",
                  onClick: () => alert("Rejected"),
                },
              ]}
            />
          </div>

          <div dir="rtl">
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Arabic (RTL)
            </h3>

            <GenericCard
              language="ar"
              title="تفاصيل المالك"
              cardTitleLabel="الاسم"
              cardTitleValue="محمد علي"
              rowsData={[
                { label: "الجنسية", value: "الإمارات" },
                { label: "الحصة", value: "50%" },
                { label: "رقم الهوية", value: "784-1988-1234567-1" },
              ]}
              showMoreButton
            />
          </div>
        </section> */}

        {/* ══════════════════════════ G-5.7 Generic Cards Grid ══════════════════════════ */}
        {/* <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">G-5.7 — Generic Cards</h2>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Single Column
            </h3>

            <GenericCards
              title="Owner Information"
              cardsData={[
                {
                  id: "1",
                  cardTitleLabel: "Owner",
                  cardTitleValue: "Ahmed Khalid",
                  rowsData: [
                    { label: "Nationality", value: "UAE" },
                    { label: "Share", value: "50%" },
                    { label: "ID Number", value: "784-1988-1234567-1" },
                    { label: "Archive Number", value: "AR-001" },
                  ],
                },
                {
                  id: "2",
                  cardTitleLabel: "Owner",
                  cardTitleValue: "Mohammed Ali",
                  rowsData: [
                    { label: "Nationality", value: "UAE" },
                    { label: "Share", value: "50%" },
                    { label: "ID Number", value: "784-1990-9876543-1" },
                  ],
                },
              ]}
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Two Cards Per Row
            </h3>

            <GenericCards
              title="Plot Information"
              itemsPerRow="2"
              cardsData={[
                {
                  id: "1",
                  cardTitleLabel: "Plot Number",
                  cardTitleValue: "P-1001",
                  rowsData: [
                    { label: "Zone", value: "Dubai Marina" },
                    { label: "Area", value: "4200 sq.ft" },
                    { label: "Land Use", value: "Residential" },
                  ],
                },
                {
                  id: "2",
                  cardTitleLabel: "Plot Number",
                  cardTitleValue: "P-1002",
                  rowsData: [
                    { label: "Zone", value: "Palm Jumeirah" },
                    { label: "Area", value: "5100 sq.ft" },
                    { label: "Land Use", value: "Commercial" },
                  ],
                },
              ]}
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Three Cards Per Row
            </h3>

            <GenericCards
              title="Application Records"
              itemsPerRow="3"
              cardsData={[
                {
                  id: "1",
                  cardTitleLabel: "Application ID",
                  cardTitleValue: "APP-001",
                  rowsData: [
                    { label: "Type", value: "Plot Allocation" },
                    { label: "Status", value: "Pending" },
                    { label: "Submitted", value: "10 Jan 2025" },
                  ],
                },
                {
                  id: "2",
                  cardTitleLabel: "Application ID",
                  cardTitleValue: "APP-002",
                  rowsData: [
                    { label: "Type", value: "Ownership Transfer" },
                    { label: "Status", value: "Approved" },
                    { label: "Submitted", value: "14 Jan 2025" },
                  ],
                },
                {
                  id: "3",
                  cardTitleLabel: "Application ID",
                  cardTitleValue: "APP-003",
                  rowsData: [
                    { label: "Type", value: "Plot Merge" },
                    { label: "Status", value: "In Progress" },
                    { label: "Submitted", value: "20 Jan 2025" },
                  ],
                },
              ]}
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Cards With Actions
            </h3>

            <GenericCards
              title="Owners"
              itemsPerRow="2"
              showButtons
              buttons={[
                {
                  title: "View",
                  onClick: (card) => alert(`Viewing ${card.cardTitleValue}`),
                },
                {
                  title: "Edit",
                  onClick: (card) => alert(`Editing ${card.cardTitleValue}`),
                },
              ]}
              cardsData={[
                {
                  id: "1",
                  cardTitleLabel: "Owner",
                  cardTitleValue: "Ahmed Khalid",
                  rowsData: [
                    { label: "Nationality", value: "UAE" },
                    { label: "Share", value: "50%" },
                    { label: "ID Number", value: "784-1234567-1" },
                  ],
                },
                {
                  id: "2",
                  cardTitleLabel: "Owner",
                  cardTitleValue: "Sara Ahmed",
                  rowsData: [
                    { label: "Nationality", value: "UAE" },
                    { label: "Share", value: "50%" },
                    { label: "ID Number", value: "784-9876543-1" },
                  ],
                },
              ]}
            />
          </div>

          <div dir="rtl">
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Arabic (RTL)
            </h3>

            <GenericCards
              language="ar"
              title="معلومات المالك"
              itemsPerRow="2"
              cardsData={[
                {
                  id: "1",
                  cardTitleLabel: "الاسم",
                  cardTitleValue: "محمد علي",
                  rowsData: [
                    { label: "الجنسية", value: "الإمارات" },
                    { label: "الحصة", value: "50%" },
                    { label: "رقم الهوية", value: "784-1234567-1" },
                  ],
                },
                {
                  id: "2",
                  cardTitleLabel: "الاسم",
                  cardTitleValue: "أحمد خالد",
                  rowsData: [
                    { label: "الجنسية", value: "الإمارات" },
                    { label: "الحصة", value: "50%" },
                    { label: "رقم الهوية", value: "784-7654321-1" },
                  ],
                },
              ]}
            />
          </div>
        </section> */}

        {/* ══════════════════════════ G-5.8 Generic Table Card ══════════════════════════ */}
        {/* <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">G-5.8 — Generic Table Card</h2>

          <div>
            <h3 className="text-md font-semibold mb-3 text-gray-700">
              Default Table
            </h3>

            <GenericTableCard
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
                  onClick: () => alert("Edit button clicked"),
                },
                {
                  title: "Delete",
                  title_ar: "حذف",
                  onClick: () => alert("Delete button clicked"),
                },
              ]}
              showButtons={true}
              buttons={[
                {
                  title: "Edit",
                  title_ar: "تعديل",
                  onClick: () => alert("Edit button clicked"),
                },
                {
                  title: "Delete",
                  title_ar: "حذف",
                  onClick: () => alert("Delete button clicked"),
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
                  onClick: () => alert("Edit button clicked"),
                },
                {
                  title: "Delete",
                  title_ar: "حذف",
                  onClick: () => alert("Delete button clicked"),
                },
              ]}
              showPagination={true}
              currentPage={1}
              totalPages={10}
              pageSize={5}
              onPageChange={(page) => console.log(page)}
            />
          </div>
        </section> */}

        {/* ══════════════════════════ G-5.9 Card Title ══════════════════════════ */}
        {/* <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">G-5.9 — Card Title</h2>
          <CardTitle
            title="Project Details"
            title_ar="تفاصيل المشروع"
            description="This is a description for the project card"
            subText="Updated 2 days ago"
            status="Pending"
            buttons={[
              {
                title: "Edit",
                type: "primary",
                onClick: () => alert("Edit clicked"),
              },
              {
                title: "Delete",
                type: "delete",
                onClick: () => alert("Delete clicked"),
              },
            ]}
            isExpandable
            isExpanded={true}
            variant="medium"
            language="en"
            showButtons
            showBorder
          />
          <CardTitle
            title="طلبات المشروع"
            title_ar="طلبات المشروع"
            description="وصف مختصر عن المشروع"
            subText="آخر تحديث منذ يومين"
            status="قيد الانتظار"
            buttons={[
              {
                title: "Edit",
                type: "primary",
                onClick: () => alert("Edit clicked"),
              },
              {
                title: "Delete",
                type: "delete",
                onClick: () => alert("Delete clicked"),
              },
            ]}
            isExpandable
            isExpanded={true}
            variant="medium"
            language="ar"
            showButtons
            showBorder
          />
        </section> */}

        {/* ══════════════════════════ G-5.10 ViewOwnerDetail ══════════════════════════ */}
        {/* <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">G-5.10 — ViewOwnerDetail</h2>

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
                { label: "البريد الإلكتروني", value: "ahmed.khalid@email.com" },
              ],
            }}
          />
        </section> */}

        {/* ══════════════════════════ G-5.12 ApplicationMessage ══════════════════════════ */}
        {/* <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">G-5.12 — ApplicationMessage</h2>
          <ApplicationMessage
            status="success"
            title="Application Submitted"
            description="Your application has been submitted successfully."
          />{" "}
          <ApplicationMessage
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
            status="action"
            title="Continue Application"
            description="Click the button below to proceed."
            type="button"
            label="Continue"
            onClick={() => alert("Continue clicked")}
          />{" "}
          <ApplicationMessage
            language="ar"
            status="success"
            title="تم إرسال الطلب"
            description="تم إرسال طلبك بنجاح."
            type="button"
            label="متابعة"
            label_ar="متابعة"
            onClick={() => alert("متابعة")}
          />
        </section> */}

        {/* ══════════════════════════ G-5.14 SearchPlot ══════════════════════════ */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">G-5.14 — SearchPlot</h2>
          <SearchPlot
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
        </section>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
