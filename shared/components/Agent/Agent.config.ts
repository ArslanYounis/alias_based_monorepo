import type {
    ComponentConfig,
    IconType,
} from "@shared/types/dls.types";
import type { AgentProps } from "./Agent";
import type { ComponentType } from "react";

const controls: ComponentConfig<AgentProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Agent",
    defaultValueAr: "Agent",
    defaultCode: 'return "Agent"',
    defaultCodeAr: 'return "Agent"',
  },
  agent: {
    type: ["code"],
    label: "Agent Detail",
    defaultValue: [
      {
        name: "Farzana Shah",
        name_ar: "",
        email: "fshah@adrec.org",
        phone: "+971 898 1234 7654",
        image: "",
      },
    ],
    defaultCode: `return [
                {
                name: "Farzana Shah",
                name_ar: "",
                email: "fshah@adrec.org",
                phone: "+971 898 1234 7654",
                image: ""
        },
      ]`,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createAgentConfig(
    Component: ComponentType<AgentProps>,
    icon: IconType
): ComponentConfig<AgentProps> {
    return {
        id: "agent",
        icon,
        name: "Agent",
        Component,
        controls,
    };
}