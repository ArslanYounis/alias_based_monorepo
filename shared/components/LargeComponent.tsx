import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";

export const LargeComponent: React.FC = () => {
  return (
    <Container style={{ backgroundColor: "blue" }}>
      <Text style={{ color: "red" }}>
        Large component using platform-specific Container and Text
      </Text>
    </Container>
  );
};
