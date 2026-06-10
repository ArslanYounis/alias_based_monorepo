import { type FC } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { CheckboxField } from "@platform/CheckboxField";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface ServiceSelectRowProps {
  id: string;
  label?: string;
  label_ar?: string;
  checked?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  onChange?: (id: string, checked: boolean) => void;
  /** Optional right-aligned tag, e.g. "Existing Block". */
  tag?: string;
  tag_ar?: string;
  /** Optional right-aligned value text (used when no tag is provided). */
  value?: string;
  value_ar?: string;
  showBorder?: boolean;
  language?: "en" | "ar";
  platform?: "web" | "mobile";
}

const ServiceSelectRow: FC<ServiceSelectRowProps> = ({
  id,
  label = "",
  label_ar = "",
  checked = false,
  disabled = false,
  hasError = false,
  onChange = () => {},
  tag,
  tag_ar,
  value,
  value_ar,
  showBorder = true,
  language = "en",
  platform = "web",
}) => {
  const hasTag = !!(tag || tag_ar);
  const hasValue = !hasTag && !!(value || value_ar);

  return (
    <Container
      className={`flex flex-row items-center justify-between gap-s px-s ${
        platform === "web" ? "py-xs" : "py-s"
      } rounded-sm w-full ${showBorder ? "border-b border-b-border-dimmed" : ""}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <CheckboxField
        id={id}
        label={label}
        label_ar={label_ar}
        checked={checked}
        disabled={disabled}
        hasError={hasError}
        onChange={onChange}
        language={language}
      />

      {hasTag && (
        <Container className="flex items-center justify-center shrink-0 px-xxs rounded-xs bg-status-pending-fade">
          <Text className="text-xs text-status-pending-solid">
            <SharedLanguageSwitchRenderer
              language={language}
              value={tag || ""}
              value_ar={tag_ar || tag || ""}
            />
          </Text>
        </Container>
      )}

      {hasValue && (
        <Text className="text-m text-text-default shrink-0">
          <SharedLanguageSwitchRenderer
            language={language}
            value={value || ""}
            value_ar={value_ar || value || ""}
          />
        </Text>
      )}
    </Container>
  );
};

export default ServiceSelectRow;
