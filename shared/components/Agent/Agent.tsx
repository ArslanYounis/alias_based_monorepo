import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Avatar } from "@platform/Avatar";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface Agent {
  name: string;
  name_ar: string;
  email: string;
  phone: string;
  image?: string;
}

export interface AgentProps {
  title?: string;
  title_ar?: string;
  agent: Agent;
  language?: "en" | "ar";
  platform?: "web" | "mobile";
}

const Agent: React.FC<AgentProps> = ({
  title = "Customer Agent",
  title_ar = "وكيل العميل",
  agent,
  language = "en",
  platform = "web",
}) => {
  return (
    <Container className="flex flex-col gap-2">
      <Text className={`text-bold-ml text-text-default mb-xs`}>
        <SharedLanguageSwitchRenderer
          language={language}
          value={title}
          value_ar={title_ar}
        />
      </Text>
      {platform === "web" ? (
        <Container className="flex flex-row gap-m items-center px-s py-xs bg-cards-base-l1 rounded-[5px]">
          <Avatar
            imageUrl={
              agent?.image ||
              "https://adrec-images.mastermind-mindset.com/dummyUserImg.png"
            }
            avatarSize={32}
          />
          <Container className="flex flex-row gap-xs">
            <Text className="text-m text-text-default font-normal">
              <SharedLanguageSwitchRenderer
                language={language}
                value={agent.name}
                value_ar={agent.name_ar}
              />
            </Text>
            <Text className="text-m text-text-dimmed font-normal">|</Text>
            <Text className="text-m text-text-link font-normal">
              {agent.email}
            </Text>
            <Text className="text-m text-text-dimmed font-normal">|</Text>
            <Text className="text-m text-text-default font-normal">
              {agent.phone}
            </Text>
          </Container>
        </Container>
      ) : (
        <Container className="flex flex-row gap-m items-center px-s py-xs bg-cards-base-l1 rounded-[5px]">
          <Avatar
            imageUrl={
              agent?.image ||
              "https://adrec-images.mastermind-mindset.com/dummyUserImg.png"
            }
            avatarSize={32}
          />
          <Container className="flex flex-col gap-xs">
            <Text className="text-m text-text-default font-normal">
              <SharedLanguageSwitchRenderer
                language={language}
                value={agent.name}
                value_ar={agent.name_ar}
              />
            </Text>
            <Container className="flex flex-row gap-xs">
              <Text className="text-s text-text-link font-normal">
                {agent.email}
              </Text>
              <Text className="text-s text-text-default font-normal">
                {agent.phone}
              </Text>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default Agent;
