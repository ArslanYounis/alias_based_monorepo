import ByPlot from "./byPlot";
import { Text } from "@platform/Text";
import { Container } from "@platform/Container";
import type { SearchResult } from "./dariPlotSearchResult";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface DariPlotSearchProps {
  selected?: SearchResult[] | null;
  onSubmit?: (val: SearchResult) => void;
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  language?: "en" | "ar";
  platform?: "web" | "mobile";
}

const DariPlotSearch = ({
  title = "",
  title_ar = "",
  subtitle = "",
  subtitle_ar = "",
  selected = [],
  onSubmit = () => {},
  language = "en",
  platform = "web",
}: DariPlotSearchProps) => {
  const safeSelected = Array.isArray(selected) ? selected : [];

  return (
    <Container
      className="flex flex-col w-full"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {!!title && (
        <Text
          className={`text-heading-h2 font-bold text-text-default mb-[14px]`}
        >
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar || title}
          />
        </Text>
      )}
      {subtitle && (
        <Text className={`text-m text-text-default mb-8`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={subtitle}
            value_ar={subtitle_ar || subtitle}
          />
        </Text>
      )}

      <ByPlot
        selected={safeSelected}
        language={language}
        onSelectResult={(result) => onSubmit?.(result)}
        platform={platform}
      />
    </Container>
  );
};

export default DariPlotSearch;
