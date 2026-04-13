import React from "react";
import { View, Image, TextInput, TouchableOpacity } from "react-native";
import { Text } from "~/src/ui/Text";
import type {
  ApprovalModalProps,
  AuditRemarksProps,
} from "@shared/types";
import { Buttons } from "../Buttons";
import DocumentIcon from "~/assets/svg/icons/Document";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { ApprovalModalProps, AuditRemarksProps };

const AuditRemarks: React.FC<ApprovalModalProps & AuditRemarksProps> = ({
  agent,
  applicationDetails = [],
  plots = [],
  owners = [],
  documents = [],
  title,
  title_ar = "",
  language = "en",
  value,
  registrationRemarks,
  onChange,
  theme = "dark",
  onOwnerClick,
  onPlotClick,
  onDocumentPress,
}) => {
  const isRtl = language === "ar";

  return (
    <View className="w-full" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {title ? (
        <Text className="text-heading-h1 font-bold mb-8 text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar}
          />
        </Text>
      ) : null}

      <View className="flex flex-col gap-2 mb-8">
        <Text className="text-heading-h4 font-bold text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value="Agent"
            value_ar="الوكيل"
          />
        </Text>
        <View className="flex flex-row gap-m items-center px-s py-xs bg-cards-base-l1 rounded-[5px]">
          {agent.image ? (
            <Image
              source={{ uri: agent.image }}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-cards-base-l1" />
          )}
          <View className="flex flex-row gap-xs">
            <Text className="text-m text-text-default font-normal">
              {agent.name}
            </Text>
            <Text className="text-m text-text-dimmed font-normal">|</Text>
            <Text className="text-m text-text-link font-normal">
              {agent.email}
            </Text>
            <Text className="text-m text-text-dimmed font-normal">|</Text>
            <Text className="text-m text-text-default font-normal">
              {agent.phone}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-heading-h3 font-bold mb-4 text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value="Auditor Remarks"
            value_ar="ملاحظات المدقق"
          />
        </Text>
        <TextInput
          className="w-full rounded-xs border border-form-fields-input-form-border bg-form-fields-input-form-bg text-text-default text-m p-m"
          placeholder=""
          multiline
          numberOfLines={3}
          value={value}
          onChangeText={onChange}
        />
        <View className="border-b border-text-dimmed mt-8" />
      </View>

      <View className="mb-8">
        <Text className="text-heading-h3 font-bold mb-4 text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value="Application Details"
            value_ar="تفاصيل الطلب"
          />
        </Text>
        <View className="rounded-xs bg-cards-base-l1 border border-cards-stroke px-l py-m text-text-default">
          {applicationDetails?.map((detail, idx) => (
            <View key={idx}>
              <View className="flex flex-row gap-s border-b border-text-dimmed pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Application Number"
                    value_ar="رقم الطلب"
                  />
                </Text>
                <Text className="w-1/2 text-m">{detail.applicationNumber}</Text>
              </View>
              <View className="flex flex-row gap-s border-b border-text-dimmed pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Application Date"
                    value_ar="تاريخ الطلب"
                  />
                </Text>
                <Text className="w-1/2 text-m">{detail.applicationDate}</Text>
              </View>
              <View className="flex flex-row gap-s pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Reference Number"
                    value_ar="رقم المرجع"
                  />
                </Text>
                <Text className="w-1/2 text-m">{detail.referenceNumber}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-heading-h3 font-bold mb-4 text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value="Plot"
            value_ar="قطعة أرض"
          />
        </Text>
        {plots?.map((plot, idx) => (
          <View
            key={idx}
            className="rounded-xs bg-cards-base-l1 text-text-default border border-cards-stroke px-l py-m mb-4"
          >
            <View className="flex flex-row justify-between items-center mb-3">
              <Text className="text-bold-ml">{plot.code}</Text>
              <Buttons
                type="secondary"
                theme={theme}
                language={language}
                title={language === "ar" ? "عرض" : "View"}
                title_ar="عرض"
                size="s"
                onClick={() => {
                  onPlotClick?.({ PlotData: plot, action: "view" });
                }}
              />
            </View>
            <View>
              <View className="flex flex-row gap-s border-b border-text-dimmed pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Municipality"
                    value_ar="البلدية"
                  />
                </Text>
                <Text className="w-1/2 text-m">{plot.municipality}</Text>
              </View>
              <View className="flex flex-row gap-s border-b border-text-dimmed pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Zone/District"
                    value_ar="المنطقة / الحي"
                  />
                </Text>
                <Text className="w-1/2 text-m">{plot.zone}</Text>
              </View>
              <View className="flex flex-row gap-s border-b border-text-dimmed pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Sector"
                    value_ar="القطاع"
                  />
                </Text>
                <Text className="w-1/2 text-m">{plot.sector}</Text>
              </View>
              <View className="flex flex-row gap-s pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Plot Address"
                    value_ar="عنوان القطعة"
                  />
                </Text>
                <Text className="w-1/2 text-m">{plot.address}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="mb-8">
        <Text className="text-heading-h3 font-bold mb-4 text-text-default">
          <SharedLanguageSwitchRenderer
            language={language}
            value="Owner"
            value_ar="المالك"
          />
        </Text>
        {owners?.map((owner, idx) => (
          <View
            key={idx}
            className="rounded-xs bg-cards-base-l1 border border-cards-stroke text-text-default px-l py-m mb-4"
          >
            <View className="flex flex-row justify-between items-center mb-3">
              <Text className="text-bold-ml">{owner.name}</Text>
              <View className="flex flex-row gap-s">
                <Buttons
                  type="secondary"
                  theme={theme}
                  language={language}
                  title={language === "ar" ? "عرض" : "View"}
                  title_ar="عرض"
                  size="s"
                  onClick={() => {
                    onOwnerClick?.({ ownerData: owner, action: "view" });
                  }}
                />
                <Buttons
                  type="secondary"
                  theme={theme}
                  language={language}
                  title={language === "ar" ? "تعديل" : "Edit"}
                  title_ar="تعديل"
                  size="s"
                  onClick={() => {
                    onOwnerClick?.({ ownerData: owner, action: "edit" });
                  }}
                />
                <Buttons
                  type="secondary"
                  theme={theme}
                  language={language}
                  title={language === "ar" ? "القطع" : "Plots"}
                  title_ar="القطع"
                  size="s"
                  onClick={() => {
                    onOwnerClick?.({ ownerData: owner, action: "plot" });
                  }}
                />
              </View>
            </View>
            <View>
              <View className="flex flex-row gap-s border-b border-text-dimmed pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Family book"
                    value_ar="دفتر العائلة"
                  />
                </Text>
                <Text className="w-1/2 text-m">{owner.familyBook}</Text>
              </View>
              <View className="flex flex-row gap-s border-b border-text-dimmed pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="City"
                    value_ar="المدينة"
                  />
                </Text>
                <Text className="w-1/2 text-m">{owner.city}</Text>
              </View>
              <View className="flex flex-row gap-s pb-s">
                <Text className="w-1/2 text-bold-m">
                  <SharedLanguageSwitchRenderer
                    language={language}
                    value="Property Card"
                    value_ar="بطاقة الملكية"
                  />
                </Text>
                <Text className="w-1/2 text-m">{owner.propertyCard}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className="flex flex-col gap-4 text-text-default">
        {documents.length > 0 && (
          <>
            <Text className="text-heading-h3 font-bold">
              <SharedLanguageSwitchRenderer
                language={language}
                value="Supporting Documents"
                value_ar="المستندات الداعمة"
              />
            </Text>
            {documents.map((doc, idx) => (
              <TouchableOpacity
                key={idx}
                className="flex flex-row justify-between items-center gap-xs px-[15px] py-[13px] rounded-xxs bg-form-fields-file-upload-default"
                onPress={() => onDocumentPress?.(doc.downloadUrl)}
              >
                <Text className="text-text-default text-s">
                  {language === "ar" ? doc.documentNameA : doc.documentNameE}
                </Text>
                <DocumentIcon />
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
      {registrationRemarks ? (
        <View>
          <Text className="text-heading-h3 text-text-default font-bold mt-8 mb-4">
            <SharedLanguageSwitchRenderer
              language={language}
              value="Registration Remarks"
              value_ar="ملاحظات التسجيل"
            />
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            className="w-full text-text-default rounded-xs bg-form-fields-input-form-bg border border-form-fields-input-form-border text-m p-s"
            placeholder=""
            value=""
            editable={false}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AuditRemarks;
