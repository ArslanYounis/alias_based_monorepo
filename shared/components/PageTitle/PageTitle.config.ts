import { CreditCardIcon } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import PageTitle, { type PageTitleProps } from "./PageTitle";

const PageTitleConfig: ComponentConfig<PageTitleProps> = {
  id: "pageTitle",
  icon: CreditCardIcon,
  name: "Page Title",
  Component: PageTitle,
  controls: {
    label: {
      type: ["text", "code"],
      label: "Title (Expanded - EN)",
      defaultValue: "Page Title",
      defaultCode: "return 'Page Title'",
    },
    label_ar: {
      type: ["text", "code"],
      label: "Title (Expanded - AR)",
      defaultValue: "عنوان الصفحة",
      defaultCode: "return 'عنوان الصفحة'",
    },
    showButtons: {
      type: ["boolean", "code"],
      label: "Show Buttons",
      defaultValue: false,
      defaultCode: "return false",
    },
    buttons: {
      type: ["code"],
      label: "Buttons",
      defaultCode: `
return [
  {
    title: "Add Agent",
    title_ar: "إضافة وكيل",
    type: "secondary",
    onClick: () => console.log("Add Agent clicked"),
  },
];
      `,
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default PageTitleConfig;
