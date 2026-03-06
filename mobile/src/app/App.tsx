import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.1 — Label</Text>

              <Text style={styles.variantLabel}>Default</Text>
              <Label label="Field Label" label_ar="تسمية الحقل" language={language} />

              <Text style={styles.variantLabel}>required=true</Text>
              <Label label="Required Field" label_ar="حقل مطلوب" required language={language} />

              <Text style={styles.variantLabel}>showInfoIcon=true + tooltipText</Text>
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
              <Label label="Disabled Label" label_ar="تسمية معطلة" disabled language={language} />

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

              <Text style={styles.variantLabel}>language=ar + required + showInfoIcon</Text>
              <Label
                label="Full Label"
                label_ar="تسمية كاملة"
                required
                showInfoIcon
                tooltipText="Tooltip"
                tooltipText_ar="تلميحة"
                language="ar"
              />
            </View>

            {/* ── G-0.2 Caption ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.2 — Caption</Text>

              <Text style={styles.variantLabel}>captionLeft only</Text>
              <Caption captionLeft="Left caption" captionLeft_ar="تعليق يسار" language={language} />

              <Text style={styles.variantLabel}>captionRight only</Text>
              <Caption captionRight="Right caption" captionRight_ar="تعليق يمين" language={language} />

              <Text style={styles.variantLabel}>captionLeft + captionRight</Text>
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

              <Text style={styles.variantLabel}>hasError — error replaces captionLeft</Text>
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
            </View>

            {/* ── G-0.3 Tooltip ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.3 — Tooltip (all 13 directions)</Text>
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
            </View>

            {/* ── G-0.4 Checkbox ── */}
            <View style={styles.section}>
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
              <Checkbox id="cb-dis-un" checked={false} disabled onChange={() => {}} />

              <Text style={styles.variantLabel}>disabled + checked</Text>
              <Checkbox id="cb-dis-ch" checked disabled onChange={() => {}} />

              <Text style={styles.variantLabel}>hasError + unchecked</Text>
              <Checkbox id="cb-err-un" checked={false} hasError onChange={() => {}} />

              <Text style={styles.variantLabel}>hasError + checked</Text>
              <Checkbox id="cb-err-ch" checked hasError onChange={() => {}} />
            </View>

            {/* ── G-0.5 Radio ── */}
            <View style={styles.section}>
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
              <Radio id="r-dis-un" checked={false} disabled onChange={() => {}} />

              <Text style={styles.variantLabel}>disabled + checked</Text>
              <Radio id="r-dis-ch" checked disabled onChange={() => {}} />

              <Text style={styles.variantLabel}>hasError + unchecked</Text>
              <Radio id="r-err-un" checked={false} hasError onChange={() => {}} />

              <Text style={styles.variantLabel}>hasError + checked</Text>
              <Radio id="r-err-ch" checked hasError onChange={() => {}} />
            </View>

            {/* ── G-0.6 CheckRadioLabel ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-0.7 AddButton ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>G-0.7 — AddButton</Text>

              <Text style={styles.variantLabel}>Default (enabled)</Text>
              <AddButton onClick={() => {}} />

              <Text style={styles.variantLabel}>disabled=true</Text>
              <AddButton disabled onClick={() => {}} />
            </View>

            {/* ── G-0.8 Bk_DateInput ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-0.9 Fields ── */}
            <View style={styles.section}>
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
                  setFMulti(typeof v === "string" ? (v ? v.split(",") : []) : (v as string[]))
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
            </View>

            {/* ═══════════════════════════════════════════════ */}
            {/* G-2 — Form Components                          */}
            {/* ═══════════════════════════════════════════════ */}

            {/* ── G-2.1 TextInput ── */}
            <View style={styles.section}>
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

              <Text style={styles.variantLabel}>showInfoIcon + tooltipText</Text>
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
            </View>

            {/* ── G-2.2 PhoneInput ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-2.3 TextArea ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-2.4 Select ── */}
            <View style={styles.section}>
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

              <Text style={styles.variantLabel}>showInfoIcon + tooltipText</Text>
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

              <Text style={styles.variantLabel}>title + title_ar (section header)</Text>
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
            </View>

            {/* ── G-2.5 MultiSelect ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-2.6 CurrencyInput ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-2.7 NumberInput ── */}
            <View style={styles.section}>
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

              <Text style={styles.variantLabel}>captionLeft + captionRight</Text>
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
            </View>

            {/* ── G-2.8 DateSelect ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-2.9 CheckboxField ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-2.10 CheckboxInput ── */}
            <View style={styles.section}>
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

              <Text style={styles.variantLabel}>showInfoIcon + tooltipText</Text>
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

              <Text style={styles.variantLabel}>captionLeft + captionRight</Text>
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
            </View>

            {/* ── G-2.11 RadioField ── */}
            <View style={styles.section}>
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
            </View>

            {/* ── G-2.12 RadioInput ── */}
            <View style={styles.section}>
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

              <Text style={styles.variantLabel}>showInfoIcon + tooltipText</Text>
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

              <Text style={styles.variantLabel}>captionLeft + captionRight</Text>
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
            </View>
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
