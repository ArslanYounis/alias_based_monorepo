import React, { useState } from "react";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { Buttons } from "@platform/Buttons";

export interface TestComponentProps {
  buttonLabel?: string;
  onSubmit?: (data: { firstName: string; lastName: string }) => void;
}

export const TestComponent: React.FC<TestComponentProps> = ({
  buttonLabel = "Submit",
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return (
    <Container>
      <TextInput
        label="First Name"
        value={firstName}
        onChange={(val) => setFirstName(val ?? "")}
      />
      <TextInput
        label="Last Name"
        value={lastName}
        onChange={(val) => setLastName(val ?? "")}
      />
      <Buttons
        title={buttonLabel}
        onClick={() =>
          onSubmit?.({ firstName, lastName })
        }
      />
    </Container>
  );
};

export default TestComponent;
