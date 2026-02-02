import { MailboxIcon } from "lucide-react";
import type { ComponentConfig } from "@/types/dls.types";
import {
  DummyComponent,
  type DummyComponentProps,
} from "@shared/components/DummyComponent";

const DummyConfigs: ComponentConfig<DummyComponentProps> = {
  id: "dummy",
  icon: MailboxIcon,
  name: "Dummy Component",
  Component: DummyComponent,
  controls: {
    title: {
      type: ["text", "code"],
      label: "Title",
      hasArabic: true,
      defaultValue: "Dummy Component",
      defaultValueAr: "Dummy Component",
      defaultCode: "return 'Dummy Component'",
      defaultCodeAr: "return 'Dummy Component'",
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default DummyConfigs;
