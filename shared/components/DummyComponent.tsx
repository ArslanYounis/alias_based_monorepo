import React from "react";
import { Container } from "@platform/Container";
import { Buttons } from "@platform/Buttons";
import { Text } from "@platform/Text";
import { Logo } from "@platform/Logo";


export interface DummyComponentProps {
  title: string;
}

export const DummyComponent: React.FC<DummyComponentProps> = ({ title }) => {
  return (
    <Container className="bg-blue-100">
      <Text>{title}</Text>
      <Buttons title="Dummy Button" type="primary" />
      <Buttons title="Dummy Button" type="secondary" />
      <Buttons title="Dummy Button" type="tertiary" />
      <Buttons title="Dummy Button" type="text-link" />
      <Buttons title="Dummy Button" type="delete" />
      <Buttons title="Dummy Button" type="primary" disabled />
      <Buttons title="Dummy Button" type="secondary" disabled />
      <Buttons title="Dummy Button" type="tertiary" disabled />
      <Buttons title="Dummy Button" type="text-link" disabled />
      <Buttons title="Dummy Button" type="delete" disabled />
      <Logo type="full" />
      <Logo type="icon" />
      <Logo type="hub" />
    </Container>
  );
};
