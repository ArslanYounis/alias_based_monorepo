import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/ui/Layout";
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
  "none", "top-left", "top-center", "top-right",
  "bottom-left", "bottom-center", "bottom-right",
  "left-top", "left-center", "left-bottom",
  "right-top", "right-center", "right-bottom",
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

  const layoutMenuItems = [
    { label: "Profile", label_ar: "الملف الشخصي", onClick: () => {} },
    { label: "Logout", label_ar: "تسجيل الخروج", onClick: () => {} },
  ];
  const layoutBreadcrumbItems = [
    { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
    { label: "G-0 & G-2 Components", label_ar: "مكونات G-0 و G-2", onClick: () => {} },
  ];

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Layout
        language={language}
        theme="light"
        onToggleLanguage={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
        isEditing={false}
        menuItems={layoutMenuItems}
        breadcrumbItems={layoutBreadcrumbItems}
        showHeader
        showSidebar
        showFooter
        toast={{ message: "", status: "success" }}
      >
        <div className="p-6 flex flex-col gap-10 max-w-5xl">

          {/* ══════════════════════════ G-0.1 Label ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.1 — Label</h2>
            <p className={SS}>default</p>
            <Label language={language} label="Field Label" label_ar="تسمية الحقل" />

            <p className={SS}>required=true</p>
            <Label language={language} label="Required Field" label_ar="حقل مطلوب" required />

            <p className={SS}>showInfoIcon=true</p>
            <Label language={language} label="Info Field" label_ar="حقل معلومات" showInfoIcon tooltipText="Additional info" tooltipText_ar="معلومات إضافية" />

            <p className={SS}>required=true + showInfoIcon=true</p>
            <Label language={language} label="Required + Info" label_ar="مطلوب + معلومات" required showInfoIcon tooltipText="This field is required" tooltipText_ar="هذا الحقل مطلوب" />

            <p className={SS}>disabled=true</p>
            <Label language={language} label="Disabled Label" label_ar="تسمية معطلة" disabled />

            <p className={SS}>disabled=true + showInfoIcon=true</p>
            <Label language={language} label="Disabled + Info" label_ar="معطل + معلومات" disabled showInfoIcon tooltipText="Disabled tooltip" tooltipText_ar="تلميح معطل" />

            <p className={SS}>language="ar" forced, required + showInfoIcon</p>
            <Label language="ar" label="Field" label_ar="الحقل" required showInfoIcon tooltipText="Arabic tooltip" tooltipText_ar="تلميح عربي" />
          </section>

          {/* ══════════════════════════ G-0.2 Caption ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.2 — Caption</h2>
            <p className={SS}>default (both captions)</p>
            <Caption language={language} captionLeft="Left caption" captionLeft_ar="التسمية اليسرى" captionRight="Right caption" captionRight_ar="التسمية اليمنى" />

            <p className={SS}>captionLeft only</p>
            <Caption language={language} captionLeft="Left only" captionLeft_ar="اليسار فقط" />

            <p className={SS}>captionRight only</p>
            <Caption language={language} captionRight="Right only" captionRight_ar="اليمين فقط" />

            <p className={SS}>hasError=true + errorMessage</p>
            <Caption language={language} captionLeft="Left" captionLeft_ar="اليسار" hasError errorMessage="This field is required" errorMessage_ar="هذا الحقل مطلوب" />

            <p className={SS}>disabled=true</p>
            <Caption language={language} captionLeft="Disabled left" captionLeft_ar="معطل يسار" captionRight="Disabled right" captionRight_ar="معطل يمين" disabled />

            <p className={SS}>language="ar" forced</p>
            <Caption language="ar" captionLeft="Left" captionLeft_ar="يسار" captionRight="Right" captionRight_ar="يمين" />
          </section>

          {/* ══════════════════════════ G-0.3 Tooltip ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.3 — Tooltip (all directions)</h2>
            <div className="flex flex-wrap gap-10 mt-6 mb-6">
              {TOOLTIP_DIRS.map((dir) => (
                <div key={dir} className="flex flex-col items-center gap-1">
                  <p className="text-xs text-text-dimmed">{dir}</p>
                  <div className="relative mt-4 mb-4">
                    <Tooltip language={language} text="Tooltip" text_ar="تلميح" direction={dir} />
                  </div>
                </div>
              ))}
            </div>
            <p className={SS}>language="ar" forced, direction="top-right"</p>
            <div className="relative mt-4 mb-4 w-fit">
              <Tooltip language="ar" text="Tooltip" text_ar="تلميح نصي" direction="top-right" />
            </div>
          </section>

          {/* ══════════════════════════ G-0.4 Checkbox ══════════════════════════ */}
          <section className="flex flex-col gap-2">
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
                <Checkbox id="cb-int" checked={cbInteractive} onChange={(_id, v) => setCbInteractive(v)} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <Checkbox id="cb-dis-un" checked={false} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <Checkbox id="cb-dis-ch" checked={true} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <Checkbox id="cb-err" checked={false} hasError onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-0.5 Radio ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.5 — Radio</h2>
            <div className="flex flex-wrap gap-8 mt-2">
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">unchecked</p>
                <Radio id="r-un" name="r-static" checked={false} onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">checked</p>
                <Radio id="r-ch" name="r-static2" checked={true} onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">interactive group</p>
                <div className="flex gap-3">
                  {["a", "b", "c"].map((v) => (
                    <Radio key={v} id={`r-grp-${v}`} name="r-group" checked={radioGroup === v} onChange={() => setRadioGroup(v)} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <Radio id="r-dis-un" name="r-dis" checked={false} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <Radio id="r-dis-ch" name="r-dis2" checked={true} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <Radio id="r-err" name="r-err" checked={false} hasError onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-0.6 CheckRadioLabel ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.6 — CheckRadioLabel</h2>
            <p className={SS}>default</p>
            <CheckRadioLabel language={language} label="Option Label" label_ar="تسمية الخيار" />

            <p className={SS}>disabled</p>
            <CheckRadioLabel language={language} label="Disabled Label" label_ar="تسمية معطلة" disabled />

            <p className={SS}>language="ar" forced</p>
            <CheckRadioLabel language="ar" label="Label" label_ar="التسمية" />
          </section>

          {/* ══════════════════════════ G-0.7 AddButton ══════════════════════════ */}
          <section className="flex flex-col gap-2">
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
          </section>

          {/* ══════════════════════════ G-0.8 DateInput (Bk_DateInput) ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.8 — DateInput (Bk_DateInput)</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (no label, interactive)</p>
                <Bk_DateInput language={language} placeholder="Select date" placeholder_ar="اختر التاريخ" value={dateInVal} onDateChange={(d) => setDateInVal(d ? d.toISOString().split("T")[0] : "")} />
              </div>
              <div>
                <p className={SS}>label + required</p>
                <Bk_DateInput language={language} label="Date of Birth" label_ar="تاريخ الميلاد" required placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errMessage</p>
                <Bk_DateInput language={language} label="Date" label_ar="التاريخ" hasError errMessage="Date is required" errMessage_ar="التاريخ مطلوب" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled (pre-filled)</p>
                <Bk_DateInput language={language} label="Date (disabled)" label_ar="التاريخ (معطل)" disabled value="2025-06-15" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>with infoText</p>
                <Bk_DateInput language={language} label="Date" label_ar="التاريخ" infoText="Pick from calendar" infoText_ar="اختر من التقويم" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>caption left</p>
                <Bk_DateInput language={language} label="Date" label_ar="التاريخ" caption="DD/MM/YYYY" caption_ar="يوم/شهر/سنة" captionPosition="left" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>caption right</p>
                <Bk_DateInput language={language} label="Date" label_ar="التاريخ" caption="Optional" caption_ar="اختياري" captionPosition="right" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <Bk_DateInput language="ar" label="Date" label_ar="التاريخ" required placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-0.9 Fields ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-0.9 — Fields</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>type="text" (interactive)</p>
                <Fields language={language} type="text" placeholder="Enter text" placeholder_ar="أدخل النص" value={fText} onChange={setFText} />
              </div>
              <div>
                <p className={SS}>type="text" hasError</p>
                <Fields language={language} type="text" placeholder="Enter text" placeholder_ar="أدخل النص" value="" onChange={() => {}} hasError errorMessage="Required" errorMessage_ar="مطلوب" />
              </div>
              <div>
                <p className={SS}>type="text" disabled</p>
                <Fields language={language} type="text" placeholder="Disabled" placeholder_ar="معطل" value="Disabled value" onChange={() => {}} disabled />
              </div>
              <div>
                <p className={SS}>type="textarea" (interactive)</p>
                <Fields language={language} type="textarea" placeholder="Enter text..." placeholder_ar="أدخل النص..." value={fTextarea} onChange={setFTextarea} />
              </div>
              <div>
                <p className={SS}>type="select" single (interactive)</p>
                <Fields language={language} type="select" selectType="single" placeholder="Select option" placeholder_ar="اختر خياراً" value={fSelect} onChange={setFSelect} options={selectOptions} />
              </div>
              <div>
                <p className={SS}>type="select" multi (interactive)</p>
                <Fields language={language} type="select" selectType="multi" placeholder="Select options" placeholder_ar="اختر الخيارات" value={fMulti} onChange={setFMulti} options={selectOptions} />
              </div>
              <div>
                <p className={SS}>type="date" (interactive)</p>
                <Fields language={language} type="date" placeholder="Select date" placeholder_ar="اختر التاريخ" value={fDate} onChange={setFDate} />
              </div>
              <div>
                <p className={SS}>type="currency" AED (interactive)</p>
                <Fields language={language} type="currency" currencySymbol="AED" placeholder="0.00" placeholder_ar="٠.٠٠" value={fCurrency} onChange={setFCurrency} />
              </div>
              <div>
                <p className={SS}>type="phone" +971 (interactive)</p>
                <Fields language={language} type="phone" phoneCode="+971" placeholder="5x xxx xxxx" placeholder_ar="٥× ××× ××××" value={fPhone} onChange={setFPhone} />
              </div>
              <div>
                <p className={SS}>type="number" (interactive)</p>
                <Fields language={language} type="number" placeholder="Enter number" placeholder_ar="أدخل الرقم" value={fNumber} onChange={setFNumber} />
              </div>
              <div>
                <p className={SS}>type="uaeid" (interactive)</p>
                <Fields language={language} type="uaeid" placeholder="784-XXXX-XXXXXXX-X" placeholder_ar="784-XXXX-XXXXXXX-X" value={fUaeid} onChange={setFUaeid} />
              </div>
              <div>
                <p className={SS}>type="text" language="ar" forced</p>
                <Fields language="ar" type="text" placeholder="Enter text" placeholder_ar="أدخل النص" value="" onChange={() => {}} />
              </div>
            </div>
          </section>

          <div className="border-t border-gray-300 my-4" />
          <h1 className="text-bold-l text-text-default">Group 2 — Form Components</h1>

          {/* ══════════════════════════ G-2.1 TextInput ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.1 — TextInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <TextInput language={language} label="Full Name" label_ar="الاسم الكامل" placeholder="Enter name" placeholder_ar="أدخل الاسم" value={tiVal} onChange={setTiVal} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <TextInput language={language} label="Username" label_ar="اسم المستخدم" required showInfoIcon tooltipText="Unique identifier" tooltipText_ar="معرف فريد" placeholder="Enter username" placeholder_ar="أدخل اسم المستخدم" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <TextInput language={language} label="Email" label_ar="البريد الإلكتروني" hasError errorMessage="Invalid email" errorMessage_ar="بريد إلكتروني غير صالح" placeholder="Enter email" placeholder_ar="أدخل البريد" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <TextInput language={language} label="ID" label_ar="الرقم" disabled value="DIS-001" placeholder="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>with captions left + right</p>
                <TextInput language={language} label="Password" label_ar="كلمة المرور" captionLeft="Min 8 chars" captionLeft_ar="٨ أحرف على الأقل" captionRight="Optional" captionRight_ar="اختياري" placeholder="Enter password" placeholder_ar="أدخل كلمة المرور" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>fieldType="uaeid"</p>
                <TextInput language={language} label="UAE ID" label_ar="الهوية الإماراتية" fieldType="uaeid" placeholder="784-XXXX-XXXXXXX-X" placeholder_ar="784-XXXX-XXXXXXX-X" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced, required</p>
                <TextInput language="ar" label="Name" label_ar="الاسم" required placeholder="Enter" placeholder_ar="أدخل" value="" onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.2 PhoneInput ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.2 — PhoneInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default +971 (interactive)</p>
                <PhoneInput language={language} label="Mobile" label_ar="الجوال" placeholder="5x xxx xxxx" placeholder_ar="٥× ××× ××××" value={piVal} onChange={setPiVal} />
              </div>
              <div>
                <p className={SS}>required</p>
                <PhoneInput language={language} label="Phone" label_ar="الهاتف" required placeholder="5x xxx xxxx" placeholder_ar="٥× ××× ××××" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <PhoneInput language={language} label="Phone" label_ar="الهاتف" hasError errorMessage="Invalid phone" errorMessage_ar="رقم هاتف غير صالح" placeholder="5x xxx xxxx" placeholder_ar="٥× ××× ××××" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <PhoneInput language={language} label="Phone" label_ar="الهاتف" disabled value="501234567" placeholder="5x xxx xxxx" placeholder_ar="٥× ××× ××××" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>phoneCode="+1" (US)</p>
                <PhoneInput language={language} label="US Phone" label_ar="هاتف أمريكي" phoneCode="+1" placeholder="(xxx) xxx-xxxx" placeholder_ar="(xxx) xxx-xxxx" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <PhoneInput language="ar" label="Phone" label_ar="الهاتف" required placeholder="5x xxx xxxx" placeholder_ar="٥× ××× ××××" value="" onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.3 TextArea ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.3 — TextArea</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <TextArea language={language} label="Notes" label_ar="ملاحظات" placeholder="Enter notes..." placeholder_ar="أدخل الملاحظات..." value={taVal} onChange={setTaVal} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <TextArea language={language} label="Description" label_ar="الوصف" required showInfoIcon tooltipText="Describe in detail" tooltipText_ar="صف بالتفصيل" placeholder="Enter description" placeholder_ar="أدخل الوصف" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <TextArea language={language} label="Remarks" label_ar="الملاحظات" hasError errorMessage="Remarks required" errorMessage_ar="الملاحظات مطلوبة" placeholder="Enter remarks" placeholder_ar="أدخل الملاحظات" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <TextArea language={language} label="Notes" label_ar="ملاحظات" disabled value="Disabled content" placeholder="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>with captions</p>
                <TextArea language={language} label="Comments" label_ar="التعليقات" captionLeft="Max 500 chars" captionLeft_ar="الحد الأقصى ٥٠٠ حرف" captionRight="Optional" captionRight_ar="اختياري" placeholder="Enter comments" placeholder_ar="أدخل التعليقات" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <TextArea language="ar" label="Notes" label_ar="ملاحظات" placeholder="Enter notes" placeholder_ar="أدخل الملاحظات" value="" onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.4 Select ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.4 — Select</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default, no selection (interactive)</p>
                <Select language={language} label="Category" label_ar="الفئة" placeholder="Select category" placeholder_ar="اختر الفئة" options={selectOptions} value={selVal} onChange={setSelVal} />
              </div>
              <div>
                <p className={SS}>pre-selected value="b"</p>
                <Select language={language} label="Category" label_ar="الفئة" placeholder="Select" placeholder_ar="اختر" options={selectOptions} value="b" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <Select language={language} label="Type" label_ar="النوع" required showInfoIcon tooltipText="Select a type" tooltipText_ar="اختر النوع" placeholder="Select type" placeholder_ar="اختر النوع" options={selectOptions} value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <Select language={language} label="Status" label_ar="الحالة" hasError errorMessage="Selection required" errorMessage_ar="الاختيار مطلوب" placeholder="Select status" placeholder_ar="اختر الحالة" options={selectOptions} value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <Select language={language} label="Zone" label_ar="المنطقة" disabled placeholder="Select zone" placeholder_ar="اختر المنطقة" options={selectOptions} value="a" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>with dropdown title</p>
                <Select language={language} label="Area" label_ar="المساحة" title="Choose an Area" title_ar="اختر منطقة" placeholder="Select area" placeholder_ar="اختر منطقة" options={selectOptions} value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <Select language="ar" label="Category" label_ar="الفئة" placeholder="Select" placeholder_ar="اختر" options={selectOptions} value="" onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.5 MultiSelect ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.5 — MultiSelect</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default, no selection (interactive)</p>
                <MultiSelect language={language} label="Categories" label_ar="الفئات" placeholder="Select categories" placeholder_ar="اختر الفئات" options={selectOptions} value={msVal} onChange={setMsVal} />
              </div>
              <div>
                <p className={SS}>pre-selected ["a","c"]</p>
                <MultiSelect language={language} label="Categories" label_ar="الفئات" placeholder="Select" placeholder_ar="اختر" options={selectOptions} value={["a", "c"]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <MultiSelect language={language} label="Tags" label_ar="العلامات" required showInfoIcon tooltipText="Select multiple" tooltipText_ar="اختر متعدد" placeholder="Select tags" placeholder_ar="اختر العلامات" options={selectOptions} value={[]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <MultiSelect language={language} label="Services" label_ar="الخدمات" hasError errorMessage="Select at least one" errorMessage_ar="اختر واحداً على الأقل" placeholder="Select" placeholder_ar="اختر" options={selectOptions} value={[]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled with selection</p>
                <MultiSelect language={language} label="Categories" label_ar="الفئات" disabled placeholder="Select" placeholder_ar="اختر" options={selectOptions} value={["b"]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>showAddButton=true</p>
                <MultiSelect language={language} label="Tags" label_ar="العلامات" showAddButton placeholder="Select tags" placeholder_ar="اختر العلامات" options={selectOptions} value={[]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <MultiSelect language="ar" label="Categories" label_ar="الفئات" placeholder="Select" placeholder_ar="اختر" options={selectOptions} value={[]} onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.6 CurrencyInput ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.6 — CurrencyInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default AED (interactive)</p>
                <CurrencyInput language={language} label="Amount" label_ar="المبلغ" placeholder="0.00" placeholder_ar="٠.٠٠" value={curVal} onChange={setCurVal} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <CurrencyInput language={language} label="Rent Amount" label_ar="مبلغ الإيجار" required showInfoIcon tooltipText="Annual rent" tooltipText_ar="الإيجار السنوي" placeholder="0.00" placeholder_ar="٠.٠٠" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <CurrencyInput language={language} label="Fees" label_ar="الرسوم" hasError errorMessage="Enter valid amount" errorMessage_ar="أدخل مبلغاً صالحاً" placeholder="0.00" placeholder_ar="٠.٠٠" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <CurrencyInput language={language} label="Amount" label_ar="المبلغ" disabled value="5000" placeholder="0.00" placeholder_ar="٠.٠٠" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>currencySymbol="USD"</p>
                <CurrencyInput language={language} label="USD Amount" label_ar="المبلغ بالدولار" currencySymbol="USD" placeholder="0.00" placeholder_ar="٠.٠٠" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <CurrencyInput language="ar" label="Amount" label_ar="المبلغ" placeholder="0.00" placeholder_ar="٠.٠٠" value="" onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.7 NumberInput ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.7 — NumberInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <NumberInput language={language} label="Quantity" label_ar="الكمية" placeholder="Enter number" placeholder_ar="أدخل الرقم" value={numVal} onChange={setNumVal} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <NumberInput language={language} label="Area (m²)" label_ar="المساحة (م²)" required showInfoIcon tooltipText="Area in m²" tooltipText_ar="المساحة بالأمتار المربعة" placeholder="0" placeholder_ar="٠" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <NumberInput language={language} label="Count" label_ar="العدد" hasError errorMessage="Enter valid number" errorMessage_ar="أدخل رقماً صالحاً" placeholder="0" placeholder_ar="٠" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled</p>
                <NumberInput language={language} label="Units" label_ar="الوحدات" disabled value="42" placeholder="0" placeholder_ar="٠" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>with captions</p>
                <NumberInput language={language} label="Units" label_ar="الوحدات" captionLeft="Min: 1" captionLeft_ar="الحد الأدنى: ١" captionRight="Max: 100" captionRight_ar="الحد الأقصى: ١٠٠" placeholder="1–100" placeholder_ar="١–١٠٠" value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <NumberInput language="ar" label="Number" label_ar="الرقم" placeholder="Enter" placeholder_ar="أدخل" value="" onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.8 DateSelect ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.8 — DateSelect</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default (interactive)</p>
                <DateSelect language={language} label="Contract Date" label_ar="تاريخ العقد" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={(d) => setDsVal(d ? d.toISOString().split("T")[0] : "")} value={dsVal} />
              </div>
              <div>
                <p className={SS}>required + infoText</p>
                <DateSelect language={language} label="Start Date" label_ar="تاريخ البداية" required infoText="Pick the start date" infoText_ar="اختر تاريخ البداية" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errMessage</p>
                <DateSelect language={language} label="End Date" label_ar="تاريخ الانتهاء" hasError errMessage="Date is required" errMessage_ar="التاريخ مطلوب" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled with value</p>
                <DateSelect language={language} label="Expiry" label_ar="انتهاء الصلاحية" disabled value="2025-12-31" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>caption left</p>
                <DateSelect language={language} label="Issue Date" label_ar="تاريخ الإصدار" caption="Gregorian calendar" caption_ar="التقويم الميلادي" captionPosition="left" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>caption right</p>
                <DateSelect language={language} label="Renewal Date" label_ar="تاريخ التجديد" caption="Optional" caption_ar="اختياري" captionPosition="right" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <DateSelect language="ar" label="Date" label_ar="التاريخ" required placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
              <div>
                <p className={SS}>pre-selected value</p>
                <DateSelect language={language} label="Date" label_ar="التاريخ" value="2025-03-15" placeholder="Select date" placeholder_ar="اختر التاريخ" onDateChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.9 CheckboxField ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.9 — CheckboxField</h2>
            <div className="flex flex-wrap gap-6 mt-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">unchecked</p>
                <CheckboxField language={language} id="cbf-un" label="Accept terms" label_ar="قبول الشروط" checked={false} onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">checked</p>
                <CheckboxField language={language} id="cbf-ch" label="Accept terms" label_ar="قبول الشروط" checked={true} onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">interactive</p>
                <CheckboxField language={language} id="cbf-int" label="Subscribe" label_ar="اشتراك" checked={cbfVal} onChange={setCbfVal} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <CheckboxField language={language} id="cbf-dis-un" label="Disabled" label_ar="معطل" checked={false} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <CheckboxField language={language} id="cbf-dis-ch" label="Disabled" label_ar="معطل" checked={true} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <CheckboxField language={language} id="cbf-err" label="Required" label_ar="مطلوب" checked={false} hasError onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">language="ar" forced</p>
                <CheckboxField language="ar" id="cbf-ar" label="Accept" label_ar="قبول" checked={true} onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.10 CheckboxInput ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.10 — CheckboxInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>default, no selection (interactive)</p>
                <CheckboxInput language={language} label="Preferences" label_ar="التفضيلات" options={checkOptions} value={cbiVal} onChange={setCbiVal} />
              </div>
              <div>
                <p className={SS}>pre-selected ["1","3"]</p>
                <CheckboxInput language={language} label="Preferences" label_ar="التفضيلات" options={checkOptions} value={["1", "3"]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <CheckboxInput language={language} label="Choices" label_ar="الاختيارات" required showInfoIcon tooltipText="Select at least one" tooltipText_ar="اختر واحداً على الأقل" options={checkOptions} value={[]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <CheckboxInput language={language} label="Services" label_ar="الخدمات" hasError errorMessage="Select at least one" errorMessage_ar="اختر خدمة واحدة على الأقل" options={checkOptions} value={[]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled with selection</p>
                <CheckboxInput language={language} label="Disabled" label_ar="معطل" disabled options={checkOptions} value={["2"]} onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <CheckboxInput language="ar" label="Choices" label_ar="الاختيارات" options={checkOptions} value={[]} onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.11 RadioField ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.11 — RadioField</h2>
            <div className="flex flex-wrap gap-6 mt-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">unchecked</p>
                <RadioField language={language} id="rf-un" value="opt1" label="Option 1" label_ar="الخيار ١" checked={false} onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">checked</p>
                <RadioField language={language} id="rf-ch" value="opt1" label="Option 1" label_ar="الخيار ١" checked={true} onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">interactive group</p>
                <div className="flex gap-4">
                  {["A", "B", "C"].map((v) => (
                    <RadioField key={v} language={language} id={`rf-grp-${v}`} value={v} label={`Opt ${v}`} label_ar={`خيار ${v}`} checked={rfVal === v} onChange={setRfVal} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled unchecked</p>
                <RadioField language={language} id="rf-dis-un" value="d" label="Disabled" label_ar="معطل" checked={false} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">disabled checked</p>
                <RadioField language={language} id="rf-dis-ch" value="d2" label="Disabled" label_ar="معطل" checked={true} disabled onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">hasError</p>
                <RadioField language={language} id="rf-err" value="e" label="Error" label_ar="خطأ" checked={false} hasError onChange={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-dimmed">language="ar" forced</p>
                <RadioField language="ar" id="rf-ar" value="ar" label="Arabic" label_ar="عربي" checked={true} onChange={() => {}} />
              </div>
            </div>
          </section>

          {/* ══════════════════════════ G-2.12 RadioInput ══════════════════════════ */}
          <section className="flex flex-col gap-2">
            <h2 className={ST}>G-2.12 — RadioInput</h2>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <p className={SS}>no selection (interactive)</p>
                <RadioInput language={language} label="Gender" label_ar="الجنس" options={checkOptions} value={riVal} onChange={setRiVal} />
              </div>
              <div>
                <p className={SS}>pre-selected value="2"</p>
                <RadioInput language={language} label="Gender" label_ar="الجنس" options={checkOptions} value="2" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>required + showInfoIcon</p>
                <RadioInput language={language} label="Type" label_ar="النوع" required showInfoIcon tooltipText="Select a type" tooltipText_ar="اختر نوعاً" options={checkOptions} value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>hasError + errorMessage</p>
                <RadioInput language={language} label="Status" label_ar="الحالة" hasError errorMessage="Selection required" errorMessage_ar="الاختيار مطلوب" options={checkOptions} value="" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>disabled with selection</p>
                <RadioInput language={language} label="Category" label_ar="الفئة" disabled options={checkOptions} value="1" onChange={() => {}} />
              </div>
              <div>
                <p className={SS}>language="ar" forced</p>
                <RadioInput language="ar" label="Type" label_ar="النوع" options={checkOptions} value="" onChange={() => {}} />
              </div>
            </div>
          </section>

        </div>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
