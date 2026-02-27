import { useState, useEffect } from "react";
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
import { OwnerSearch } from "@shared/components/OwnerSearch";
import { FilterBar } from "@/ui/FilterBar";
import CardTitle from "@shared/components/CardTitle";
import ModalTitle from "@shared/components/ModalTitle";
import ModalSteps from "@shared/components/ModalSteps";
import GenericCard from "@shared/components/GenericCard";
import OwnerCard from "@shared/components/OwnerCard";
import PlotCard from "@shared/components/PlotCard";
import Table from "@shared/components/Table";
import ApplicationDetail from "@shared/components/ApplicationDetail";
import ApplicationMessage from "@shared/components/ApplicationMessage";
import ViewOwnerDetail from "@shared/components/ViewOwnerDetail";
import { Check, Send } from "lucide-react";
import Document from "@/assets/svg/document";
import ApplicationSuccess from "@/assets/svg/applicationMessage/success";
import ApplicationError from "@/assets/svg/applicationMessage/error";
import ApplicationInformation from "@/assets/svg/applicationMessage/information";
import ApplicationAction from "@/assets/svg/applicationMessage/action";
import Payment from "@shared/components/Payment";
import PaymentDetails from "@shared/components/PaymentDetails";
import { useGetDownloadFile } from "@/hooks/useGetDownloadFile";
import { SearchPlot } from "@shared/components/SearchPlot";
import Signature from "@/components/Signature";
import UploadDocuments from "@/components/UploadDocuments";
import { ViewPlotDetail } from "@shared/components/ViewPlotDetail";
import ApplicationSummary from "@shared/components/ApplicationSummary";
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
  const [filterBarSearch, setFilterBarSearch] = useState("");
  const [filterBarColumns, setFilterBarColumns] = useState<string[]>([]);
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

  // Group 4 — PaymentDetails (G-4.10) download handler (web-specific)
  const [paymentDetailsDownloadUrl, setPaymentDetailsDownloadUrl] = useState<
    string | undefined
  >(undefined);
  const {
    data: paymentDetailsBlob,
    isSuccess: isPaymentDetailsDownloadSuccess,
  } = useGetDownloadFile(paymentDetailsDownloadUrl);
  useEffect(() => {
    if (!isPaymentDetailsDownloadSuccess || !paymentDetailsBlob) return;
    try {
      const blob = paymentDetailsBlob as Blob;
      const mime = blob.type || "";
      const ext = mime.split("/")[1]?.split(";")[0] ?? "bin";
      const filename = `payment-slip.${ext}`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download payment slip", e);
    } finally {
      setPaymentDetailsDownloadUrl(undefined);
    }
  }, [isPaymentDetailsDownloadSuccess, paymentDetailsBlob]);

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
        toast={
          layoutToast.message ? layoutToast : { message: "", status: "success" }
        }
      >
        <div className="p-6 flex flex-col gap-10 max-w-4xl">
          <button
            type="button"
            className="text-sm px-3 py-1.5 border rounded mb-4"
            onClick={() =>
              setLayoutToast({
                message: "Layout toast message",
                status: "success",
              })
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
              errorMessage={
                captionError ? "This field has an error" : undefined
              }
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
                <Tooltip
                  text="Dynamic direction"
                  direction={tooltipDirection}
                />
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
              <Checkbox
                id="cb-error"
                hasError={checkboxError}
                onChange={() => {}}
              />
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
            <p className="text-bold-xs text-text-dimmed">
              Value: {dateValue || "—"}
            </p>
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
              <TextInput
                label="Normal"
                placeholder="Enter text"
                value={fieldText}
                onChange={setFieldText}
                language={language}
              />
              <TextInput
                label="With error"
                placeholder="Enter text"
                value={fieldText}
                onChange={setFieldText}
                hasError
                errorMessage="This field is required"
                language={language}
              />
              <TextInput
                label="Disabled"
                placeholder="Enter text"
                value={fieldText}
                onChange={setFieldText}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">PhoneInput</h3>
              <PhoneInput
                label="Normal"
                placeholder="Phone"
                value={fieldPhone}
                onChange={setFieldPhone}
                phoneCode="+971"
                language={language}
              />
              <PhoneInput
                label="With error"
                placeholder="Phone"
                value={fieldPhone}
                onChange={setFieldPhone}
                phoneCode="+971"
                hasError
                errorMessage="Invalid phone number"
                language={language}
              />
              <PhoneInput
                label="Disabled"
                placeholder="Phone"
                value={fieldPhone}
                onChange={setFieldPhone}
                phoneCode="+971"
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">TextArea</h3>
              <TextArea
                label="Normal"
                placeholder="Multi-line text"
                value={fieldTextArea}
                onChange={setFieldTextArea}
                language={language}
              />
              <TextArea
                label="With error"
                placeholder="Multi-line text"
                value={fieldTextArea}
                onChange={setFieldTextArea}
                hasError
                errorMessage="Max 500 characters"
                language={language}
              />
              <TextArea
                label="Disabled"
                placeholder="Multi-line text"
                value={fieldTextArea}
                onChange={setFieldTextArea}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">Select</h3>
              <Select
                label="Normal"
                placeholder="Choose..."
                value={fieldSelect}
                onChange={setFieldSelect}
                options={selectOptions}
                language={language}
              />
              <Select
                label="With error"
                placeholder="Choose..."
                value={fieldSelect}
                onChange={setFieldSelect}
                options={selectOptions}
                hasError
                errorMessage="Please select an option"
                language={language}
              />
              <Select
                label="Disabled"
                placeholder="Choose..."
                value={fieldSelect}
                onChange={setFieldSelect}
                options={selectOptions}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">MultiSelect</h3>
              <MultiSelect
                label="Normal"
                placeholder="Choose multiple..."
                value={fieldMultiSelect}
                onChange={setFieldMultiSelect}
                options={selectOptions}
                language={language}
              />
              <MultiSelect
                label="With error"
                placeholder="Choose multiple..."
                value={fieldMultiSelect}
                onChange={setFieldMultiSelect}
                options={selectOptions}
                hasError
                errorMessage="Select at least one"
                language={language}
              />
              <MultiSelect
                label="Disabled"
                placeholder="Choose multiple..."
                value={fieldMultiSelect}
                onChange={setFieldMultiSelect}
                options={selectOptions}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">CurrencyInput</h3>
              <CurrencyInput
                label="Normal"
                value={fieldCurrency}
                onChange={setFieldCurrency}
                currencySymbol="AED"
                language={language}
              />
              <CurrencyInput
                label="With error"
                value={fieldCurrency}
                onChange={setFieldCurrency}
                currencySymbol="AED"
                hasError
                errorMessage="Invalid amount"
                language={language}
              />
              <CurrencyInput
                label="Disabled"
                value={fieldCurrency}
                onChange={setFieldCurrency}
                currencySymbol="AED"
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">NumberInput</h3>
              <NumberInput
                label="Normal"
                value={fieldNumber}
                onChange={setFieldNumber}
                language={language}
              />
              <NumberInput
                label="With error"
                value={fieldNumber}
                onChange={setFieldNumber}
                hasError
                errorMessage="Must be a number"
                language={language}
              />
              <NumberInput
                label="Disabled"
                value={fieldNumber}
                onChange={setFieldNumber}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">DateSelect</h3>
              <DateSelect
                label="Normal"
                placeholder="Select date"
                value={fieldDate}
                onDateChange={(d) =>
                  setFieldDate(d ? d.toISOString().slice(0, 10) : "")
                }
                language={language}
              />
              <DateSelect
                label="With error"
                placeholder="Select date"
                value={fieldDate}
                onDateChange={(d) =>
                  setFieldDate(d ? d.toISOString().slice(0, 10) : "")
                }
                hasError
                errMessage="Invalid date"
                language={language}
              />
              <DateSelect
                label="Disabled"
                placeholder="Select date"
                value={fieldDate}
                onDateChange={(d) =>
                  setFieldDate(d ? d.toISOString().slice(0, 10) : "")
                }
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">CheckboxField</h3>
              <CheckboxField
                label="Normal"
                checked={checkboxFieldChecked}
                onChange={(v) => setCheckboxFieldChecked(!!v)}
                language={language}
              />
              <CheckboxField
                label="With error"
                checked={checkboxFieldChecked}
                onChange={(v) => setCheckboxFieldChecked(!!v)}
                language={language}
              />
              <CheckboxField
                label="Disabled"
                checked={checkboxFieldChecked}
                onChange={(v) => setCheckboxFieldChecked(!!v)}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">CheckboxInput</h3>
              <CheckboxInput
                label="Normal"
                options={
                  selectOptions as {
                    value: string;
                    label?: string;
                    label_ar?: string;
                  }[]
                }
                value={checkboxInputVal}
                onChange={setCheckboxInputVal}
                language={language}
              />
              <CheckboxInput
                label="With error"
                options={
                  selectOptions as {
                    value: string;
                    label?: string;
                    label_ar?: string;
                  }[]
                }
                value={checkboxInputVal}
                onChange={setCheckboxInputVal}
                language={language}
              />
              <CheckboxInput
                label="Disabled"
                options={
                  selectOptions as {
                    value: string;
                    label?: string;
                    label_ar?: string;
                  }[]
                }
                value={checkboxInputVal}
                onChange={setCheckboxInputVal}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">RadioField</h3>
              <RadioField
                label="Normal"
                value="opt1"
                checked={radioInputVal === "opt1"}
                onChange={(v) => setRadioInputVal(v)}
                language={language}
              />
              <RadioField
                label="Disabled"
                value="opt1"
                checked={radioInputVal === "opt1"}
                onChange={(v) => setRadioInputVal(v)}
                disabled
                language={language}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">RadioInput</h3>
              <RadioInput
                label="Normal"
                options={selectOptions}
                value={radioInputVal}
                onChange={setRadioInputVal}
                language={language}
              />
              <RadioInput
                label="With error"
                options={selectOptions}
                value={radioInputVal}
                onChange={setRadioInputVal}
                hasError
                errorMessage="Please select an option"
                language={language}
              />
              <RadioInput
                label="Disabled"
                options={selectOptions}
                value={radioInputVal}
                onChange={setRadioInputVal}
                disabled
                language={language}
              />
            </div>
          </section>

          {/* Group 3 — UI Primitives */}
          <section className="flex flex-col gap-4">
            <h2 className={SECTION_TITLE}>Group 3 — UI Primitives</h2>
            <div className="flex flex-wrap gap-2">
              <Buttons
                title="Primary"
                type="primary"
                onClick={() => {}}
                language={language}
              />
              <Buttons
                title="Secondary"
                type="secondary"
                onClick={() => {}}
                language={language}
              />
              <Buttons
                title="Tertiary"
                type="tertiary"
                onClick={() => {}}
                language={language}
              />
              <Buttons
                title="Text link"
                type="text-link"
                onClick={() => {}}
                language={language}
              />
              <Buttons
                title="Delete"
                type="delete"
                onClick={() => {}}
                language={language}
              />
              <Buttons
                title="Disabled"
                disabled
                onClick={() => {}}
                language={language}
              />
            </div>
            <Typography
              variant="h2"
              text="Typography H2"
              text_ar="العنوان"
              language={language}
            />
            <Typography
              variant="text-md"
              text="Body text"
              color="dimmed"
              language={language}
            />
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

          {/* Group 5 — Shared Components (migrated) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>Group 5 — Shared Components</h2>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  CardTitle (G-5.9)
                </h3>
                <CardTitle
                  title="Card Title"
                  title_ar="عنوان البطاقة"
                  description="Card description"
                  description_ar="وصف البطاقة"
                  language={language}
                  variant="medium"
                  showBorder
                />
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  ModalTitle (G-5.4)
                </h3>
                <ModalTitle
                  label="Modal Title"
                  label_ar="عنوان النافذة"
                  language={language}
                />
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  ModalSteps (G-5.5)
                </h3>
                <ModalSteps
                  title="Step 1 of 3"
                  title_ar="الخطوة ١ من ٣"
                  subText="Sub text"
                  subText_ar="نص فرعي"
                  language={language}
                />
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  GenericCard (G-5.6)
                </h3>
                <GenericCard
                  title="Generic Card"
                  title_ar="بطاقة عامة"
                  variant="small"
                  language={language}
                  rowsData={[
                    { label: "Label 1", value: "Value 1" },
                    { label: "Label 2", value: "Value 2" },
                  ]}
                  showTitleSection
                  showBorder
                />
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  OwnerCard (G-5.2)
                </h3>
                <OwnerCard
                  owners={[
                    {
                      ownerId: "1",
                      ownerArgs: "",
                      name: "Owner Name",
                      name_ar: "اسم المالك",
                      fields: [
                        { label: "Field A", value: "Value A" },
                        { label: "Field B", value: "Value B" },
                      ],
                    },
                  ]}
                  title="Owners"
                  title_ar="المالكون"
                  language={language}
                />
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  PlotCard (G-5.3)
                </h3>
                <PlotCard
                  plots={[
                    {
                      plotId: "1",
                      plotArgs: "",
                      plotNumber: "Plot 101",
                      plotNumber_ar: "قطعة ١٠١",
                      fields: [
                        { label: "Area", value: "100 sqm" },
                        { label: "Location", value: "Abu Dhabi" },
                      ],
                    },
                  ]}
                  title="Plots"
                  title_ar="القطع"
                  language={language}
                />
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  Table (G-5.1)
                </h3>
                <Table
                  language={language}
                  columns={[
                    {
                      header: "Application",
                      header_ar: "الطلب",
                      accessorKey: "app",
                    },
                    {
                      header: "Status",
                      header_ar: "الحالة",
                      accessorKey: "status",
                    },
                  ]}
                  data={[
                    {
                      id: "2025001",
                      applicationTitle: "New Application",
                      applicationTitle_ar: "طلب جديد",
                      location: "Abu Dhabi",
                      location_ar: "أبوظبي",
                      timeDate: "21/06/2025",
                      daysRemaining: "5 Days",
                      daysRemaining_ar: "٥ أيام",
                      currentStep: 2,
                      additionalColumns: [
                        {
                          action: "Pending",
                          stepName: "Approval",
                          type: "pending",
                          version: "multi-row",
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Group 5 — ApplicationDetail (G-5.11) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>
              Group 5 — ApplicationDetail (G-5.11)
            </h2>
            <ApplicationDetail
              applicationId=""
              applicationTitle="Application Details"
              applicationTitle_ar="تفاصيل الطلب"
              language={language}
              theme="dark"
              onOwnerClick={(data) => console.log("ownerClick", data)}
              onPlotClick={(data) => console.log("plotClick", data)}
              onDocumentOpen={(url) => window.open(url, "_blank")}
              documentIcon={<Document width={24} height={24} />}
              checkIcon={<Check className="text-text-default" />}
              sendIcon={<Send className="text-text-default" />}
            />
          </section>

          {/* Group 5 — ViewOwnerDetail (G-5.10) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>
              Group 5 — ViewOwnerDetail (G-5.10)
            </h2>
            <ViewOwnerDetail
              language={language}
              mainTitle="Owner Detail"
              mainTitle_ar="تفاصيل المالك"
              plotCode="0-222-000-RCH9999"
              plotCode_ar="0-222-000-RCH9999"
              ownerText="Owner"
              ownerText_ar="المالك"
              viewButtonText="View"
              viewButtonText_ar="عرض"
              documentsText="Documents"
              documentsText_ar="المستندات"
              uaeIdText="UAE National Identity"
              uaeIdText_ar="الهوية الوطنية الإماراتية"
              passportText="Passport"
              passportText_ar="جواز السفر"
              owner={{
                name: "Talal Ahmed Salem",
                details: [
                  {
                    label: "UAE National ID",
                    label_ar: "الهوية الوطنية الإماراتية",
                    value: "78273890399292",
                  },
                  {
                    label: "MOI Unified Number",
                    label_ar: "رقم وزارة الداخلية الموحد",
                    value: "330928",
                  },
                  {
                    label: "Archive Number",
                    label_ar: "رقم الأرشيف",
                    value: "7921",
                  },
                  {
                    label: "Nationality",
                    label_ar: "الجنسية",
                    value: "United Arab Emirates",
                  },
                  {
                    label: "Special Nationality",
                    label_ar: "الجنسية الخاصة",
                    value: "No",
                  },
                  {
                    label: "Share",
                    label_ar: "الحصة",
                    value: "100% Allotment 50% Share",
                  },
                  {
                    label: "Right Hold Type",
                    label_ar: "نوع حق الحيازة",
                    value: "Ownership Musataha",
                  },
                ],
              }}
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

          {/* Group 4 — FilterBar (G-4.3) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>Group 4 — FilterBar (G-4.3)</h2>
            <div className="flex flex-col gap-4">
              <h3 className="text-bold-sm text-text-default">
                Light / English
              </h3>
              <FilterBar
                language={language}
                theme="light"
                searchValue={filterBarSearch}
                onSearchChange={(e) => setFilterBarSearch(e.target.value)}
                selectedSearchColumns={filterBarColumns}
                onSearchColumnsChange={setFilterBarColumns}
                searchColumns={["Column 1", "Column 2", "Column 3"]}
                filterOptions={["Actions", "Critical"]}
                sortOptions={["Newest First", "Oldest First"]}
                applicationOptions={["My Applications", "All Applications"]}
                filterButtonLabel="All Filters"
                filterButtonLabel_ar="جميع المرشحات"
                resetButtonLabel="Default Filter"
                resetButtonLabel_ar="المرشح الافتراضي"
                mobileColumnTitle="View Column"
                mobileColumnTitle_ar="عرض العمود"
                showResetButton
              />
              <h3 className="text-bold-sm text-text-default">Dark / Arabic</h3>
              <div className="bg-[#12121B] p-4 rounded" dir="rtl">
                <FilterBar
                  language="ar"
                  theme="dark"
                  searchColumns={["العمود 1", "العمود 2", "العمود 3"]}
                  filterOptions={["الإجراءات", "حرج"]}
                  sortOptions={["الأحدث أولاً", "الأقدم أولاً"]}
                  applicationOptions={["طلباتي", "جميع الطلبات"]}
                  filterButtonLabel_ar="جميع المرشحات"
                  resetButtonLabel_ar="المرشح الافتراضي"
                  searchPlaceholder_ar="بحث"
                  mobileColumnTitle_ar="عرض العمود"
                  showResetButton
                />
              </div>
            </div>
          </section>

          {/* Group 4 — Payment (G-4.4) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>Group 4 — Payment (G-4.4)</h2>
            <Payment
              language={language}
              stepInfo={{
                result: {
                  tenancyContract: {
                    type: "New Tenancy",
                    contractDate: "2024-01-01",
                    contractNumber: "CONTRACT-123",
                    ranchTenancyRegistrationFee: "500",
                    ranchTenancyRegistrationFeeInWord: "Five Hundred",
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    unitTypeValue: "M",
                    requestLandClassificationId: 1,
                    plotId: 1,
                    tenancyContractId: 1,
                    contractDuration: 12,
                  },
                  ranchInsuranceFee: "100",
                  ranchInsuranceFeeInWord: "One Hundred",
                },
              }}
              isStepInfoPending={false}
              isPaymentSubmitting={false}
              applicationId="APP-001"
              onSubmit={(data) => console.log("Payment onSubmit", data)}
              onPaymentSubmit={(val) =>
                console.log("Payment onPaymentSubmit", val.payload, val.meta)
              }
              onSaveDraft={() => console.log("Payment onSaveDraft")}
              onSuccess={() => console.log("Payment onSuccess")}
            />
          </section>

          {/* Group 4 — Signature (G-4.6) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>Group 4 — Signature (G-4.6)</h2>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  Dark theme / English
                </h3>
                <div className="bg-[#2A2A32] p-8">
                  <Signature
                    language={language}
                    title="Sign to Approve"
                    title_ar="وقع للموافقة"
                    buttonText="Approve"
                    buttonText_ar="موافق"
                    theme="dark"
                    onSubmit={(val) =>
                      console.log(
                        "Signature (dark/en) submitted",
                        val.signature.slice(0, 50),
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  Light theme / English
                </h3>
                <div className="bg-white p-8 border">
                  <Signature
                    language={language}
                    title="Sign to Approve"
                    title_ar="وقع للموافقة"
                    buttonText="Approve"
                    buttonText_ar="موافق"
                    theme="light"
                    onSubmit={(val) =>
                      console.log(
                        "Signature (light/en) submitted",
                        val.signature.slice(0, 50),
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  Dark theme / Arabic
                </h3>
                <div className="bg-[#12121B] p-8">
                  <Signature
                    language="ar"
                    title="Sign to Approve"
                    title_ar="وقع للموافقة"
                    buttonText="Approve"
                    buttonText_ar="موافق"
                    theme="dark"
                    onSubmit={(val) =>
                      console.log(
                        "Signature (dark/ar) submitted",
                        val.signature.slice(0, 50),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Group 4 — UploadDocuments (G-4.7) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>Group 4 — UploadDocuments (G-4.7)</h2>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  Default type / English
                </h3>
                <div className="bg-[#2A2A32] p-8">
                  <UploadDocuments
                    language="en"
                    theme="dark"
                    type="default"
                    documents={[
                      {
                        documentName: "Passport",
                        documentName_ar: "جواز السفر",
                      },
                      {
                        documentName: "National ID",
                        documentName_ar: "الهوية الوطنية",
                        allowedTypes: ["pdf", "jpg", "png"],
                        fileTypeErrorMessage: "Only PDF, JPG, or PNG accepted.",
                        fileTypeErrorMessage_ar: "يُقبل PDF أو JPG أو PNG فقط.",
                      },
                      {
                        documentName: "Proof of Address",
                        documentName_ar: "إثبات العنوان",
                        fileSize: 500000,
                        fileSizeErrorMessage: "File must be less than 500 KB.",
                        fileSizeErrorMessage_ar:
                          "يجب أن يكون الملف أقل من 500 كيلوبايت.",
                      },
                    ]}
                    onFileChange={(val) =>
                      console.log(
                        "UploadDocuments onFileChange",
                        val.uploadUrl,
                        val.file,
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <h3 className="text-bold-m text-text-default mb-2">
                  Base type / Arabic (RTL)
                </h3>
                <div className="bg-[#1E1E26] p-8">
                  <UploadDocuments
                    language="ar"
                    theme="dark"
                    type="base"
                    documents={[
                      {
                        documentName: "Contract",
                        documentName_ar: "العقد",
                        isUploaded: true,
                      },
                      {
                        documentName: "Invoice",
                        documentName_ar: "الفاتورة",
                        allowedTypes: ["PDF"],
                        fileTypeErrorMessage: "Only PDF accepted.",
                        fileTypeErrorMessage_ar: "يُقبل PDF فقط.",
                      },
                    ]}
                    onFileChange={(val) =>
                      console.log("UploadDocuments (ar) onFileChange", val)
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Group 4 — PaymentDetails (G-4.10) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>
              Group 4 — PaymentDetails (G-4.10)
            </h2>
            <div className="flex flex-col gap-8">
              <h3 className="text-bold-m text-text-default">
                Pending payment (no receipt) — en
              </h3>
              <PaymentDetails
                language={language}
                applicationId="APP-001"
                variant="medium"
                drawerSize="layer1"
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
                showButtons
                buttons={[
                  {
                    title: "Back",
                    title_ar: "رجوع",
                    type: "secondary",
                    onClick: () => console.log("PaymentDetails Back clicked"),
                  },
                  {
                    title: "Submit",
                    title_ar: "إرسال",
                    type: "primary",
                    onClick: () => console.log("PaymentDetails Submit clicked"),
                  },
                ]}
                onDownloadFile={(url) => setPaymentDetailsDownloadUrl(url)}
                onVerifyComplete={() =>
                  console.log("PaymentDetails verify complete")
                }
                onOverrideComplete={() =>
                  console.log("PaymentDetails override complete")
                }
              />
              <h3 className="text-bold-m text-text-default">
                Loading state
              </h3>
              <PaymentDetails
                language={language}
                applicationId="APP-002"
                payments={[]}
                isLoading
                onDownloadFile={(url) => setPaymentDetailsDownloadUrl(url)}
              />
            </div>
          </section>

          {/* Group 4 — ViewPlotDetail (G-4.8) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>
              Group 4 — ViewPlotDetail (G-4.8)
            </h2>
            <div className="flex flex-col gap-8">
              <h3 className="text-bold-m text-text-default">
                Static props (dark/en) — no API call
              </h3>
              <ViewPlotDetail
                language={language}
                theme="dark"
                plotTitle="Plot"
                plotTitle_ar="القطعة"
                plotIds={[]}
                plotLeftDetails={[
                  {
                    label: "Plot Address",
                    label_ar: "عنوان القطعة",
                    value: "0-222-000-RCH9999",
                  },
                  {
                    label: "Zone/District",
                    label_ar: "المنطقة/الحي",
                    value: "Al Layyan",
                  },
                  {
                    label: "Sector",
                    label_ar: "القطاع",
                    value: "Seih Al Sedeirah 64",
                  },
                ]}
                plotBottomDetails={[
                  { label: "Plot Number", label_ar: "رقم القطعة", value: "C1" },
                  {
                    label: "Municipality",
                    label_ar: "البلدية",
                    value: "Abu Dhabi City",
                  },
                  {
                    label: "Allocation Type",
                    label_ar: "نوع التخصيص",
                    value: "Commercial",
                  },
                  {
                    label: "Land Use",
                    label_ar: "استخدام الأرض",
                    value: "Multi-usage",
                  },
                  {
                    label: "Investment Area Name",
                    label_ar: "اسم المنطقة الاستثمارية",
                    value: "-",
                  },
                  {
                    label: "Expat Ownership Percentage",
                    label_ar: "نسبة ملكية الوافدين",
                    value: "No",
                  },
                  {
                    label: "Plot File Number",
                    label_ar: "رقم ملف القطعة",
                    value: "-",
                  },
                  {
                    label: "Area",
                    label_ar: "المساحة",
                    value: "314,939.11 Sq.M / 3,389,962.71 Sq.Ft",
                  },
                  {
                    label: "Construction Status",
                    label_ar: "حالة البناء",
                    value: "Not Constructed",
                  },
                ]}
                owner={{
                  name: "Talal Ahmed Salem",
                  details: [
                    {
                      label: "UAE National ID",
                      label_ar: "الهوية الوطنية الإماراتية",
                      value: "78273890399292",
                    },
                    {
                      label: "MOI Unified Number",
                      label_ar: "رقم وزارة الداخلية الموحد",
                      value: "330928",
                    },
                    {
                      label: "Archive Number",
                      label_ar: "رقم الأرشيف",
                      value: "7921",
                    },
                    {
                      label: "Nationality",
                      label_ar: "الجنسية",
                      value: "United Arab Emirates",
                    },
                    {
                      label: "Special Nationality",
                      label_ar: "الجنسية الخاصة",
                      value: "No",
                    },
                    {
                      label: "Share",
                      label_ar: "الحصة",
                      value: "100% Allotment 50% Share",
                    },
                    {
                      label: "Right Hold Type",
                      label_ar: "نوع حق الحيازة",
                      value: "Ownership Musataha",
                    },
                  ],
                }}
                ownerText="Owner"
                ownerText_ar="المالك"
                showOwnerDetails={true}
              />

              <h3 className="text-bold-m text-text-default">
                Static props (dark/ar) — RTL
              </h3>
              <ViewPlotDetail
                language="ar"
                theme="dark"
                plotTitle="Plot"
                plotTitle_ar="القطعة"
                plotIds={[]}
                plotLeftDetails={[
                  {
                    label: "Plot Address",
                    label_ar: "عنوان القطعة",
                    value: "0-222-000-RCH9999",
                  },
                  {
                    label: "Zone/District",
                    label_ar: "المنطقة/الحي",
                    value: "Al Layyan",
                  },
                  {
                    label: "Sector",
                    label_ar: "القطاع",
                    value: "Seih Al Sedeirah 64",
                  },
                ]}
                plotBottomDetails={[
                  { label: "Plot Number", label_ar: "رقم القطعة", value: "C1" },
                  {
                    label: "Municipality",
                    label_ar: "البلدية",
                    value: "Abu Dhabi City",
                  },
                  {
                    label: "Allocation Type",
                    label_ar: "نوع التخصيص",
                    value: "Commercial",
                  },
                  {
                    label: "Land Use",
                    label_ar: "استخدام الأرض",
                    value: "Multi-usage",
                  },
                ]}
                owner={{
                  name: "Talal Ahmed Salem",
                  details: [
                    {
                      label: "UAE National ID",
                      label_ar: "الهوية الوطنية الإماراتية",
                      value: "78273890399292",
                    },
                    {
                      label: "Nationality",
                      label_ar: "الجنسية",
                      value: "United Arab Emirates",
                    },
                  ],
                }}
                ownerText="Owner"
                ownerText_ar="المالك"
                showOwnerDetails={true}
              />

              <h3 className="text-bold-m text-text-default">
                showOwnerDetails = false
              </h3>
              <ViewPlotDetail
                language={language}
                theme="dark"
                plotTitle="Plot (no owner)"
                plotTitle_ar="القطعة (بدون مالك)"
                plotIds={[]}
                plotLeftDetails={[
                  {
                    label: "Plot Address",
                    label_ar: "عنوان القطعة",
                    value: "0-222-000-RCH9999",
                  },
                ]}
                plotBottomDetails={[
                  { label: "Plot Number", label_ar: "رقم القطعة", value: "C1" },
                  {
                    label: "Municipality",
                    label_ar: "البلدية",
                    value: "Abu Dhabi City",
                  },
                ]}
                showOwnerDetails={false}
              />
            </div>
          </section>

          {/* Group 4 — ApplicationSummary (G-4.11) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>
              Group 4 — ApplicationSummary (G-4.11)
            </h2>
            <div className="flex flex-col gap-8">
              <h3 className="text-bold-m text-text-default">Default (EN) — 2 columns</h3>
              <ApplicationSummary
                title="Application Summary"
                title_ar="ملخص الطلب"
                language={language}
                DocumentsComponent={UploadDocuments}
                data={[
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
                        applicationDate: "2025-01-15",
                        applicationDate_ar: "2025-01-15",
                        referenceNumber: "REF-456",
                        referenceNumber_ar: "REF-456",
                        showButton: true,
                        onButtonClick: () => console.log("View clicked"),
                      },
                    },
                    {
                      type: "plot",
                      data: {
                        title: "Plot",
                        title_ar: "قطعة الأرض",
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
                        title_ar: "الملاك",
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
                        onPressAction: ({ action, owner }) =>
                          console.log(action, owner),
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
                          { key: "field", label: "Field", label_ar: "الحقل" },
                          { key: "col1", label: "Value 1", label_ar: "القيمة 1" },
                          { key: "col2", label: "Value 2", label_ar: "القيمة 2" },
                          { key: "col3", label: "Value 3", label_ar: "القيمة 3" },
                        ],
                        rowsData: [
                          {
                            label: "Identity Details",
                            label_ar: "تفاصيل الهوية",
                            button: { title: "Hello", onClick: () => alert("hello") },
                            extraItems: [
                              { label: "UAE National ID", label_ar: "الهوية الوطنية الإماراتية", value: "78273890399292", value_ar: "78273890399292" },
                              { label: "MOI Unified Number", label_ar: "رقم وزارة الداخلية الموحد", value: "330928", value_ar: "330928" },
                            ],
                          },
                        ],
                        showFooterButtons: true,
                        footerButton: [
                          { title: "Edit", title_ar: "تعديل", onClick: () => console.log("Edit clicked") },
                          { title: "View", title_ar: "عرض", onClick: () => console.log("View clicked") },
                        ],
                        handlePaginationInternally: false,
                        showPagination: true,
                        currentPage: 1,
                        totalPages: 5,
                        pageSize: 5,
                        onPageChange: (page: number) => console.log(page),
                      },
                    },
                  ],
                  [
                    {
                      type: "genericCard",
                      data: {
                        title: "Tenant Info",
                        title_ar: "معلومات المستأجر",
                        cardTitleLabel: "Tenant Info",
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
                          { title: "Edit", title_ar: "تعديل", onClick: () => console.log("Edit clicked") },
                          { title: "View", title_ar: "عرض", onClick: () => console.log("View clicked") },
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
                ]}
              />
              <h3 className="text-bold-m text-text-default">Arabic RTL — 1 column</h3>
              <div dir="rtl">
                <ApplicationSummary
                  title="Application Summary"
                  title_ar="ملخص الطلب"
                  language="ar"
                  DocumentsComponent={UploadDocuments}
                  data={[
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
                          showButton: false,
                        },
                      },
                      {
                        type: "interactionHistory",
                        data: {
                          totalCompletedSteps: 1,
                          totalSteps: 3,
                          wfiStepList: [
                            {
                              title: "Registration",
                              title_ar: "التسجيل",
                              stepConst: "Step1",
                              stepStatusE: "Completed",
                              stepStatusA: "مكتمل",
                              isCompleted: true,
                              completedByCustomerNameE: "John Doe",
                              completedByCustomerNameA: "جون دو",
                              completeDate: "2025-01-15",
                            },
                            {
                              title: "Approval",
                              title_ar: "الموافقة",
                              stepConst: "Step2",
                              stepStatusE: "Pending",
                              stepStatusA: "قيد الانتظار",
                              isCurrent: false,
                            },
                          ],
                        },
                      },
                    ],
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Group 5 — ApplicationMessage (G-5.12) */}
          <section className="flex flex-col gap-6">
            <h2 className={SECTION_TITLE}>
              Group 5 — ApplicationMessage (G-5.12)
            </h2>
            <div className="flex flex-col gap-4">
              <h3 className="text-bold-m text-text-default">
                Success (default)
              </h3>
              <ApplicationMessage
                status="success"
                title="Application Submitted Successfully"
                description="Your application has been submitted and is under review."
                language={language}
                successIcon={
                  <ApplicationSuccess className="text-status-success-solid" />
                }
                errorIcon={
                  <ApplicationError className="text-status-failed-solid" />
                }
                informationIcon={
                  <ApplicationInformation className="text-status-pending-solid" />
                }
                actionIcon={
                  <ApplicationAction className="text-status-action-solid" />
                }
              />
              <h3 className="text-bold-m text-text-default">Error</h3>
              <ApplicationMessage
                status="error"
                title="Submission Failed"
                description="There was an error while submitting your application. Please try again."
                language={language}
                errorIcon={
                  <ApplicationError className="text-status-failed-solid" />
                }
              />
              <h3 className="text-bold-m text-text-default">
                Information with text input
              </h3>
              <ApplicationMessage
                status="information"
                title="Additional Information Required"
                description="Please provide the missing details to continue."
                type="text"
                fieldType="text"
                label="Reference Number"
                label_ar="رقم المرجع"
                value=""
                onInputChange={(value) =>
                  console.log("ApplicationMessage input:", value)
                }
                language={language}
                informationIcon={
                  <ApplicationInformation className="text-status-pending-solid" />
                }
              />
              <h3 className="text-bold-m text-text-default">
                Action with checkbox
              </h3>
              <ApplicationMessage
                status="action"
                title="Confirm Declaration"
                description="Please confirm the following before proceeding."
                type="checkbox"
                label="I agree to the terms"
                label_ar="أوافق على الشروط"
                value={[]}
                options={[
                  {
                    label: "Terms & Conditions",
                    label_ar: "الشروط والأحكام",
                    value: "terms",
                  },
                  {
                    label: "Privacy Policy",
                    label_ar: "سياسة الخصوصية",
                    value: "privacy",
                  },
                ]}
                onInputChange={(value) =>
                  console.log("ApplicationMessage checkbox:", value)
                }
                language={language}
                actionIcon={
                  <ApplicationAction className="text-status-action-solid" />
                }
              />
              <h3 className="text-bold-m text-text-default">
                Action with radio
              </h3>
              <ApplicationMessage
                status="action"
                title="Choose an Option"
                description="Please select one of the following options to proceed."
                type="radio"
                label="Decision"
                label_ar="القرار"
                value="approve"
                options={[
                  { label: "Approve", label_ar: "موافقة", value: "approve" },
                  { label: "Reject", label_ar: "رفض", value: "reject" },
                ]}
                onInputChange={(value) =>
                  console.log("ApplicationMessage radio:", value)
                }
                language={language}
                actionIcon={
                  <ApplicationAction className="text-status-action-solid" />
                }
              />
              <h3 className="text-bold-m text-text-default">
                Action with button
              </h3>
              <ApplicationMessage
                status="action"
                title="Next Step Required"
                description="Click the button below to continue to the next step."
                type="button"
                label="Continue"
                label_ar="متابعة"
                onClick={() => console.log("ApplicationMessage button clicked")}
                language={language}
                actionIcon={
                  <ApplicationAction className="text-status-action-solid" />
                }
              />
              <h3 className="text-bold-m text-text-default">Arabic RTL</h3>
              <ApplicationMessage
                language="ar"
                status="success"
                title="تم إرسال الطلب بنجاح"
                description="تم إرسال طلبك وهو الآن قيد المراجعة."
                type="button"
                label="حسناً"
                successIcon={
                  <ApplicationSuccess className="text-status-success-solid" />
                }
              />
            </div>
          </section>

          {/* G-5.14 SearchPlot */}
          {/* <section className="flex flex-col gap-6">
          <h2 className={SECTION_TITLE}>G-5.14 SearchPlot</h2>
          <SearchPlot
            language={language}
            title="Search Plot"
            title_ar="العثور على قطعة أرض"
            subtitle=""
            initialOwnerType="plot"
            enabledTabs={{ plot: true, company: true, owner: true }}
            ownerTypeOptions={{
              plot: "By Plot",
              plot_ar: "حسب قطعة الأرض",
              company: "By Company Owner",
              company_ar: "حسب مالك الشركة",
              owner: "By Owner",
              owner_ar: "حسب المالك",
              randomAllocation: "Random Allocation",
              randomAllocation_ar: "التخصيص العشوائي",
            }}
            selected={[]}
            onSubmit={(val) => console.log("SearchPlot onSubmit", val)}
          />
        </section> */}

          {/* 0.10 Toast */}
          <section className="flex flex-col gap-3">
            <h2 className={SECTION_TITLE}>0.10 Toast</h2>
            <div className="flex flex-col gap-2">
              <Toast message="Success: operation completed" status="success" />
              <Toast message="Error: something went wrong" status="error" />
              <Toast
                message="Information: please review"
                status="information"
              />
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
