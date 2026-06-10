import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock the platform TextInput so the (otherwise disabled) date/currency/text
// fields expose a fireable onChange. This lets us exercise every field's
// onChange handler in Contract — including the date fields whose real
// DateInput trigger is disabled and cannot be opened in jsdom.
vi.mock("@platform/TextInput", () => ({
  TextInput: ({
    label,
    fieldType = "text",
    onChange,
  }: {
    label?: string;
    fieldType?: string;
    onChange?: (val: string) => void;
  }) => (
    <button
      type="button"
      data-testid={`field-${label ?? fieldType}`}
      onClick={() => onChange?.("2025-07-01")}
    >
      {label ?? fieldType}
    </button>
  ),
}));

// Keep the other platform deps light so rendering stays simple.
vi.mock("@platform/Label", () => ({
  Label: ({ label }: { label?: string }) => <span>{label}</span>,
}));
vi.mock("@platform/RadioField", () => ({
  RadioField: ({ label }: { label?: string }) => <span>{label}</span>,
}));

import Contract from "@shared/components/Payment/Contract";

function makeFormMock(values: Record<string, unknown> = {}) {
  const handleChangeFns: Record<string, ReturnType<typeof vi.fn>> = {};
  return {
    handleChangeFns,
    form: {
      state: {
        values: {
          tenancyContractType: "new",
          contractDate: "",
          contractNumber: "",
          registrationFees: "",
          amountInWords: "",
          startDate: "",
          endDate: "",
          emergencyNumber: "",
          ...values,
        },
      },
      Field: ({
        name,
        children,
      }: {
        name: string;
        children: (f: unknown) => React.ReactNode;
      }) => {
        const fn = vi.fn();
        handleChangeFns[name] = fn;
        return children({
          state: { value: (values[name] as string) ?? "", meta: { errors: [] } },
          handleChange: fn,
        });
      },
    } as unknown,
  };
}

describe("Contract date/field onChange handlers (mocked TextInput)", () => {
  it("fires the contractDate, startDate and endDate onChange handlers", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeFormMock();
    render(
      <Contract form={form as never} language="en" onLiveValidate={onLiveValidate} />
    );

    fireEvent.click(screen.getByTestId("field-Contract date"));
    fireEvent.click(screen.getByTestId("field-Start date"));
    fireEvent.click(screen.getByTestId("field-End Date"));

    expect(handleChangeFns["contractDate"]).toHaveBeenCalledWith("2025-07-01");
    expect(handleChangeFns["startDate"]).toHaveBeenCalledWith("2025-07-01");
    expect(handleChangeFns["endDate"]).toHaveBeenCalledWith("2025-07-01");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("fires the remaining text/number onChange handlers too", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeFormMock();
    render(
      <Contract form={form as never} language="en" onLiveValidate={onLiveValidate} />
    );

    fireEvent.click(screen.getByTestId("field-Contract number"));
    fireEvent.click(screen.getByTestId("field-Contract registration fees"));
    fireEvent.click(screen.getByTestId("field-Amount in words"));
    fireEvent.click(screen.getByTestId("field-Emergency Number"));

    expect(handleChangeFns["contractNumber"]).toHaveBeenCalled();
    expect(handleChangeFns["registrationFees"]).toHaveBeenCalled();
    expect(handleChangeFns["amountInWords"]).toHaveBeenCalled();
    expect(handleChangeFns["emergencyNumber"]).toHaveBeenCalled();
    expect(onLiveValidate).toHaveBeenCalled();
  });
});
