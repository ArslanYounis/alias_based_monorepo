import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";

export const LargeComponent: React.FC = () => {
  return (
    <Container className="bg-blue-800">
      <Text>Large component using platform-specific Container and Text</Text>
    </Container>
  );
};
