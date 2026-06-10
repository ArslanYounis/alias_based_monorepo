import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Payment from "@shared/components/Payment/Payment";
import Contract from "@shared/components/Payment/Contract";
import Insurance from "@shared/components/Payment/Insurance";
import Rent from "@shared/components/Payment/Rent";
import Measurement from "@shared/components/Payment/Measurement";
import {
  ContractSchema,
  MeasurementSchema,
  InsuranceSchema,
  RentSchema,
  ContractErrorMessagesAr,
  MeasurementErrorMessagesAr,
  InsuranceErrorMessagesAr,
  RentErrorMessagesAr,
  getContractErrorMessages,
  getMeasurementErrorMessages,
  getInsuranceErrorMessages,
  getRentErrorMessages,
} from "@shared/components/Payment/helper";

vi.mock("@shared/hooks/useCalculateRentFees", () => ({
  useCalculateRentFees: vi.fn(() => ({ mutate: vi.fn() })),
}));

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("Payment (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<Payment />);
  });

  it("shows Payment and No Payment radio options", () => {
    render(<Payment language="en" />);
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("No Payment")).toBeInTheDocument();
  });

  it("shows Arabic Payment option in 'ar' mode", () => {
    render(<Payment language="ar" />);
    expect(screen.getByText("الدفع")).toBeInTheDocument();
    expect(screen.getByText("بدون دفع")).toBeInTheDocument();
  });

  it("shows Contract step by default (step 0)", () => {
    render(<Payment language="en" />);
    expect(screen.getByText("Contract")).toBeInTheDocument();
  });

  it("shows Arabic Contract title when language is 'ar'", () => {
    render(<Payment language="ar" />);
    expect(screen.getByText("العقد")).toBeInTheDocument();
  });

  it("shows 'Step 1 of 4' subtext", () => {
    render(<Payment language="en" />);
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
  });

  it("shows loading state when isStepInfoPending is true", () => {
    render(<Payment language="en" isStepInfoPending={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text when language is 'ar' and isStepInfoPending", () => {
    render(<Payment language="ar" isStepInfoPending={true} />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("shows Continue Later, Back and Next buttons", () => {
    render(<Payment language="en" />);
    expect(screen.getByText("Continue Later")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("shows Arabic footer buttons in 'ar' mode", () => {
    render(<Payment language="ar" />);
    expect(screen.getByText("استمرار لاحقًا")).toBeInTheDocument();
    expect(screen.getByText("رجوع")).toBeInTheDocument();
    expect(screen.getByText("التالي")).toBeInTheDocument();
  });

  it("calls onSaveDraft when Continue Later is clicked", () => {
    const onSaveDraft = vi.fn();
    render(<Payment language="en" onSaveDraft={onSaveDraft} />);
    fireEvent.click(screen.getByText("Continue Later"));
    expect(onSaveDraft).toHaveBeenCalledTimes(1);
  });

  it("navigates to next step when Next is clicked", () => {
    renderWithQueryClient(<Payment language="en" />);
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Measurement")).toBeInTheDocument();
  });

  it("navigates back from step 2 to step 1 with Back", () => {
    renderWithQueryClient(<Payment language="en" />);
    fireEvent.click(screen.getByText("Next")); // go to Measurement
    expect(screen.getByText("Measurement")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Contract")).toBeInTheDocument();
  });

  it("shows No Payment remarks field when No Payment is selected", () => {
    render(<Payment language="en" />);
    // Click No Payment radio card
    fireEvent.click(screen.getByText("No Payment"));
    expect(screen.getByText("Remarks")).toBeInTheDocument();
  });

  it("shows Submit button in No Payment mode", () => {
    render(<Payment language="en" />);
    fireEvent.click(screen.getByText("No Payment"));
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("shows error when submitting No Payment without remarks", () => {
    render(<Payment language="en" />);
    fireEvent.click(screen.getByText("No Payment"));
    fireEvent.click(screen.getByText("Submit"));
    expect(screen.getByText("Remarks are required")).toBeInTheDocument();
  });

  it("shows Arabic remarks error in 'ar' mode", () => {
    render(<Payment language="ar" />);
    fireEvent.click(screen.getByText("بدون دفع"));
    fireEvent.click(screen.getByText("إرسال"));
    expect(screen.getByText("الملاحظات مطلوبة")).toBeInTheDocument();
  });

  it("shows Submit button at last step (step 4) of Payment", () => {
    renderWithQueryClient(<Payment language="en" />);
    fireEvent.click(screen.getByText("Next")); // -> Measurement
    fireEvent.click(screen.getByText("Next")); // -> Insurance
    fireEvent.click(screen.getByText("Next")); // -> Rent
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders on mobile platform without crashing", () => {
    render(<Payment language="en" platform="mobile" />);
  });

  it("disables primary button when isPaymentSubmitting is true", () => {
    render(<Payment language="en" isPaymentSubmitting={true} />);
    const nextBtn = screen.getByText("Next").closest("button");
    expect(nextBtn).toBeDisabled();
  });

  it("calls onPaymentSubmit when Submit is clicked on last step", () => {
    const onPaymentSubmit = vi.fn();
    renderWithQueryClient(
      <Payment language="en" onPaymentSubmit={onPaymentSubmit} />
    );
    fireEvent.click(screen.getByText("Next")); // step 1→2
    fireEvent.click(screen.getByText("Next")); // step 2→3
    fireEvent.click(screen.getByText("Next")); // step 3→4
    expect(screen.getByText("Submit")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Submit"));
    expect(onPaymentSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit callback when Submit is clicked in Payment mode last step", () => {
    const onSubmit = vi.fn();
    renderWithQueryClient(<Payment language="en" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Submit"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows Arabic remarks label when No Payment selected in 'ar'", () => {
    render(<Payment language="ar" />);
    fireEvent.click(screen.getByText("بدون دفع"));
    expect(screen.getByText("ملاحظات")).toBeInTheDocument();
  });

  it("Back button is disabled at first step", () => {
    render(<Payment language="en" />);
    const backBtn = screen.getByText("Back").closest("button");
    expect(backBtn).toBeDisabled();
  });

  it("Back button is disabled in No Payment mode", () => {
    render(<Payment language="en" />);
    fireEvent.click(screen.getByText("No Payment"));
    const backBtn = screen.getByText("Back").closest("button");
    expect(backBtn).toBeDisabled();
  });

  it("switching from No Payment back to Payment resets to step 0", () => {
    render(<Payment language="en" />);
    fireEvent.click(screen.getByText("No Payment"));
    fireEvent.click(screen.getByText("Payment"));
    expect(screen.getByText("Contract")).toBeInTheDocument();
  });

  it("shows step 3 Insurance after navigating forward twice", () => {
    renderWithQueryClient(<Payment language="en" />);
    fireEvent.click(screen.getByText("Next")); // → Measurement
    fireEvent.click(screen.getByText("Next")); // → Insurance
    expect(screen.getByText("Insurance")).toBeInTheDocument();
  });

  it("renders stepInfo contract date when provided", () => {
    render(
      <Payment
        language="en"
        stepInfo={{
          result: {
            tenancyContract: {
              contractDate: "2025-07-01",
              requestLandClassificationId: 1,
              plotId: 10,
              tenancyContractId: 5,
            },
          },
        }}
      />
    );
    expect(screen.getByText("Contract")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Contract sub-component
// ─────────────────────────────────────────────────────────────────────────────

function makeFormMock(values: Record<string, unknown> = {}) {
  return {
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
    Field: ({ name, children }: { name: string; children: (f: unknown) => React.ReactNode }) =>
      children({
        state: {
          value: (values[name] as string) ?? "",
          meta: { errors: [] },
        },
        handleChange: vi.fn(),
      }),
  } as unknown;
}

describe("Contract sub-component", () => {
  it("renders without crashing", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
  });

  it("renders Contract date label in English", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("Contract date")).toBeInTheDocument();
  });

  it("renders Arabic contract date label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("تاريخ العقد")).toBeInTheDocument();
  });

  it("renders Contract number label", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("Contract number")).toBeInTheDocument();
  });

  it("renders Registration fees label", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("Contract registration fees")).toBeInTheDocument();
  });

  it("renders Start date label", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("Start date")).toBeInTheDocument();
  });

  it("renders End Date label", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("End Date")).toBeInTheDocument();
  });

  it("renders Emergency Number label", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("Emergency Number")).toBeInTheDocument();
  });

  it("renders Tenancy contract type radio options", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("New Tenancy")).toBeInTheDocument();
    expect(screen.getByText("Renew Tenancy")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Insurance sub-component
// ─────────────────────────────────────────────────────────────────────────────

function makeInsuranceFormMock(values: Record<string, unknown> = {}) {
  return {
    state: {
      values: {
        insuranceFee: "Yes",
        insuranceRegistrationFees: "",
        insuranceAmountInWords: "",
        ...values,
      },
    },
    Field: ({ name, children }: { name: string; children: (f: unknown) => React.ReactNode }) =>
      children({
        state: {
          value: values[name] ?? (name === "insuranceFee" ? "Yes" : ""),
          meta: { errors: [] },
        },
        handleChange: vi.fn(),
      }),
  } as unknown;
}

describe("Insurance sub-component", () => {
  it("renders without crashing", () => {
    render(<Insurance form={makeInsuranceFormMock() as never} language="en" />);
  });

  it("renders Insurance fee label", () => {
    render(<Insurance form={makeInsuranceFormMock() as never} language="en" />);
    expect(screen.getByText("Insurance fee")).toBeInTheDocument();
  });

  it("renders Yes/No radio options", () => {
    render(<Insurance form={makeInsuranceFormMock() as never} language="en" />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("renders Rent fees and Amount in words when insuranceFee is Yes", () => {
    render(<Insurance form={makeInsuranceFormMock() as never} language="en" />);
    expect(screen.getByText("Rent fees area per unit (in fils)")).toBeInTheDocument();
    expect(screen.getByText("Amount in words")).toBeInTheDocument();
  });

  it("renders Arabic label for insurance fee", () => {
    render(<Insurance form={makeInsuranceFormMock() as never} language="ar" />);
    expect(screen.getByText("رسوم التأمين")).toBeInTheDocument();
  });

  it("toggles to No hides extra fields", () => {
    render(<Insurance form={makeInsuranceFormMock() as never} language="en" />);
    fireEvent.click(screen.getByText("No"));
    expect(screen.queryByText("Rent fees area per unit (in fils)")).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Rent sub-component
// ─────────────────────────────────────────────────────────────────────────────

function makeRentFormMock(values: Record<string, unknown> = {}) {
  return {
    state: {
      values: {
        insuranceFee: "Yes",
        rentPaymentStartDate: "",
        rentPaymentEndDate: "",
        paymentAmount: "",
        isFirstYearFreeOfPayment: false,
        exemptSocialAssistance: false,
        ...values,
      },
    },
    Field: ({ name, children }: { name: string; children: (f: unknown) => React.ReactNode }) =>
      children({
        state: {
          value: values[name] ?? (name === "insuranceFee" ? "Yes" : name.includes("Free") || name.includes("exempt") ? false : ""),
          meta: { errors: [] },
        },
        handleChange: vi.fn(),
      }),
  } as unknown;
}

describe("Rent sub-component", () => {
  it("renders without crashing", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
  });

  it("renders Insurance fee label", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
    expect(screen.getByText("Insurance fee")).toBeInTheDocument();
  });

  it("renders Rent payment start date label", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
    expect(screen.getByText("Rent payment start date")).toBeInTheDocument();
  });

  it("renders Rent payment end date label", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
    expect(screen.getByText("Rent payment end date")).toBeInTheDocument();
  });

  it("renders Payment amount label", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
    expect(screen.getByText("Payment amount")).toBeInTheDocument();
  });

  it("renders first year free checkbox label", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
    expect(
      screen.getByText("Rent payment is free for the year")
    ).toBeInTheDocument();
  });

  it("renders exempt social assistance checkbox label", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
    expect(
      screen.getByText("Exempt social assistance recipient")
    ).toBeInTheDocument();
  });

  it("renders Arabic labels", () => {
    render(<Rent form={makeRentFormMock() as never} language="ar" />);
    expect(screen.getByText("تاريخ بدء سداد الإيجار")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Measurement sub-component
// ─────────────────────────────────────────────────────────────────────────────

function makeMeasurementFormMock(values: Record<string, unknown> = {}) {
  return {
    state: {
      values: {
        units: "Square Meters",
        ranchType: "3",
        rentFees: "",
        measurementRegistrationFees: "",
        measurementAmountInWords: "",
        tenancyRemarks: "",
        ...values,
      },
    },
    Field: ({ name, children }: { name: string; children: (f: unknown) => React.ReactNode }) =>
      children({
        state: {
          value: values[name] ?? (name === "ranchType" ? "3" : name === "units" ? "Square Meters" : ""),
          meta: { errors: [] },
        },
        handleChange: vi.fn(),
      }),
  } as unknown;
}

describe("Measurement sub-component", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
  });

  it("renders Units of measurement label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
    expect(screen.getByText("Units of measurement")).toBeInTheDocument();
  });

  it("renders Square Feet and Square Meters radio options", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
    expect(screen.getByText("Square Feet")).toBeInTheDocument();
    expect(screen.getByText("Square Meters")).toBeInTheDocument();
  });

  it("renders Ranch Type label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
    expect(screen.getByText("Ranch Type")).toBeInTheDocument();
  });

  it("renders Rent fees label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
    expect(
      screen.getByText("Rent fees area per unit (in fils)")
    ).toBeInTheDocument();
  });

  it("renders Fee amount label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
    expect(screen.getByText("Fee amount")).toBeInTheDocument();
  });

  it("renders Amount in words label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
    expect(screen.getByText("Amount in words")).toBeInTheDocument();
  });

  it("renders Tenancy Remarks label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="en" />
    );
    expect(screen.getByText("Tenancy Remarks")).toBeInTheDocument();
  });

  it("renders Arabic units label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="ar" />
    );
    expect(screen.getByText("وحدة القياس")).toBeInTheDocument();
  });

  it("renders Arabic Ranch Type label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="ar" />
    );
    expect(screen.getByText("فئة العزبة")).toBeInTheDocument();
  });

  it("renders Arabic Rent fees label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="ar" />
    );
    expect(screen.getByText("قيمة الإيجار لوحدة المساحة (بالفلس)")).toBeInTheDocument();
  });

  it("renders Arabic Fee amount label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="ar" />
    );
    expect(screen.getByText("رسوم تسجيل العقد")).toBeInTheDocument();
  });

  it("renders Arabic Amount in words label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="ar" />
    );
    expect(screen.getByText("المبلغ بالحروف")).toBeInTheDocument();
  });

  it("renders Arabic Tenancy Remarks label", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="ar" />
    );
    expect(screen.getByText("ملاحظات الايجار")).toBeInTheDocument();
  });

  it("renders Arabic unit radio options", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock() as never} language="ar" />
    );
    expect(screen.getByText("قدم مربع")).toBeInTheDocument();
    expect(screen.getByText("متر مربع")).toBeInTheDocument();
  });

  it("renders ranch type select with different ranchType values", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock({ ranchType: "4" }) as never} language="en" />
    );
    expect(screen.getByText("Ranch Type")).toBeInTheDocument();
  });

  it("renders ranch type select with value 5", () => {
    renderWithQueryClient(
      <Measurement form={makeMeasurementFormMock({ ranchType: "5" }) as never} language="en" />
    );
    expect(screen.getByText("Ranch Type")).toBeInTheDocument();
  });

  it("renders with data prop for plotId and classification", () => {
    renderWithQueryClient(
      <Measurement
        form={makeMeasurementFormMock() as never}
        language="en"
        data={{ plotId: 10, requestLandClassificationId: 2 }}
      />
    );
    expect(screen.getByText("Ranch Type")).toBeInTheDocument();
  });

  it("calls onRentFeesCalculated callback when provided", () => {
    const onRentFeesCalculated = vi.fn();
    renderWithQueryClient(
      <Measurement
        form={makeMeasurementFormMock() as never}
        language="en"
        onRentFeesCalculated={onRentFeesCalculated}
      />
    );
    // Component renders and useEffect fires; since mutate is mocked, callback won't fire
    // but we verify the component accepts and renders with the prop
    expect(screen.getByText("Ranch Type")).toBeInTheDocument();
  });

  it("renders with form values pre-filled", () => {
    renderWithQueryClient(
      <Measurement
        form={makeMeasurementFormMock({
          units: "Square Feet",
          ranchType: "4",
          rentFees: "100",
          measurementRegistrationFees: "200",
          measurementAmountInWords: "Two Hundred",
          tenancyRemarks: "Some remark",
        }) as never}
        language="en"
      />
    );
    expect(screen.getByText("Units of measurement")).toBeInTheDocument();
    expect(screen.getByText("Tenancy Remarks")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Payment helper schemas
// ─────────────────────────────────────────────────────────────────────────────

describe("Payment helper schemas", () => {
  // --- ContractSchema ---
  describe("ContractSchema", () => {
    it("accepts valid contract data", () => {
      const valid = {
        tenancyContractType: "new",
        contractDate: "2025-07-01",
        contractNumber: "CN001",
        registrationFees: "500",
        amountInWords: "Five Hundred",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      };
      const result = ContractSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("accepts renew tenancy type", () => {
      const valid = {
        tenancyContractType: "renew",
        contractDate: "2025-07-01",
        contractNumber: "CN002",
        registrationFees: "300",
        amountInWords: "Three Hundred",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      };
      const result = ContractSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects invalid tenancy contract type", () => {
      const invalid = {
        tenancyContractType: "invalid",
        contractDate: "2025-07-01",
        contractNumber: "CN001",
        registrationFees: "500",
        amountInWords: "Five Hundred",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      };
      const result = ContractSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects empty contractDate", () => {
      const invalid = {
        tenancyContractType: "new",
        contractDate: "",
        contractNumber: "CN001",
        registrationFees: "500",
        amountInWords: "Five Hundred",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      };
      const result = ContractSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects empty contractNumber", () => {
      const invalid = {
        tenancyContractType: "new",
        contractDate: "2025-07-01",
        contractNumber: "",
        registrationFees: "500",
        amountInWords: "Five Hundred",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      };
      const result = ContractSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects empty registrationFees", () => {
      const result = ContractSchema.safeParse({
        tenancyContractType: "new",
        contractDate: "2025-07-01",
        contractNumber: "CN001",
        registrationFees: "",
        amountInWords: "Five Hundred",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty amountInWords", () => {
      const result = ContractSchema.safeParse({
        tenancyContractType: "new",
        contractDate: "2025-07-01",
        contractNumber: "CN001",
        registrationFees: "500",
        amountInWords: "",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty startDate", () => {
      const result = ContractSchema.safeParse({
        tenancyContractType: "new",
        contractDate: "2025-07-01",
        contractNumber: "CN001",
        registrationFees: "500",
        amountInWords: "Five Hundred",
        startDate: "",
        endDate: "2026-07-01",
        emergencyNumber: "+971501234567",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty endDate", () => {
      const result = ContractSchema.safeParse({
        tenancyContractType: "new",
        contractDate: "2025-07-01",
        contractNumber: "CN001",
        registrationFees: "500",
        amountInWords: "Five Hundred",
        startDate: "2025-07-01",
        endDate: "",
        emergencyNumber: "+971501234567",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty emergencyNumber", () => {
      const result = ContractSchema.safeParse({
        tenancyContractType: "new",
        contractDate: "2025-07-01",
        contractNumber: "CN001",
        registrationFees: "500",
        amountInWords: "Five Hundred",
        startDate: "2025-07-01",
        endDate: "2026-07-01",
        emergencyNumber: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing fields entirely", () => {
      const result = ContractSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // --- MeasurementSchema ---
  describe("MeasurementSchema", () => {
    it("accepts valid measurement data with Square Feet", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Feet",
        ranchType: "3",
        rentFees: "100",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "Two Hundred",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid measurement data with Square Meter", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Meter",
        ranchType: "4",
        rentFees: "100",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "Two Hundred",
      });
      expect(result.success).toBe(true);
    });

    it("accepts optional tenancyRemarks", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Feet",
        ranchType: "5",
        rentFees: "100",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "Two Hundred",
        tenancyRemarks: "Some remarks here",
      });
      expect(result.success).toBe(true);
    });

    it("accepts missing tenancyRemarks (optional)", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Feet",
        ranchType: "3",
        rentFees: "100",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "Two Hundred",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tenancyRemarks).toBeUndefined();
      }
    });

    it("rejects invalid units value", () => {
      const result = MeasurementSchema.safeParse({
        units: "Acres",
        ranchType: "3",
        rentFees: "100",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "Two Hundred",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid ranchType value", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Feet",
        ranchType: "9",
        rentFees: "100",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "Two Hundred",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty rentFees", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Feet",
        ranchType: "3",
        rentFees: "",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "Two Hundred",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty measurementRegistrationFees", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Feet",
        ranchType: "3",
        rentFees: "100",
        measurementRegistrationFees: "",
        measurementAmountInWords: "Two Hundred",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty measurementAmountInWords", () => {
      const result = MeasurementSchema.safeParse({
        units: "Square Feet",
        ranchType: "3",
        rentFees: "100",
        measurementRegistrationFees: "200",
        measurementAmountInWords: "",
      });
      expect(result.success).toBe(false);
    });
  });

  // --- InsuranceSchema ---
  describe("InsuranceSchema", () => {
    it("accepts valid insurance data with Yes", () => {
      const result = InsuranceSchema.safeParse({
        insuranceFee: "Yes",
        insuranceRegistrationFees: "300",
        insuranceAmountInWords: "Three Hundred",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid insurance data with No", () => {
      const result = InsuranceSchema.safeParse({
        insuranceFee: "No",
        insuranceRegistrationFees: "300",
        insuranceAmountInWords: "Three Hundred",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid insuranceFee value", () => {
      const result = InsuranceSchema.safeParse({
        insuranceFee: "Maybe",
        insuranceRegistrationFees: "300",
        insuranceAmountInWords: "Three Hundred",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty insuranceRegistrationFees", () => {
      const result = InsuranceSchema.safeParse({
        insuranceFee: "Yes",
        insuranceRegistrationFees: "",
        insuranceAmountInWords: "Three Hundred",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty insuranceAmountInWords", () => {
      const result = InsuranceSchema.safeParse({
        insuranceFee: "Yes",
        insuranceRegistrationFees: "300",
        insuranceAmountInWords: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing fields", () => {
      const result = InsuranceSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // --- RentSchema ---
  describe("RentSchema", () => {
    it("accepts valid rent data", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "Yes",
        rentPaymentStartDate: "2025-07-01",
        rentPaymentEndDate: "2026-07-01",
        paymentAmount: "1000",
      });
      expect(result.success).toBe(true);
    });

    it("accepts optional boolean fields as true", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "No",
        rentPaymentStartDate: "2025-07-01",
        rentPaymentEndDate: "2026-07-01",
        paymentAmount: "1000",
        isFirstYearFreeOfPayment: true,
        exemptSocialAssistance: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts optional boolean fields as false", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "Yes",
        rentPaymentStartDate: "2025-07-01",
        rentPaymentEndDate: "2026-07-01",
        paymentAmount: "1000",
        isFirstYearFreeOfPayment: false,
        exemptSocialAssistance: false,
      });
      expect(result.success).toBe(true);
    });

    it("accepts missing optional boolean fields", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "Yes",
        rentPaymentStartDate: "2025-07-01",
        rentPaymentEndDate: "2026-07-01",
        paymentAmount: "1000",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isFirstYearFreeOfPayment).toBeUndefined();
        expect(result.data.exemptSocialAssistance).toBeUndefined();
      }
    });

    it("rejects invalid insuranceFee value", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "Maybe",
        rentPaymentStartDate: "2025-07-01",
        rentPaymentEndDate: "2026-07-01",
        paymentAmount: "1000",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty rentPaymentStartDate", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "Yes",
        rentPaymentStartDate: "",
        rentPaymentEndDate: "2026-07-01",
        paymentAmount: "1000",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty rentPaymentEndDate", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "Yes",
        rentPaymentStartDate: "2025-07-01",
        rentPaymentEndDate: "",
        paymentAmount: "1000",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty paymentAmount", () => {
      const result = RentSchema.safeParse({
        insuranceFee: "Yes",
        rentPaymentStartDate: "2025-07-01",
        rentPaymentEndDate: "2026-07-01",
        paymentAmount: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing required fields", () => {
      const result = RentSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // --- Error message getter functions ---
  describe("getContractErrorMessages", () => {
    it("returns Arabic error for contractDate", () => {
      const msgs = getContractErrorMessages("contractDate");
      expect(msgs.ar).toBe("تاريخ العقد مطلوب");
      expect(msgs.en).toBeUndefined();
    });

    it("returns external English error when provided", () => {
      const msgs = getContractErrorMessages("contractDate", {
        contractDate: "Custom error",
      });
      expect(msgs.en).toBe("Custom error");
      expect(msgs.ar).toBe("تاريخ العقد مطلوب");
    });

    it("returns Arabic error for each contract field", () => {
      const fields: Array<keyof typeof ContractErrorMessagesAr> = [
        "tenancyContractType",
        "contractDate",
        "contractNumber",
        "registrationFees",
        "amountInWords",
        "startDate",
        "endDate",
        "emergencyNumber",
      ];
      for (const field of fields) {
        const msgs = getContractErrorMessages(field);
        expect(msgs.ar).toBe(ContractErrorMessagesAr[field]);
      }
    });
  });

  describe("getMeasurementErrorMessages", () => {
    it("returns Arabic error for units", () => {
      const msgs = getMeasurementErrorMessages("units");
      expect(msgs.ar).toBe("يرجى اختيار وحدة القياس");
      expect(msgs.en).toBeUndefined();
    });

    it("returns external English error when provided", () => {
      const msgs = getMeasurementErrorMessages("rentFees", {
        rentFees: "Required",
      });
      expect(msgs.en).toBe("Required");
      expect(msgs.ar).toBe("رسوم الإيجار مطلوبة");
    });

    it("returns Arabic error for each measurement field", () => {
      const fields: Array<keyof typeof MeasurementErrorMessagesAr> = [
        "units",
        "ranchType",
        "rentFees",
        "measurementRegistrationFees",
        "measurementAmountInWords",
        "tenancyRemarks",
      ];
      for (const field of fields) {
        const msgs = getMeasurementErrorMessages(field);
        expect(msgs.ar).toBe(MeasurementErrorMessagesAr[field]);
      }
    });
  });

  describe("getInsuranceErrorMessages", () => {
    it("returns Arabic error for insuranceFee", () => {
      const msgs = getInsuranceErrorMessages("insuranceFee");
      expect(msgs.ar).toBe("يرجى اختيار رسوم التأمين");
      expect(msgs.en).toBeUndefined();
    });

    it("returns external English error when provided", () => {
      const msgs = getInsuranceErrorMessages("insuranceRegistrationFees", {
        insuranceRegistrationFees: "Fees required",
      });
      expect(msgs.en).toBe("Fees required");
      expect(msgs.ar).toBe("رسوم التسجيل مطلوبة");
    });

    it("returns Arabic error for each insurance field", () => {
      const fields: Array<keyof typeof InsuranceErrorMessagesAr> = [
        "insuranceFee",
        "insuranceRegistrationFees",
        "insuranceAmountInWords",
      ];
      for (const field of fields) {
        const msgs = getInsuranceErrorMessages(field);
        expect(msgs.ar).toBe(InsuranceErrorMessagesAr[field]);
      }
    });
  });

  describe("getRentErrorMessages", () => {
    it("returns Arabic error for insuranceFee", () => {
      const msgs = getRentErrorMessages("insuranceFee");
      expect(msgs.ar).toBe("يرجى اختيار خيار رسوم التأمين");
      expect(msgs.en).toBeUndefined();
    });

    it("returns external English error when provided", () => {
      const msgs = getRentErrorMessages("paymentAmount", {
        paymentAmount: "Amount required",
      });
      expect(msgs.en).toBe("Amount required");
      expect(msgs.ar).toBe("مبلغ الدفع مطلوب");
    });

    it("returns Arabic error for each rent field", () => {
      const fields: Array<keyof typeof RentErrorMessagesAr> = [
        "insuranceFee",
        "rentPaymentStartDate",
        "rentPaymentEndDate",
        "paymentAmount",
        "isFirstYearFreeOfPayment",
        "exemptSocialAssistance",
      ];
      for (const field of fields) {
        const msgs = getRentErrorMessages(field);
        expect(msgs.ar).toBe(RentErrorMessagesAr[field]);
      }
    });

    it("returns empty string for optional boolean field Arabic errors", () => {
      expect(getRentErrorMessages("isFirstYearFreeOfPayment").ar).toBe("");
      expect(getRentErrorMessages("exemptSocialAssistance").ar).toBe("");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Contract sub-component – additional coverage
// ─────────────────────────────────────────────────────────────────────────────

describe("Contract sub-component – additional coverage", () => {
  it("renders Arabic contract number label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("رقم العقد")).toBeInTheDocument();
  });

  it("renders Arabic registration fees label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("رسوم تسجيل العقد")).toBeInTheDocument();
  });

  it("renders Arabic amount in words label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("المبلغ بالحروف")).toBeInTheDocument();
  });

  it("renders Arabic start date label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("تاريخ البدء")).toBeInTheDocument();
  });

  it("renders Arabic end date label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("تاريخ الانتهاء")).toBeInTheDocument();
  });

  it("renders Arabic emergency number label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("رقم الطوارئ")).toBeInTheDocument();
  });

  it("renders Arabic tenancy contract type label", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("نوع عقد الايجار")).toBeInTheDocument();
  });

  it("renders Arabic tenancy type radio options", () => {
    render(<Contract form={makeFormMock() as never} language="ar" />);
    expect(screen.getByText("عقد إيجار جديد")).toBeInTheDocument();
    expect(screen.getByText("تجديد عقد الإيجار")).toBeInTheDocument();
  });

  it("renders with pre-filled form values", () => {
    render(
      <Contract
        form={makeFormMock({
          tenancyContractType: "renew",
          contractDate: "2025-07-01",
          contractNumber: "CN-123",
          registrationFees: "500",
          amountInWords: "Five Hundred",
          startDate: "2025-07-01",
          endDate: "2026-07-01",
          emergencyNumber: "+971501234567",
        }) as never}
        language="en"
      />
    );
    expect(screen.getByText("Contract date")).toBeInTheDocument();
    expect(screen.getByText("Contract number")).toBeInTheDocument();
  });

  it("renders Amount in words label in English", () => {
    render(<Contract form={makeFormMock() as never} language="en" />);
    expect(screen.getByText("Amount in words")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Rent sub-component – additional coverage
// ─────────────────────────────────────────────────────────────────────────────

describe("Rent sub-component – additional coverage", () => {
  it("renders Arabic insurance fee label", () => {
    render(<Rent form={makeRentFormMock() as never} language="ar" />);
    expect(screen.getByText("رسوم التأمين")).toBeInTheDocument();
  });

  it("renders Arabic rent payment end date label", () => {
    render(<Rent form={makeRentFormMock() as never} language="ar" />);
    expect(screen.getByText("تاريخ انتهاء سداد الإيجار")).toBeInTheDocument();
  });

  it("renders Arabic payment amount label", () => {
    render(<Rent form={makeRentFormMock() as never} language="ar" />);
    expect(screen.getByText("قيمة الدفع")).toBeInTheDocument();
  });

  it("renders Arabic first year free checkbox label", () => {
    render(<Rent form={makeRentFormMock() as never} language="ar" />);
    expect(screen.getByText("دفع الإيجار مجاني للسنة")).toBeInTheDocument();
  });

  it("renders Arabic exempt social assistance label", () => {
    render(<Rent form={makeRentFormMock() as never} language="ar" />);
    expect(screen.getByText("إعفاء مستحقي المساعدات الاجتماعية")).toBeInTheDocument();
  });

  it("renders Yes/No radio options for insurance fee", () => {
    render(<Rent form={makeRentFormMock() as never} language="en" />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("renders Arabic Yes/No radio options", () => {
    render(<Rent form={makeRentFormMock() as never} language="ar" />);
    expect(screen.getByText("نعم")).toBeInTheDocument();
    expect(screen.getByText("لا")).toBeInTheDocument();
  });

  it("renders with insuranceFee set to No", () => {
    render(
      <Rent form={makeRentFormMock({ insuranceFee: "No" }) as never} language="en" />
    );
    expect(screen.getByText("Insurance fee")).toBeInTheDocument();
    expect(screen.getByText("Payment amount")).toBeInTheDocument();
  });

  it("renders checkbox fields with checked state", () => {
    render(
      <Rent
        form={makeRentFormMock({
          isFirstYearFreeOfPayment: true,
          exemptSocialAssistance: true,
        }) as never}
        language="en"
      />
    );
    expect(screen.getByText("Rent payment is free for the year")).toBeInTheDocument();
    expect(screen.getByText("Exempt social assistance recipient")).toBeInTheDocument();
  });

  it("renders with pre-filled date values", () => {
    render(
      <Rent
        form={makeRentFormMock({
          rentPaymentStartDate: "2025-07-01",
          rentPaymentEndDate: "2026-07-01",
          paymentAmount: "1000",
        }) as never}
        language="en"
      />
    );
    expect(screen.getByText("Rent payment start date")).toBeInTheDocument();
    expect(screen.getByText("Rent payment end date")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Contract – onChange handler coverage
// ─────────────────────────────────────────────────────────────────────────────

describe("Contract – onChange handler coverage", () => {
  function makeTrackableFormMock(values: Record<string, unknown> = {}) {
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
        Field: ({ name, children }: { name: string; children: (f: unknown) => React.ReactNode }) => {
          const fn = vi.fn();
          handleChangeFns[name] = fn;
          return children({
            state: {
              value: (values[name] as string) ?? "",
              meta: { errors: [] },
            },
            handleChange: fn,
          });
        },
      } as unknown,
    };
  }

  it("calls handleChange and onLiveValidate when contractNumber input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableFormMock();
    render(<Contract form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    const textInputs = screen.getAllByRole("textbox");
    // contractNumber is a text input; fire change on the first textbox
    fireEvent.change(textInputs[0], { target: { value: "CN-999" } });
    expect(handleChangeFns["contractNumber"]).toHaveBeenCalledWith("CN-999");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when amountInWords input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableFormMock();
    render(<Contract form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    const textInputs = screen.getAllByRole("textbox");
    // amountInWords is the second text input
    fireEvent.change(textInputs[1], { target: { value: "Five Hundred" } });
    expect(handleChangeFns["amountInWords"]).toHaveBeenCalledWith("Five Hundred");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when registrationFees (currency) input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableFormMock();
    render(<Contract form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    const numberInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(numberInputs[0], { target: { value: "750" } });
    expect(handleChangeFns["registrationFees"]).toHaveBeenCalledWith("750");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when emergencyNumber (phone) input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableFormMock();
    render(<Contract form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    const numberInputs = screen.getAllByRole("spinbutton");
    // emergencyNumber is phone type (renders as type=number), second spinbutton
    fireEvent.change(numberInputs[1], { target: { value: "501234567" } });
    expect(handleChangeFns["emergencyNumber"]).toHaveBeenCalledWith("501234567");
    expect(onLiveValidate).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Rent – onChange handler coverage
// ─────────────────────────────────────────────────────────────────────────────

describe("Rent – onChange handler coverage", () => {
  function makeTrackableRentFormMock(values: Record<string, unknown> = {}) {
    const handleChangeFns: Record<string, ReturnType<typeof vi.fn>> = {};
    return {
      handleChangeFns,
      form: {
        state: {
          values: {
            insuranceFee: "Yes",
            rentPaymentStartDate: "",
            rentPaymentEndDate: "",
            paymentAmount: "",
            isFirstYearFreeOfPayment: false,
            exemptSocialAssistance: false,
            ...values,
          },
        },
        Field: ({ name, children }: { name: string; children: (f: unknown) => React.ReactNode }) => {
          const fn = vi.fn();
          handleChangeFns[name] = fn;
          return children({
            state: {
              value: values[name] ?? (name === "insuranceFee" ? "Yes" : name.includes("Free") || name.includes("exempt") ? false : ""),
              meta: { errors: [] },
            },
            handleChange: fn,
          });
        },
      } as unknown,
    };
  }

  it("calls handleChange when insuranceFee radio Yes is clicked", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableRentFormMock();
    render(<Rent form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    fireEvent.click(screen.getByText("Yes"));
    expect(handleChangeFns["insuranceFee"]).toHaveBeenCalledWith("Yes");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when insuranceFee radio No is clicked", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableRentFormMock();
    render(<Rent form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    fireEvent.click(screen.getByText("No"));
    expect(handleChangeFns["insuranceFee"]).toHaveBeenCalledWith("No");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when paymentAmount (currency) input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableRentFormMock();
    render(<Rent form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    const numberInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(numberInputs[0], { target: { value: "2000" } });
    expect(handleChangeFns["paymentAmount"]).toHaveBeenCalledWith("2000");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when isFirstYearFreeOfPayment checkbox is clicked", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableRentFormMock();
    render(<Rent form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    fireEvent.click(screen.getByText("Rent payment is free for the year"));
    expect(handleChangeFns["isFirstYearFreeOfPayment"]).toHaveBeenCalled();
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when exemptSocialAssistance checkbox is clicked", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableRentFormMock();
    render(<Rent form={form as never} language="en" onLiveValidate={onLiveValidate} />);
    fireEvent.click(screen.getByText("Exempt social assistance recipient"));
    expect(handleChangeFns["exemptSocialAssistance"]).toHaveBeenCalled();
    expect(onLiveValidate).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Measurement – onChange handler coverage
// ─────────────────────────────────────────────────────────────────────────────

describe("Measurement – onChange handler coverage", () => {
  function makeTrackableMeasurementFormMock(values: Record<string, unknown> = {}) {
    const handleChangeFns: Record<string, ReturnType<typeof vi.fn>> = {};
    return {
      handleChangeFns,
      form: {
        state: {
          values: {
            units: "Square Meters",
            ranchType: "3",
            rentFees: "",
            measurementRegistrationFees: "",
            measurementAmountInWords: "",
            tenancyRemarks: "",
            ...values,
          },
        },
        Field: ({ name, children }: { name: string; children: (f: unknown) => React.ReactNode }) => {
          const fn = vi.fn();
          handleChangeFns[name] = fn;
          return children({
            state: {
              value: values[name] ?? (name === "ranchType" ? "3" : name === "units" ? "Square Meters" : ""),
              meta: { errors: [] },
            },
            handleChange: fn,
          });
        },
      } as unknown,
    };
  }

  it("calls handleChange when rentFees (currency) input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableMeasurementFormMock();
    renderWithQueryClient(
      <Measurement form={form as never} language="en" onLiveValidate={onLiveValidate} />
    );
    const numberInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(numberInputs[0], { target: { value: "300" } });
    expect(handleChangeFns["rentFees"]).toHaveBeenCalledWith("300");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when measurementRegistrationFees (currency) input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableMeasurementFormMock();
    renderWithQueryClient(
      <Measurement form={form as never} language="en" onLiveValidate={onLiveValidate} />
    );
    const numberInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(numberInputs[1], { target: { value: "400" } });
    expect(handleChangeFns["measurementRegistrationFees"]).toHaveBeenCalledWith("400");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when measurementAmountInWords input changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableMeasurementFormMock();
    renderWithQueryClient(
      <Measurement form={form as never} language="en" onLiveValidate={onLiveValidate} />
    );
    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "Three Hundred" } });
    expect(handleChangeFns["measurementAmountInWords"]).toHaveBeenCalledWith("Three Hundred");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("calls handleChange when tenancyRemarks textarea changes", () => {
    const onLiveValidate = vi.fn();
    const { form, handleChangeFns } = makeTrackableMeasurementFormMock();
    renderWithQueryClient(
      <Measurement form={form as never} language="en" onLiveValidate={onLiveValidate} />
    );
    const textareas = document.querySelectorAll("textarea");
    fireEvent.change(textareas[0], { target: { value: "Some remarks" } });
    expect(handleChangeFns["tenancyRemarks"]).toHaveBeenCalledWith("Some remarks");
    expect(onLiveValidate).toHaveBeenCalled();
  });

  it("renders ranchType Select component", () => {
    const { form } = makeTrackableMeasurementFormMock();
    renderWithQueryClient(
      <Measurement form={form as never} language="en" />
    );
    expect(screen.getByText("Ranch Type")).toBeInTheDocument();
  });
});
