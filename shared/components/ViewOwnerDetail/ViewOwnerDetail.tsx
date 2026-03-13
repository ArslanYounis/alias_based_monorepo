import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import { Buttons } from "@platform/Buttons";

export interface PlotInfoItem {
  label: string;
  label_ar?: string;
  value: string;
  value_ar?: string;
}

export interface OwnerInfo {
  name: string;
  details: PlotInfoItem[];
}

export interface ViewOwnerDetailProps {
  plotCode?: string;
  plotCode_ar?: string;
  owner?: OwnerInfo;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  // Button labels
  viewButtonText?: string;
  viewButtonText_ar?: string;
  // Section labels
  ownerText?: string;
  ownerText_ar?: string;
  documentsText?: string;
  documentsText_ar?: string;
  // Document names
  uaeIdText?: string;
  uaeIdText_ar?: string;
  passportText?: string;
  passportText_ar?: string;
  mainTitle?: string;
  mainTitle_ar?: string;
}

const ViewOwnerDetail: React.FC<ViewOwnerDetailProps> = ({
  plotCode = "",
  plotCode_ar,
  owner = { name: "", details: [] },
  language = "en",
  ownerText = "Owner",
  ownerText_ar = "المالك",
  mainTitle = "",
  mainTitle_ar = "",
}) => {
  return (
    <Container
      className="w-full"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <Container className="flex flex-col mb-l">
        {mainTitle || mainTitle_ar ? (
          <Text
            className={`text-heading-h3 sm:text-heading-h1 font-bold mb-xxs text-text-default`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={mainTitle}
              value_ar={mainTitle_ar}
            />
          </Text>
        ) : null}
        {/* {plotCode || plotCode_ar ? (
          <Text
            className={`text-32! sm:!text-48 font-bold mb-xxs text-text-default`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={plotCode}
              value_ar={plotCode_ar || plotCode}
            />
          </Text>
        ) : null} */}
      </Container>
      <Container
        className={`flex flex-col w-full gap-4 mb-s text-text-default`}
      >
        <Container className="flex flex-row items-center justify-between">
          <Text className={`text-heading-h3 font-bold text-text-default`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={ownerText}
              value_ar={ownerText_ar}
            />
          </Text>
          <Buttons
            title="View"
            title_ar="عرض"
            type="secondary"
            size="m"
            language={language}
          />
        </Container>

        <Container
          className={`py-m px-l gap-l bg-cards-base-l2 border border-cards-stroke rounded-xs mb-8`}
        >
          <Text
            className={`text-bold-ml pb-3 mb-3 text-text-default line-clamp-1`}
          >
            {owner?.name}
          </Text>

          {owner?.details?.map(({ label, label_ar, value, value_ar }, idx) => (
            <Container
              key={idx}
              className={`flex flex-row gap-l pb-3 mb-s border-b border-border-dimmed last:border-b-none text-text-default`}
            >
              <Text className="w-[40%] text-bold-m">
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={label}
                  value_ar={label_ar || label}
                />
              </Text>
              <Text className="w-[55%] text-m">
                <SharedLanguageSwitchRenderer
                  language={language}
                  value={value}
                  value_ar={value_ar || value}
                />
              </Text>
            </Container>
          ))}
        </Container>
      </Container>
    </Container>
  );
};

export default ViewOwnerDetail;
