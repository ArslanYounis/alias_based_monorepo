interface SharedLanguageSwitchRendererProps {
  language: "en" | "ar";
  value?: string;
  value_ar?: string;
}

const SharedLanguageSwitchRenderer = ({
  language,
  value,
  value_ar,
}: SharedLanguageSwitchRendererProps) => {
  return <>{language === "en" ? value : value_ar || value}</>;
};

export default SharedLanguageSwitchRenderer;
