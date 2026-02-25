import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Label } from "@/ui/Label";
import { Caption } from "@/ui/Caption";
import { Tooltip } from "@/ui/Tooltip";
import { Checkbox } from "@/ui/Checkbox";
import { Radio } from "@/ui/Radio";
import { CheckRadioLabel } from "@/ui/CheckRadioLabel";
import { AddButton } from "@/ui/AddButton";
import { DateInput } from "@/ui/DateInput";
import { Fields } from "@/ui/Fields";
import { Toast } from "@/ui/Toast";
import { Layout } from "@/ui/Layout";
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
import { Buttons } from "@/ui/Buttons";
import { Typography } from "@/ui/Typography";
import { Breadcrumb } from "@/ui/Breadcrumb";
import { Pagination } from "@/ui/Pagination";
import { AddMoreButton } from "@/ui/AddMoreButton";
import { Prompt } from "@/ui/Prompt";
import { ScreenLoader } from "@/ui/ScreenLoader";
import TitleBar from "@/components/TitleBar";
import OwnerSearch from "@/components/OwnerSearch";
import type { TooltipDirectionType } from "@shared/types";

const SECTION_TITLE = "text-bold-l text-text-default mb-2";

function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [captionError, setCaptionError] = useState(false);
  const [captionDisabled, setCaptionDisabled] = useState(false);
  const [tooltipDirection, setTooltipDirection] =
    useState<TooltipDirectionType>("bottom-center");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [radioSelected, setRadioSelected] = useState<string>("opt1");
  const [addButtonClicks, setAddButtonClicks] = useState(0);
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);
  const [dateValue, setDateValue] = useState<string>("");
  const [fieldText, setFieldText] = useState("");
  const [fieldTextArea, setFieldTextArea] = useState("");
  const [fieldSelect, setFieldSelect] = useState("");
  const [fieldMultiSelect, setFieldMultiSelect] = useState("");
  const [fieldNumber, setFieldNumber] = useState("");
  const [fieldCurrency, setFieldCurrency] = useState("");
  const [fieldPhone, setFieldPhone] = useState("");
  const [fieldDate, setFieldDate] = useState("");
  const [fieldUaeId, setFieldUaeId] = useState("");
  const [fieldsError, setFieldsError] = useState(false);
  const [layoutToast, setLayoutToast] = useState<{ message: string; status: "success" | "error" | "information" | "action" }>({
    message: "",
    status: "success",
  });
  const [checkboxFieldChecked, setCheckboxFieldChecked] = useState(false);
  const [radioInputVal, setRadioInputVal] = useState("a");
  const [checkboxInputVal, setCheckboxInputVal] = useState<string[]>([]);
  const [paginationPage, setPaginationPage] = useState(1);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showScreenLoader, setShowScreenLoader] = useState(false);
  const layoutMenuItems = [
    { label: "Profile", label_ar: "الملف الشخصي", onClick: () => {} },
    { label: "Logout", label_ar: "تسجيل الخروج", onClick: () => {} },
  ];
  const layoutBreadcrumbItems = [
    { label: "Home", label_ar: "الرئيسية", onClick: () => {} },
    { label: "Group 1", label_ar: "المجموعة ١", onClick: () => {} },
  ];
  const selectOptions = [
    { value: "a", label: "Option A", label_ar: "الخيار أ" },
    { value: "b", label: "Option B", label_ar: "الخيار ب" },
    { value: "c", label: "Option C", label_ar: "الخيار ج" },
  ];

  return (
    <QueryClientProvider client={new QueryClient()}>
      {/* Group 1 — Layout (full app shell for verification) */}
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
        toast={layoutToast.message ? layoutToast : { message: "", status: "success" }}
      >
        <div className="p-6 flex flex-col gap-10 max-w-2xl">
          <button
            type="button"
            className="text-sm px-3 py-1.5 border rounded mb-4"
            onClick={() =>
              setLayoutToast({ message: "Layout toast message", status: "success" })
            }
          >
            Show toast in Layout
          </button>
          {/* 0.1 Label */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.1 Label</h2>
          <Label
            label="Field label"
            label_ar="تسمية الحقل"
            required
            htmlFor="label-demo"
          />
          <Label
            label="With info icon"
            label_ar="مع أيقونة المعلومات"
            showInfoIcon
            tooltipText="Extra information here"
            tooltipText_ar="معلومات إضافية"
            tooltipDirection={language === "ar" ? "top-right" : "top-left"}
          />
          <Label
            label="Disabled label"
            label_ar="تسمية معطلة"
            disabled
            language={language}
          />
        </section>

        {/* 0.2 Caption */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.2 Caption</h2>
          <Caption
            captionLeft="Left caption"
            captionLeft_ar="تسمية يسرى"
            captionRight="Right caption"
            captionRight_ar="تسمية يمنى"
            language={language}
          />
          <Caption
            captionLeft="With error"
            captionRight="Right"
            hasError={captionError}
            errorMessage={captionError ? "This field has an error" : undefined}
            errorMessage_ar={captionError ? "هذا الحقل به خطأ" : undefined}
            language={language}
          />
          <Caption
            captionLeft="Disabled state"
            captionRight="Right"
            disabled={captionDisabled}
            language={language}
          />
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => setCaptionError((e) => !e)}
            >
              Toggle error
            </button>
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => setCaptionDisabled((d) => !d)}
            >
              Toggle disabled
            </button>
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>
        </section>

        {/* 0.3 Tooltip */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.3 Tooltip</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Tooltip
                text="Tooltip text"
                text_ar="نص التلميح"
                language={language}
                direction="none"
              />
            </div>
            <div className="relative">
              <Tooltip
                text="Top center"
                direction="top-center"
                language={language}
              />
            </div>
            <div className="relative">
              <Tooltip
                text="Bottom center"
                direction="bottom-center"
                language={language}
              />
            </div>
            <div className="relative">
              <Tooltip
                text="Right center"
                direction="right-center"
                language={language}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bold-xs">Direction:</span>
            <select
              value={tooltipDirection}
              onChange={(e) =>
                setTooltipDirection(e.target.value as TooltipDirectionType)
              }
              className="text-sm border rounded px-2 py-1"
            >
              <option value="none">none</option>
              <option value="top-left">top-left</option>
              <option value="top-center">top-center</option>
              <option value="top-right">top-right</option>
              <option value="bottom-left">bottom-left</option>
              <option value="bottom-center">bottom-center</option>
              <option value="bottom-right">bottom-right</option>
              <option value="left-top">left-top</option>
              <option value="left-center">left-center</option>
              <option value="left-bottom">left-bottom</option>
              <option value="right-top">right-top</option>
              <option value="right-center">right-center</option>
              <option value="right-bottom">right-bottom</option>
            </select>
            <div className="relative">
              <Tooltip text="Dynamic direction" direction={tooltipDirection} />
            </div>
          </div>
        </section>

        {/* 0.4 Checkbox */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.4 Checkbox</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Checkbox
              id="cb-controlled"
              checked={checkboxChecked}
              onChange={(_, checked) => setCheckboxChecked(checked)}
            />
            <span className="text-bold-xs">
              Controlled ({checkboxChecked ? "checked" : "unchecked"})
            </span>
            <Checkbox id="cb-uncontrolled" onChange={() => {}} />
            <span className="text-bold-xs">Uncontrolled</span>
            <Checkbox
              id="cb-disabled"
              disabled={checkboxDisabled}
              onChange={() => {}}
            />
            <span className="text-bold-xs">Disabled</span>
            <Checkbox id="cb-error" hasError={checkboxError} onChange={() => {}} />
            <span className="text-bold-xs">Error</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => setCheckboxChecked((c) => !c)}
            >
              Toggle checked
            </button>
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => setCheckboxDisabled((d) => !d)}
            >
              Toggle disabled
            </button>
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => setCheckboxError((e) => !e)}
            >
              Toggle error
            </button>
          </div>
        </section>

        {/* 0.5 Radio */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.5 Radio</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {["opt1", "opt2", "opt3"].map((id) => (
              <Radio
                key={id}
                id={id}
                name="radio-group"
                checked={radioSelected === id}
                onChange={(id) => setRadioSelected(id)}
              />
            ))}
            <Radio id="r-disabled" disabled onChange={() => {}} />
            <span className="text-bold-xs">Disabled</span>
            <Radio id="r-error" hasError onChange={() => {}} />
            <span className="text-bold-xs">Error</span>
          </div>
          <p className="text-bold-xs text-text-dimmed">
            Selected: {radioSelected}
          </p>
        </section>

        {/* 0.6 CheckRadioLabel */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.6 CheckRadioLabel</h2>
          <div className="flex flex-col gap-2">
            <CheckRadioLabel
              label="Option label"
              label_ar="تسمية الخيار"
              language={language}
              htmlFor="crl-1"
            />
            <CheckRadioLabel
              label="Disabled label"
              label_ar="تسمية معطلة"
              disabled
              language={language}
            />
          </div>
        </section>

        {/* 0.7 AddButton */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.7 AddButton</h2>
          <div className="flex gap-4 items-center">
            <AddButton onClick={() => setAddButtonClicks((c) => c + 1)} />
            <AddButton
              disabled={addButtonDisabled}
              onClick={() => setAddButtonClicks((c) => c + 1)}
            />
            <span className="text-bold-xs">
              Clicks: {addButtonClicks} | Disabled:{" "}
              {addButtonDisabled ? "yes" : "no"}
            </span>
          </div>
          <button
            type="button"
            className="text-xs px-2 py-1 border rounded w-fit"
            onClick={() => setAddButtonDisabled((d) => !d)}
          >
            Toggle disabled
          </button>
        </section>

        {/* 0.8 DateInput */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.8 DateInput</h2>
          <DateInput
            placeholder="Select date"
            placeholder_ar="اختر التاريخ"
            label="Date field"
            label_ar="حقل التاريخ"
            value={dateValue}
            onDateChange={(d) =>
              setDateValue(d ? d.toISOString().slice(0, 10) : "")
            }
            hasError={false}
            required
            infoText="Pick a date"
            infoText_ar="اختر تاريخاً"
            caption="Optional caption"
            caption_ar="تسمية اختيارية"
            captionPosition="left"
            language={language}
            testId="date-input-demo"
          />
          <p className="text-bold-xs text-text-dimmed">Value: {dateValue || "—"}</p>
        </section>

        {/* 0.9 Fields */}
        <section className="flex flex-col gap-4">
          <h2 className={SECTION_TITLE}>0.9 Fields</h2>
          <Fields
            type="text"
            placeholder="Text placeholder"
            value={fieldText}
            onChange={setFieldText}
            hasError={fieldsError}
            errorMessage="Invalid value"
            language={language}
            testId="field-text"
          />
          <Fields
            type="textarea"
            placeholder="Textarea placeholder"
            value={fieldTextArea}
            onChange={setFieldTextArea}
            language={language}
          />
          <Fields
            type="select"
            placeholder="Select..."
            value={fieldSelect}
            onChange={setFieldSelect}
            options={selectOptions}
            selectType="single"
            language={language}
          />
          <Fields
            type="select"
            placeholder="Multi select..."
            value={fieldMultiSelect}
            onChange={setFieldMultiSelect}
            options={selectOptions}
            selectType="multi"
            language={language}
          />
          <Fields
            type="number"
            placeholder="Number"
            value={fieldNumber}
            onChange={setFieldNumber}
            language={language}
          />
          <Fields
            type="currency"
            placeholder="0.00"
            value={fieldCurrency}
            onChange={setFieldCurrency}
            currencySymbol="AED"
            language={language}
          />
          <Fields
            type="phone"
            placeholder="Phone"
            value={fieldPhone}
            onChange={setFieldPhone}
            phoneCode="+971"
            language={language}
          />
          <Fields
            type="date"
            placeholder="Select date"
            value={fieldDate}
            onChange={setFieldDate}
            language={language}
          />
          <Fields
            type="uaeid"
            placeholder="000-0000-0000000-0"
            value={fieldUaeId}
            onChange={setFieldUaeId}
            language={language}
          />
          <button
            type="button"
            className="text-xs px-2 py-1 border rounded w-fit"
            onClick={() => setFieldsError((e) => !e)}
          >
            Toggle Fields error
          </button>
        </section>

        {/* Group 2 — Form Components (all states: normal, error, disabled) */}
        <section className="flex flex-col gap-6">
          <h2 className={SECTION_TITLE}>Group 2 — Form Components</h2>
          <p className="text-bold-xs text-text-dimmed mb-1">
            Each input shown in Normal, Error, and Disabled states.
          </p>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">TextInput</h3>
            <TextInput label="Normal" placeholder="Enter text" value={fieldText} onChange={setFieldText} language={language} />
            <TextInput label="With error" placeholder="Enter text" value={fieldText} onChange={setFieldText} hasError errorMessage="This field is required" language={language} />
            <TextInput label="Disabled" placeholder="Enter text" value={fieldText} onChange={setFieldText} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">PhoneInput</h3>
            <PhoneInput label="Normal" placeholder="Phone" value={fieldPhone} onChange={setFieldPhone} phoneCode="+971" language={language} />
            <PhoneInput label="With error" placeholder="Phone" value={fieldPhone} onChange={setFieldPhone} phoneCode="+971" hasError errorMessage="Invalid phone number" language={language} />
            <PhoneInput label="Disabled" placeholder="Phone" value={fieldPhone} onChange={setFieldPhone} phoneCode="+971" disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">TextArea</h3>
            <TextArea label="Normal" placeholder="Multi-line text" value={fieldTextArea} onChange={setFieldTextArea} language={language} />
            <TextArea label="With error" placeholder="Multi-line text" value={fieldTextArea} onChange={setFieldTextArea} hasError errorMessage="Max 500 characters" language={language} />
            <TextArea label="Disabled" placeholder="Multi-line text" value={fieldTextArea} onChange={setFieldTextArea} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">Select</h3>
            <Select label="Normal" placeholder="Choose..." value={fieldSelect} onChange={setFieldSelect} options={selectOptions} language={language} />
            <Select label="With error" placeholder="Choose..." value={fieldSelect} onChange={setFieldSelect} options={selectOptions} hasError errorMessage="Please select an option" language={language} />
            <Select label="Disabled" placeholder="Choose..." value={fieldSelect} onChange={setFieldSelect} options={selectOptions} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">MultiSelect</h3>
            <MultiSelect label="Normal" placeholder="Choose multiple..." value={fieldMultiSelect} onChange={setFieldMultiSelect} options={selectOptions} language={language} />
            <MultiSelect label="With error" placeholder="Choose multiple..." value={fieldMultiSelect} onChange={setFieldMultiSelect} options={selectOptions} hasError errorMessage="Select at least one" language={language} />
            <MultiSelect label="Disabled" placeholder="Choose multiple..." value={fieldMultiSelect} onChange={setFieldMultiSelect} options={selectOptions} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">CurrencyInput</h3>
            <CurrencyInput label="Normal" value={fieldCurrency} onChange={setFieldCurrency} currencySymbol="AED" language={language} />
            <CurrencyInput label="With error" value={fieldCurrency} onChange={setFieldCurrency} currencySymbol="AED" hasError errorMessage="Invalid amount" language={language} />
            <CurrencyInput label="Disabled" value={fieldCurrency} onChange={setFieldCurrency} currencySymbol="AED" disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">NumberInput</h3>
            <NumberInput label="Normal" value={fieldNumber} onChange={setFieldNumber} language={language} />
            <NumberInput label="With error" value={fieldNumber} onChange={setFieldNumber} hasError errorMessage="Must be a number" language={language} />
            <NumberInput label="Disabled" value={fieldNumber} onChange={setFieldNumber} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">DateSelect</h3>
            <DateSelect label="Normal" placeholder="Select date" value={fieldDate} onDateChange={(d) => setFieldDate(d ? d.toISOString().slice(0, 10) : "")} language={language} />
            <DateSelect label="With error" placeholder="Select date" value={fieldDate} onDateChange={(d) => setFieldDate(d ? d.toISOString().slice(0, 10) : "")} hasError errMessage="Invalid date" language={language} />
            <DateSelect label="Disabled" placeholder="Select date" value={fieldDate} onDateChange={(d) => setFieldDate(d ? d.toISOString().slice(0, 10) : "")} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">CheckboxField</h3>
            <CheckboxField label="Normal" checked={checkboxFieldChecked} onChange={(v) => setCheckboxFieldChecked(!!v)} language={language} />
            <CheckboxField label="With error" checked={checkboxFieldChecked} onChange={(v) => setCheckboxFieldChecked(!!v)} language={language} />
            <CheckboxField label="Disabled" checked={checkboxFieldChecked} onChange={(v) => setCheckboxFieldChecked(!!v)} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">CheckboxInput</h3>
            <CheckboxInput label="Normal" options={selectOptions as { value: string; label?: string; label_ar?: string }[]} value={checkboxInputVal} onChange={setCheckboxInputVal} language={language} />
            <CheckboxInput label="With error" options={selectOptions as { value: string; label?: string; label_ar?: string }[]} value={checkboxInputVal} onChange={setCheckboxInputVal} language={language} />
            <CheckboxInput label="Disabled" options={selectOptions as { value: string; label?: string; label_ar?: string }[]} value={checkboxInputVal} onChange={setCheckboxInputVal} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">RadioField</h3>
            <RadioField label="Normal" value="opt1" checked={radioInputVal === "opt1"} onChange={(v) => setRadioInputVal(v)} language={language} />
            <RadioField label="Disabled" value="opt1" checked={radioInputVal === "opt1"} onChange={(v) => setRadioInputVal(v)} disabled language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-bold-sm text-text-default">RadioInput</h3>
            <RadioInput label="Normal" options={selectOptions} value={radioInputVal} onChange={setRadioInputVal} language={language} />
            <RadioInput label="With error" options={selectOptions} value={radioInputVal} onChange={setRadioInputVal} hasError errorMessage="Please select an option" language={language} />
            <RadioInput label="Disabled" options={selectOptions} value={radioInputVal} onChange={setRadioInputVal} disabled language={language} />
          </div>
        </section>

        {/* Group 3 — UI Primitives */}
        <section className="flex flex-col gap-4">
          <h2 className={SECTION_TITLE}>Group 3 — UI Primitives</h2>
          <div className="flex flex-wrap gap-2">
            <Buttons title="Primary" type="primary" onClick={() => {}} language={language} />
            <Buttons title="Secondary" type="secondary" onClick={() => {}} language={language} />
            <Buttons title="Tertiary" type="tertiary" onClick={() => {}} language={language} />
            <Buttons title="Text link" type="text-link" onClick={() => {}} language={language} />
            <Buttons title="Delete" type="delete" onClick={() => {}} language={language} />
            <Buttons title="Disabled" disabled onClick={() => {}} language={language} />
          </div>
          <Typography variant="h2" text="Typography H2" text_ar="العنوان" language={language} />
          <Typography variant="text-md" text="Body text" color="dimmed" language={language} />
          <Breadcrumb
            items={layoutBreadcrumbItems}
            selectedItemIndex={0}
            language={language}
          />
          <Pagination
            currentPage={paginationPage}
            totalPages={10}
            pageSize={10}
            onPageChange={setPaginationPage}
            language={language}
          />
          <AddMoreButton
            title="Add more"
            title_ar="إضافة المزيد"
            onClick={() => {}}
            language={language}
          />
          <button
            type="button"
            className="text-xs px-2 py-1 border rounded"
            onClick={() => setShowPrompt(true)}
          >
            Show Prompt
          </button>
          {showPrompt && (
            <Prompt
              title="Confirm action"
              title_ar="تأكيد"
              subtiltle="Are you sure?"
              subtiltle_ar="هل أنت متأكد؟"
              yesText="Yes"
              noText="No"
              onYesClick={() => setShowPrompt(false)}
              onNoClick={() => setShowPrompt(false)}
              language={language}
            />
          )}
          <button
            type="button"
            className="text-xs px-2 py-1 border rounded"
            onClick={() => setShowScreenLoader((v) => !v)}
          >
            Toggle ScreenLoader
          </button>
          <ScreenLoader isLoading={showScreenLoader} alt="Loading..." />
        </section>

        {/* Group 4 — TitleBar (G-4.1) */}
        <section className="flex flex-col gap-6">
          <h2 className={SECTION_TITLE}>Group 4 — TitleBar (G-4.1)</h2>
          <TitleBar
            language={language}
            showTitle={true}
            title="Land Allocation"
            title_ar="تخصيص الأراضي"
            showAcronym={true}
            acronym="LA"
            acronym_ar="LA"
            showButton={true}
            buttonLabel="New Application"
            buttonLabel_ar="طلب جديد"
            buttonType="primary"
            onClick={() => {}}
          />
          <TitleBar
            language={language}
            showTitle={true}
            title="Page Title"
            title_ar="عنوان الصفحة"
            showAcronym={false}
            showButton={false}
          />
          <TitleBar
            language={language}
            showTitle={true}
            title="With Secondary Button"
            title_ar="مع زر ثانوي"
            showAcronym={true}
            acronym="WSB"
            showButton={true}
            buttonLabel="Secondary CTA"
            buttonLabel_ar="إجراء ثانوي"
            buttonType="secondary"
            onClick={() => {}}
          />
        </section>

        {/* Group 4 — OwnerSearch (G-4.2) */}
        <section className="flex flex-col gap-6">
          <h2 className={SECTION_TITLE}>Group 4 — OwnerSearch (G-4.2)</h2>
          <OwnerSearch
            language={language}
            title="New Application"
            title_ar="طلب جديد"
            subtitle="Search Owner"
            subtitle_ar="بحث عن مالك"
            ownerTypeOptions={{
              company: "By Company Owner",
              company_ar: "حسب مالك الشركة",
              owner: "By Owner",
              owner_ar: "حسب المالك",
            }}
            initialOwnerType="company"
            theme="dark"
            selected={[]}
            onSubmit={(val) => console.log("OwnerSearch onSubmit", val)}
          />
        </section>

        {/* 0.10 Toast */}
        <section className="flex flex-col gap-3">
          <h2 className={SECTION_TITLE}>0.10 Toast</h2>
          <div className="flex flex-col gap-2">
            <Toast message="Success: operation completed" status="success" />
            <Toast message="Error: something went wrong" status="error" />
            <Toast message="Information: please review" status="information" />
            <Toast message="Action: confirm to continue" status="action" />
          </div>
          <p className="text-bold-xs text-text-dimmed">
            Toasts auto-hide in 5s or close via icon. Refresh to show again.
          </p>
        </section>
        </div>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
