import React from "react";
import { Container } from "@platform/Container";
import { Buttons } from "@platform/Buttons";
import { Text } from "@platform/Text";

export interface TestComponentProps {
  buttonLabel?: string;
  onSubmit?: (data: { firstName: string; lastName: string }) => void;
}

export const TestComponent: React.FC<TestComponentProps> = ({
  buttonLabel = "Submit",
  onSubmit,
}) => {
  const handleSubmit = () => {
    onSubmit?.({ firstName: "John", lastName: "Doe" });
  };

  return (
    <Container>
      <Text>{buttonLabel}</Text>
      <Buttons title={buttonLabel} type="primary" onClick={handleSubmit} />
    </Container>
  );
};
