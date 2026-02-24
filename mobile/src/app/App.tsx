import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Label } from "~/src/ui/Label";
import { Caption } from "~/src/ui/Caption";
import { Tooltip } from "~/src/ui/Tooltip";
import { Checkbox } from "~/src/ui/Checkbox";
import { Radio } from "~/src/ui/Radio";
import { CheckRadioLabel } from "~/src/ui/CheckRadioLabel";
import { AddButton } from "~/src/ui/AddButton";
import { DateInput } from "~/src/ui/DateInput";
import { Fields } from "~/src/ui/Fields";
import { Toast } from "~/src/ui/Toast";
import type { TooltipDirectionType } from "@shared/types";

const sectionTitleStyle = { marginBottom: 8, fontSize: 18, fontWeight: "600" as const };

export default function App() {
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

  const selectOptions = [
    { value: "a", label: "Option A", label_ar: "الخيار أ" },
    { value: "b", label: "Option B", label_ar: "الخيار ب" },
    { value: "c", label: "Option C", label_ar: "الخيار ج" },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1, marginTop: 50 }}>
      <QueryClientProvider client={new QueryClient()}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* 0.1 Label */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.1 Label</Text>
            <Label
              label="Field label"
              label_ar="تسمية الحقل"
              required
              language={language}
            />
            <Label
              label="With info icon"
              label_ar="مع أيقونة المعلومات"
              showInfoIcon
              tooltipText="Extra information here"
              tooltipText_ar="معلومات إضافية"
              tooltipDirection={language === "ar" ? "top-right" : "top-left"}
              language={language}
            />
            <Label
              label="Disabled label"
              label_ar="تسمية معطلة"
              disabled
              language={language}
            />
          </View>

          {/* 0.2 Caption */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.2 Caption</Text>
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
            <View style={styles.buttonRow}>
              <Pressable style={styles.toggleBtn} onPress={() => setCaptionError((e) => !e)}>
                <Text style={styles.toggleBtnText}>Toggle error</Text>
              </Pressable>
              <Pressable style={styles.toggleBtn} onPress={() => setCaptionDisabled((d) => !d)}>
                <Text style={styles.toggleBtnText}>Toggle disabled</Text>
              </Pressable>
              <Pressable style={styles.toggleBtn} onPress={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}>
                <Text style={styles.toggleBtnText}>{language === "en" ? "العربية" : "English"}</Text>
              </Pressable>
            </View>
          </View>

          {/* 0.3 Tooltip */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.3 Tooltip</Text>
            <View style={styles.rowWrap}>
              <View style={styles.tooltipWrap}>
                <Tooltip text="Tooltip text" text_ar="نص التلميح" language={language} direction="none" />
              </View>
              <View style={styles.tooltipWrap}>
                <Tooltip text="Top center" direction="top-center" language={language} />
              </View>
              <View style={styles.tooltipWrap}>
                <Tooltip text="Bottom center" direction="bottom-center" language={language} />
              </View>
              <View style={styles.tooltipWrap}>
                <Tooltip text="Dynamic" direction={tooltipDirection} language={language} />
              </View>
            </View>
          </View>

          {/* 0.4 Checkbox */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.4 Checkbox</Text>
            <View style={styles.rowWrap}>
              <Checkbox
                id="cb-controlled"
                checked={checkboxChecked}
                onChange={(_, checked) => setCheckboxChecked(!!checked)}
              />
              <Text style={styles.hint}>Controlled ({checkboxChecked ? "checked" : "unchecked"})</Text>
              <Checkbox id="cb-uncontrolled" onChange={() => {}} />
              <Text style={styles.hint}>Uncontrolled</Text>
              <Checkbox id="cb-disabled" disabled={checkboxDisabled} onChange={() => {}} />
              <Text style={styles.hint}>Disabled</Text>
              <Checkbox id="cb-error" hasError={checkboxError} onChange={() => {}} />
              <Text style={styles.hint}>Error</Text>
            </View>
            <View style={styles.buttonRow}>
              <Pressable style={styles.toggleBtn} onPress={() => setCheckboxChecked((c) => !c)}>
                <Text style={styles.toggleBtnText}>Toggle checked</Text>
              </Pressable>
              <Pressable style={styles.toggleBtn} onPress={() => setCheckboxDisabled((d) => !d)}>
                <Text style={styles.toggleBtnText}>Toggle disabled</Text>
              </Pressable>
              <Pressable style={styles.toggleBtn} onPress={() => setCheckboxError((e) => !e)}>
                <Text style={styles.toggleBtnText}>Toggle error</Text>
              </Pressable>
            </View>
          </View>

          {/* 0.5 Radio */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.5 Radio</Text>
            <View style={styles.rowWrap}>
              {["opt1", "opt2", "opt3"].map((id) => (
                <Radio
                  key={id}
                  id={id}
                  checked={radioSelected === id}
                  onChange={(id) => setRadioSelected(id)}
                />
              ))}
              <Radio id="r-disabled" disabled onChange={() => {}} />
              <Text style={styles.hint}>Disabled</Text>
              <Radio id="r-error" hasError onChange={() => {}} />
              <Text style={styles.hint}>Error</Text>
            </View>
            <Text style={styles.hint}>Selected: {radioSelected}</Text>
          </View>

          {/* 0.6 CheckRadioLabel */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.6 CheckRadioLabel</Text>
            <CheckRadioLabel label="Option label" label_ar="تسمية الخيار" language={language} />
            <CheckRadioLabel label="Disabled label" label_ar="تسمية معطلة" disabled language={language} />
          </View>

          {/* 0.7 AddButton */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.7 AddButton</Text>
            <View style={styles.rowWrap}>
              <AddButton onClick={() => setAddButtonClicks((c) => c + 1)} />
              <AddButton
                disabled={addButtonDisabled}
                onClick={() => setAddButtonClicks((c) => c + 1)}
              />
              <Text style={styles.hint}>Clicks: {addButtonClicks} | Disabled: {addButtonDisabled ? "yes" : "no"}</Text>
            </View>
            <Pressable style={styles.toggleBtn} onPress={() => setAddButtonDisabled((d) => !d)}>
              <Text style={styles.toggleBtnText}>Toggle disabled</Text>
            </Pressable>
          </View>

          {/* 0.8 DateInput */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.8 DateInput</Text>
            <DateInput
              placeholder="Select date"
              placeholder_ar="اختر التاريخ"
              label="Date field"
              label_ar="حقل التاريخ"
              value={dateValue}
              onDateChange={(d) => setDateValue(d ? d.toISOString().slice(0, 10) : "")}
              required
              infoText="Pick a date"
              infoText_ar="اختر تاريخاً"
              caption="Optional caption"
              caption_ar="تسمية اختيارية"
              captionPosition="left"
              language={language}
              testId="date-input-demo"
            />
            <Text style={styles.hint}>Value: {dateValue || "—"}</Text>
          </View>

          {/* 0.9 Fields */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.9 Fields</Text>
            <Fields type="text" placeholder="Text placeholder" value={fieldText} onChange={setFieldText} hasError={fieldsError} errorMessage="Invalid value" language={language} testId="field-text" />
            <Fields type="textarea" placeholder="Textarea placeholder" value={fieldTextArea} onChange={setFieldTextArea} language={language} />
            <Fields type="select" placeholder="Select..." value={fieldSelect} onChange={setFieldSelect} options={selectOptions} selectType="single" language={language} />
            <Fields type="select" placeholder="Multi select..." value={fieldMultiSelect} onChange={setFieldMultiSelect} options={selectOptions} selectType="multi" language={language} />
            <Fields type="number" placeholder="Number" value={fieldNumber} onChange={setFieldNumber} language={language} />
            <Fields type="currency" placeholder="0.00" value={fieldCurrency} onChange={setFieldCurrency} currencySymbol="AED" language={language} />
            <Fields type="phone" placeholder="Phone" value={fieldPhone} onChange={setFieldPhone} phoneCode="+971" language={language} />
            <Fields type="date" placeholder="Select date" value={fieldDate} onChange={setFieldDate} language={language} />
            <Fields type="uaeid" placeholder="000-0000-0000000-0" value={fieldUaeId} onChange={setFieldUaeId} language={language} />
            <Pressable style={styles.toggleBtn} onPress={() => setFieldsError((e) => !e)}>
              <Text style={styles.toggleBtnText}>Toggle Fields error</Text>
            </Pressable>
          </View>

          {/* 0.10 Toast */}
          <View style={styles.section}>
            <Text style={sectionTitleStyle}>0.10 Toast</Text>
            <Toast message="Success: operation completed" status="success" />
            <Toast message="Error: something went wrong" status="error" />
            <Toast message="Information: please review" status="information" />
            <Toast message="Action: confirm to continue" status="action" />
            <Text style={styles.hint}>Toasts auto-hide in 5s or close via ×</Text>
          </View>
        </ScrollView>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  section: { marginBottom: 28 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 8 },
  tooltipWrap: { marginRight: 8, marginBottom: 8 },
  buttonRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 6 },
  toggleBtnText: { fontSize: 12 },
  hint: { fontSize: 12, color: "#666", marginTop: 4 },
});
