import React from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";

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
  ownerText?: string;
  ownerText_ar?: string;
  mainTitle?: string;
  mainTitle_ar?: string;
}

export const ViewOwnerDetail: React.FC<ViewOwnerDetailProps> = ({
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
    <Container>
      {(mainTitle || mainTitle_ar) && (
        <Typography
          variant="h1"
          text={mainTitle}
          text_ar={mainTitle_ar || mainTitle}
          language={language}
        />
      )}
      {(plotCode || plotCode_ar) && (
        <Typography
          variant="h1"
          text={plotCode}
          text_ar={plotCode_ar || plotCode}
          language={language}
        />
      )}
      <Typography
        variant="h3"
        text={ownerText}
        text_ar={ownerText_ar || ownerText}
        language={language}
      />
      {owner?.name && (
        <Typography variant="text-bold-lg" text={owner.name} language={language} />
      )}
      {owner?.details?.map(({ label, label_ar, value, value_ar }, idx) => (
        <Container key={idx}>
          <Typography
            variant="text-bold-md"
            text={label}
            text_ar={label_ar || label}
            language={language}
          />
          <Typography
            variant="text-md"
            text={value}
            text_ar={value_ar || value}
            language={language}
          />
        </Container>
      ))}
    </Container>
  );
};

export default ViewOwnerDetail;
