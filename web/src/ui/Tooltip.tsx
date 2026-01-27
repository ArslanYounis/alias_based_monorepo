import React from "react";
import SharedLanguageSwitchRenderer from "../components/shared/SharedLanguageSwitchRenderer";

type Direction =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom"
  | "none";

interface TooltipProps {
  text: string;
  text_ar?: string;
  language?: "en" | "ar";
  direction?: Direction; // optional now
}

const directionStyles: Record<Direction, { wrapper?: string; arrow?: string }> =
  {
    // === TOP ===
    "top-left": {
      wrapper: "absolute top-0 left-4 -translate-x-1/2 -translate-y-1/2",
      arrow:
        "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-[#566C74]",
    },
    "top-center": {
      wrapper: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
      arrow:
        "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-[#566C74]",
    },
    "top-right": {
      wrapper: "absolute top-0 right-4 translate-x-1/2 -translate-y-1/2",
      arrow:
        "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] border-b-[#566C74]",
    },
    // === BOTTOM ===
    "bottom-left": {
      wrapper: "absolute bottom-0 left-4 -translate-x-1/2 translate-y-1/2",
      arrow:
        "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-[#566C74]",
    },
    "bottom-center": {
      wrapper: "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
      arrow:
        "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-[#566C74]",
    },
    "bottom-right": {
      wrapper: "absolute bottom-0 right-4 translate-x-1/2 translate-y-1/2",
      arrow:
        "w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-[#566C74]",
    },
    // === LEFT ===
    "left-top": {
      wrapper: "absolute top-4 left-0 -translate-x-1/2 -translate-y-1/2",
      arrow:
        "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-[#566C74]",
    },
    "left-center": {
      wrapper: "absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
      arrow:
        "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-[#566C74]",
    },
    "left-bottom": {
      wrapper: "absolute bottom-4 left-0 -translate-x-1/2 translate-y-1/2",
      arrow:
        "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[14px] border-r-[#566C74]",
    },
    // === RIGHT ===
    "right-top": {
      wrapper: "absolute top-4 right-0 translate-x-1/2 -translate-y-1/2",
      arrow:
        "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[14px] border-l-[#566C74]",
    },
    "right-center": {
      wrapper: "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
      arrow:
        "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[14px] border-l-[#566C74]",
    },
    "right-bottom": {
      wrapper: "absolute bottom-4 right-0 translate-x-1/2 translate-y-1/2",
      arrow:
        "w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[14px] border-l-[#566C74]",
    },
    // === DEFAULT / NO ARROW ===
    none: {
      wrapper: "",
      arrow: "",
    },
  };

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  text_ar,
  language = "en",
  direction = "none",
}) => {
  const styles = directionStyles[direction];

  return (
    <div
      className="relative w-fit max-w-[150px] bg-[#566C74] break-words whitespace-normal rounded-lg px-3 py-[15.5px] text-white text-xs text-center"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <SharedLanguageSwitchRenderer
        language={language}
        value={text}
        value_ar={text_ar}
      />
      {styles?.arrow && styles?.wrapper && (
        <div className={styles.wrapper}>
          <div className={styles.arrow}></div>
        </div>
      )}
    </div>
  );
};
