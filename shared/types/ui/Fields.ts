import type { ReactNode } from "react";

export interface Option {
  label?: string;
  label_ar?: string;
  value: string;
}

export interface FormFieldProps {
  type:
    | "text"
    | "date"
    | "select"
    | "textarea"
    | "uaeid"
    | "currency"
    | "phone"
    | "number";
  placeholder?: string;
  placeholder_ar?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  language?: "en" | "ar";
  icon?: ReactNode;
  options?: Option[];
  disabled?: boolean;
  currencySymbol?: ReactNode | string;
  phoneCode?: ReactNode | string;
  selectType?: "single" | "multi";
  title?: string;
  title_ar?: string;
  isPrint_Archive?: boolean;
  showAddButton?: boolean;
  id?: string;
  ariaLabel?: string;
  testId?: string;
}
