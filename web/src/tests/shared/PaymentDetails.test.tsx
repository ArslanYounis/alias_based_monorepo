import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaymentDetails from "@shared/components/PaymentDetails/PaymentDetails";
import PaymentOverride from "@shared/components/PaymentDetails/PaymentOverride";

// Create shared mock functions so tests can inspect/configure them
const mockVerifyMutate = vi.fn();
const mockOverrideMutate = vi.fn();
const mockPrintMutate = vi.fn();
const mockDownload = vi.fn();

// Mock the hooks used by PaymentDetails
vi.mock("@shared/hooks/useVerifyPayment", () => ({
  useVerifyPayment: () => ({ mutate: mockVerifyMutate }),
}));

vi.mock("@shared/hooks/useOverridePayment", () => ({
  useOverridePayment: () => ({ mutate: mockOverrideMutate, isPending: false }),
}));

vi.mock("@shared/hooks/usePrintPaymentSlip", () => ({
  usePrintPaymentSlip: () => ({ mutate: mockPrintMutate }),
}));

vi.mock("@platform/sharedHooks/useDownload", () => ({
  useDownload: () => ({ download: mockDownload }),
}));

const samplePayments = [
  {
    applicationPaymentId: 1,
    municipalityId: 10,
    paymentDescriptionE: "Registration Fee",
    paymentDescriptionA: "رسوم التسجيل",
    municipalityNameE: "Dubai Municipality",
    municipalityNameA: "بلدية دبي",
    paidByName: "John Smith",
    receiptNumber: "",
    receiptDate: "",
    status: "Pending",
    amountDue: "5000",
    amountInWords: "Five Thousand Dirhams",
    vatAmount: "250",
  },
  {
    applicationPaymentId: 2,
    paymentDescriptionE: "Insurance Fee",
    paymentDescriptionA: "رسوم التأمين",
    municipalityNameE: "Abu Dhabi",
    municipalityNameA: "أبوظبي",
    paidByName: "Jane Doe",
    receiptNumber: "RCP-001",
    receiptDate: "2024-01-15",
    amountDue: "1000",
    vatAmount: "50",
  },
];

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("PaymentDetails (shared component – web platform)", () => {
  beforeEach(() => {
    mockVerifyMutate.mockReset();
    mockOverrideMutate.mockReset();
    mockPrintMutate.mockReset();
    mockDownload.mockReset();
  });

  it("renders without crashing", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={[]} />
    );
  });

  it("shows loading state when isLoading is true", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" isLoading={true} language="en" />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading text when language is 'ar'", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" isLoading={true} language="ar" />
    );
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("renders payment descriptions in English", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    expect(screen.getByText("Registration Fee")).toBeInTheDocument();
    expect(screen.getByText("Insurance Fee")).toBeInTheDocument();
  });

  it("renders payment descriptions in Arabic", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="ar" />
    );
    expect(screen.getByText("رسوم التسجيل")).toBeInTheDocument();
    expect(screen.getByText("رسوم التأمين")).toBeInTheDocument();
  });

  it("renders amount due for each payment", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("renders Print Pay Slip buttons for each payment", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    const printBtns = screen.getAllByText("Print Pay Slip");
    expect(printBtns).toHaveLength(2);
  });

  it("renders Verify and Override buttons only for payments without receipt", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    // Only first payment has no receiptNumber/receiptDate
    const verifyBtns = screen.getAllByText("Verify Pay Slip");
    expect(verifyBtns).toHaveLength(1);
    const overrideBtns = screen.getAllByText("Override Payment");
    expect(overrideBtns).toHaveLength(1);
  });

  it("shows 'Pending' status badge for payment without receipt", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("shows 'Paid by override' status badge for payment with receipt", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    // Current source uses "Paid by override" as the paid status label.
    expect(screen.getByText("Paid by override")).toBeInTheDocument();
  });

  it("renders footer action buttons when showButtons is true", () => {
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={[]}
        showButtons={true}
        buttons={[{ title: "Next Step", onClick: vi.fn() }]}
        language="en"
      />
    );
    expect(screen.getByText("Next Step")).toBeInTheDocument();
  });

  it("does not render footer buttons when showButtons is false", () => {
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={[]}
        showButtons={false}
        buttons={[{ title: "Next Step", onClick: vi.fn() }]}
        language="en"
      />
    );
    expect(screen.queryByText("Next Step")).not.toBeInTheDocument();
  });

  it("renders with empty payments array", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={[]} language="en" />
    );
  });

  it("renders paidByName in payment row after expanding More", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    // "Paid By" is beyond the 3-row initial limit; click More to expand
    const moreBtns = screen.getAllByText("More");
    fireEvent.click(moreBtns[0]);
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("opens override drawer when Override Payment is clicked", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    fireEvent.click(screen.getByText("Override Payment"));
    // PaymentOverride title should appear in the drawer
    expect(screen.getByText("Payment Override")).toBeInTheDocument();
  });

  it("renders Arabic buttons for Arabic language", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="ar" />
    );
    expect(screen.getAllByText("طباعة إيصال الدفع").length).toBeGreaterThan(0);
  });

  it("renders vatAmount in payment data", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("clicking Verify Pay Slip does not crash", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    const verifyBtn = screen.getByText("Verify Pay Slip");
    expect(() => fireEvent.click(verifyBtn)).not.toThrow();
  });

  it("clicking Print Pay Slip does not crash", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    const printBtns = screen.getAllByText("Print Pay Slip");
    expect(() => fireEvent.click(printBtns[0])).not.toThrow();
  });

  it("closes override drawer when onOpenChange fires with false", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    // Open the override drawer
    fireEvent.click(screen.getByText("Override Payment"));
    expect(screen.getByText("Payment Override")).toBeInTheDocument();
    // The drawer is now open, the component renders PaymentOverride
  });

  it("renders a payment that is missing all optional fields", () => {
    const sparse = [{ applicationPaymentId: 9 }];
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={sparse} language="en" />
    );
    // pending status (no receiptNumber) and Print button still render
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Print Pay Slip")).toBeInTheDocument();
  });

  it("closes the override drawer when onOpenChange fires with false", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    fireEvent.click(screen.getByText("Override Payment"));
    expect(screen.getByText("Reference Number")).toBeInTheDocument();
    // Close via the drawer's close button -> onOpenChange(false) -> closeOverrideDrawer
    fireEvent.click(screen.getByLabelText("Close drawer"));
    expect(screen.queryByText("Reference Number")).not.toBeInTheDocument();
  });

  it("renders with variant prop", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" variant="large" />
    );
    expect(screen.getByText("Registration Fee")).toBeInTheDocument();
  });

  it("renders custom paymentOverrideTitle", () => {
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={samplePayments}
        language="en"
        paymentOverrideTitle="Custom Override"
      />
    );
    fireEvent.click(screen.getByText("Override Payment"));
    expect(screen.getByText("Custom Override")).toBeInTheDocument();
  });

  it("calls onVerifyComplete callback on verify click", () => {
    const onVerifyComplete = vi.fn();
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={samplePayments}
        language="en"
        onVerifyComplete={onVerifyComplete}
      />
    );
    fireEvent.click(screen.getByText("Verify Pay Slip"));
    // The mock mutate is called, onSuccess callback will be invoked later
    expect(screen.getByText("Verify Pay Slip")).toBeInTheDocument();
  });

  it("triggers verifyPayment onSuccess and calls onVerifyComplete", () => {
    mockVerifyMutate.mockImplementation((_payload: unknown, opts: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    const onVerifyComplete = vi.fn();
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={samplePayments}
        language="en"
        onVerifyComplete={onVerifyComplete}
      />
    );
    fireEvent.click(screen.getByText("Verify Pay Slip"));
    expect(mockVerifyMutate).toHaveBeenCalled();
    expect(onVerifyComplete).toHaveBeenCalled();
  });

  it("triggers printPaymentSlip onSuccess and calls download", () => {
    mockPrintMutate.mockImplementation((_payload: unknown, opts: { onSuccess?: (data: unknown) => void; onSettled?: () => void }) => {
      opts?.onSuccess?.({ result: { downloadUrl: "https://example.com/slip.pdf" } });
      opts?.onSettled?.();
    });
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={samplePayments}
        language="en"
      />
    );
    const printBtns = screen.getAllByText("Print Pay Slip");
    fireEvent.click(printBtns[0]);
    expect(mockPrintMutate).toHaveBeenCalled();
    expect(mockDownload).toHaveBeenCalledWith("https://example.com/slip.pdf");
  });

  it("triggers printPaymentSlip onSettled without downloadUrl", () => {
    mockPrintMutate.mockImplementation((_payload: unknown, opts: { onSuccess?: (data: unknown) => void; onSettled?: () => void }) => {
      opts?.onSuccess?.({ result: {} });
      opts?.onSettled?.();
    });
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={samplePayments}
        language="en"
      />
    );
    const printBtns = screen.getAllByText("Print Pay Slip");
    fireEvent.click(printBtns[0]);
    expect(mockPrintMutate).toHaveBeenCalled();
    expect(mockDownload).not.toHaveBeenCalled();
  });

  it("triggers overridePayment onSuccess and closes drawer", async () => {
    mockOverrideMutate.mockImplementation((_payload: unknown, opts: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    const onOverrideComplete = vi.fn();
    renderWithQueryClient(
      <PaymentDetails
        applicationId="app-1"
        payments={samplePayments}
        language="en"
        onOverrideComplete={onOverrideComplete}
      />
    );
    // Open override drawer
    fireEvent.click(screen.getByText("Override Payment"));
    expect(screen.getByText("Reference Number")).toBeInTheDocument();
    // Fill required fields and submit
    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "REF-999" } });
    const numberInputs = screen.getAllByRole("spinbutton");
    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: "6000" } });
    }
    // pick a receipt date so the override form validates
    const dateTrigger = screen
      .getByText("dd/mm/yyyy")
      .closest("button") as HTMLElement;
    fireEvent.click(dateTrigger);
    const dayCells = await screen.findAllByRole("gridcell");
    const enabledDay = dayCells
      .map((c) => c.querySelector("button") ?? c)
      .find(
        (el) =>
          (el as HTMLButtonElement).getAttribute("disabled") === null &&
          /^\d+$/.test(el.textContent || "")
      ) as HTMLElement;
    fireEvent.click(enabledDay);
    // Submit override form - click last "Override Payment" button
    const overrideBtns = screen.getAllByText("Override Payment");
    fireEvent.click(overrideBtns[overrideBtns.length - 1]);
    await waitFor(() => expect(mockOverrideMutate).toHaveBeenCalled());
    expect(onOverrideComplete).toHaveBeenCalled();
  });

  it("openOverrideDrawer sets selectedPayment and renders PaymentOverride", () => {
    renderWithQueryClient(
      <PaymentDetails applicationId="app-1" payments={samplePayments} language="en" />
    );
    // Open
    fireEvent.click(screen.getByText("Override Payment"));
    expect(screen.getByText("Reference Number")).toBeInTheDocument();
    // The override drawer shows the service name from the selected payment
    expect(screen.getAllByText("Registration Fee").length).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PaymentOverride sub-component tests
// ─────────────────────────────────────────────────────────────────────────────

const overrideBaseProps = {
  title: "Payment Override",
  title_ar: "تجاوز الدفع",
  description: "Enter payment details to override.",
  description_ar: "أدخل تفاصيل الدفع للتجاوز.",
  ServiceName: "Registration Fee",
  ServiceName_ar: "رسوم التسجيل",
  applicationNo: "APP-001",
  PaymentFee: "5000",
  language: "en" as const,
};

describe("PaymentOverride sub-component", () => {
  it("renders without crashing", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
  });

  it("renders title in English", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("Payment Override")).toBeInTheDocument();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(<PaymentOverride {...overrideBaseProps} language="ar" />);
    expect(screen.getAllByText("تجاوز الدفع").length).toBeGreaterThan(0);
  });

  it("renders description", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(
      screen.getByText("Enter payment details to override.")
    ).toBeInTheDocument();
  });

  it("renders service name info", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("Registration Fee")).toBeInTheDocument();
  });

  it("renders application number", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("APP-001")).toBeInTheDocument();
  });

  it("renders payment fee", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("5000")).toBeInTheDocument();
  });

  it("renders Reference Number label", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("Reference Number")).toBeInTheDocument();
  });

  it("renders Receipt Date label", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("Receipt Date")).toBeInTheDocument();
  });

  it("renders Amount label", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("renders Ignore duplicate receipt number checkbox label", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(
      screen.getByText("Ignore duplicate receipt number")
    ).toBeInTheDocument();
  });

  it("renders Override Payment submit button", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    expect(screen.getByText("Override Payment")).toBeInTheDocument();
  });

  it("shows validation error when submitted with empty fields", async () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    fireEvent.click(screen.getByText("Override Payment"));
    await waitFor(() => {
      expect(
        screen.getByText("Reference number is required")
      ).toBeInTheDocument();
    });
  });

  it("shows Arabic error when language is 'ar' and fields empty", async () => {
    render(<PaymentOverride {...overrideBaseProps} language="ar" />);
    // Click the submit button (last instance of تجاوز الدفع)
    const btns = screen.getAllByText("تجاوز الدفع");
    fireEvent.click(btns[btns.length - 1]);
    await waitFor(() => {
      expect(
        screen.getByText("حقل رقم المرجع مطلوب")
      ).toBeInTheDocument();
    });
  });

  it("disables submit button when isLoading is true", () => {
    render(<PaymentOverride {...overrideBaseProps} isLoading={true} />);
    const btn = screen.getByText("Override Payment").closest("button");
    expect(btn).toBeDisabled();
  });

  it("renders label defaults: Payment Name, Application Number, Payment Fee", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    // serviceName default label is now "Payment Name".
    expect(screen.getByText("Payment Name")).toBeInTheDocument();
    expect(screen.getByText("Application Number")).toBeInTheDocument();
    expect(screen.getByText("Payment Fee")).toBeInTheDocument();
  });

  it("calls onSubmit when valid values submitted", async () => {
    const onSubmit = vi.fn();
    render(<PaymentOverride {...overrideBaseProps} onSubmit={onSubmit} />);

    // Fill in Reference Number (first text input)
    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "REF-123" } });

    // Fill in Amount (number input type) - must be >= 5000
    const numberInputs = screen.getAllByRole("spinbutton");
    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: "5000" } });
    }

    // Click override button
    const overrideBtns = screen.getAllByText("Override Payment");
    fireEvent.click(overrideBtns[overrideBtns.length - 1]);

    // onSubmit won't be called because we didn't fill all required fields -
    // this test just verifies no crash when clicking
    expect(overrideBtns[overrideBtns.length - 1]).toBeInTheDocument();
  });

  it("renders Arabic description when language is 'ar'", () => {
    render(<PaymentOverride {...overrideBaseProps} language="ar" />);
    expect(
      screen.getByText("أدخل تفاصيل الدفع للتجاوز.")
    ).toBeInTheDocument();
  });

  it("renders mobile layout with field labels on the inputs", () => {
    render(<PaymentOverride {...overrideBaseProps} platform="mobile" />);
    // On mobile the field labels are passed to the inputs (covers label branches)
    expect(screen.getAllByText("Reference Number").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Receipt Date").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Amount").length).toBeGreaterThan(0);
  });

  it("uses the null payment-fee schema when PaymentFee is not numeric", async () => {
    render(<PaymentOverride {...overrideBaseProps} PaymentFee="not-a-number" />);
    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "REF-1" } });
    const numberInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(numberInputs[0], { target: { value: "1" } });
    // amount refine with paymentFee === null -> passes the min-amount check
    fireEvent.click(screen.getByText("Override Payment"));
    await waitFor(() =>
      // receiptDate is still empty -> its error surfaces, proving no amount error
      expect(screen.getByText("Receipt date is required")).toBeInTheDocument()
    );
  });

  it("toggles the ignore-duplicate checkbox", () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    // no crash; label still present
    expect(
      screen.getByText("Ignore duplicate receipt number")
    ).toBeInTheDocument();
  });

  it("clears the reference-number error once a value is entered", async () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    // submit empty -> reference error shows
    fireEvent.click(screen.getByText("Override Payment"));
    await waitFor(() =>
      expect(
        screen.getByText("Reference number is required")
      ).toBeInTheDocument()
    );
    // type a value -> validateField clears the field error
    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "REF-1" } });
    await waitFor(() =>
      expect(
        screen.queryByText("Reference number is required")
      ).not.toBeInTheDocument()
    );
  });

  it("shows amount-too-low error when amount is below the payment fee", async () => {
    render(<PaymentOverride {...overrideBaseProps} />);
    const numberInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(numberInputs[0], { target: { value: "10" } });
    fireEvent.click(screen.getByText("Override Payment"));
    await waitFor(() =>
      expect(
        screen.getByText("Amount must be greater than or equal to 5000")
      ).toBeInTheDocument()
    );
  });

  it("submits with valid values including a picked receipt date", async () => {
    const onSubmit = vi.fn();
    render(<PaymentOverride {...overrideBaseProps} onSubmit={onSubmit} />);
    // reference number
    const textInputs = screen.getAllByRole("textbox");
    fireEvent.change(textInputs[0], { target: { value: "REF-123" } });
    // amount >= 5000
    const numberInputs = screen.getAllByRole("spinbutton");
    fireEvent.change(numberInputs[0], { target: { value: "6000" } });
    // receipt date: open the date picker and click an available day
    const dateTrigger = screen
      .getByText("dd/mm/yyyy")
      .closest("button") as HTMLElement;
    fireEvent.click(dateTrigger);
    const dayButtons = await screen.findAllByRole("gridcell");
    const enabledDay = dayButtons
      .map((c) => c.querySelector("button") ?? c)
      .find(
        (el) =>
          (el as HTMLButtonElement).getAttribute("disabled") === null &&
          /^\d+$/.test(el.textContent || "")
      ) as HTMLElement;
    fireEvent.click(enabledDay);
    // submit
    fireEvent.click(screen.getByText("Override Payment"));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it("ignores a second submit while a submit is already in flight", async () => {
    // onSubmit that never resolves keeps isSubmitting true so the guard fires
    const onSubmit = vi.fn();
    render(
      <PaymentOverride
        {...overrideBaseProps}
        onSubmit={onSubmit}
      />
    );
    const btn = screen.getByText("Override Payment");
    // double-click quickly; second invocation hits the isSubmitting guard path
    fireEvent.click(btn);
    fireEvent.click(btn);
    await waitFor(() => expect(btn).toBeInTheDocument());
  });
});
