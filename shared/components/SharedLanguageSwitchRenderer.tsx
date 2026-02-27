import React from "react";

export interface SharedLanguageSwitchRendererProps {
  language: "en" | "ar";
  value?: string;
  value_ar?: string;
}

const SharedLanguageSwitchRenderer: React.FC<SharedLanguageSwitchRendererProps> = ({
  language,
  value,
  value_ar,
}) => {
  return <>{language === "en" ? value : value_ar ?? value}</>;
};

export default SharedLanguageSwitchRenderer;
