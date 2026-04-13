import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuditRemarks } from "@platform/AuditRemarks";

// Minimal agent fixture
const agent = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+971-555-0000",
  image: "https://example.com/avatar.png",
};

describe("AuditRemarks", () => {
  // ── Basic render ──────────────────────────────────────────────────────────

  it("renders without crashing with minimal props", () => {
    render(<AuditRemarks agent={agent} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders agent email and phone", () => {
    render(<AuditRemarks agent={agent} />);
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+971-555-0000")).toBeInTheDocument();
  });

  it("renders agent image", () => {
    render(<AuditRemarks agent={agent} />);
    const img = screen.getByAltText("agent") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("avatar.png");
  });

  it("renders agent image element even when image is not provided", () => {
    render(<AuditRemarks agent={{ ...agent, image: undefined }} />);
    const img = screen.getByAltText("agent") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    // The component sets src={agent.image || ""}, so src attr is ""
    expect(img.getAttribute("src") ?? "").toBe("");
  });

  // ── Title ─────────────────────────────────────────────────────────────────

  it("renders title when provided", () => {
    render(<AuditRemarks agent={agent} title="Audit Review" />);
    expect(screen.getByText("Audit Review")).toBeInTheDocument();
  });

  it("does not render heading when title is not provided", () => {
    render(<AuditRemarks agent={agent} />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("renders Arabic title when language is 'ar'", () => {
    render(
      <AuditRemarks
        agent={agent}
        title="Audit Review"
        title_ar="مراجعة التدقيق"
        language="ar"
      />
    );
    expect(screen.getByText("مراجعة التدقيق")).toBeInTheDocument();
  });

  // ── RTL direction ─────────────────────────────────────────────────────────

  it("applies ltr direction for English", () => {
    const { container } = render(<AuditRemarks agent={agent} language="en" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("dir", "ltr");
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(<AuditRemarks agent={agent} language="ar" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("dir", "rtl");
  });

  // ── Textarea / remarks ────────────────────────────────────────────────────

  it("renders the auditor-remarks textarea", () => {
    render(<AuditRemarks agent={agent} value="Some remarks" />);
    const textareas = screen.getAllByRole("textbox");
    expect(textareas[0]).toHaveValue("Some remarks");
  });

  it("calls onChange when the textarea value changes", () => {
    const onChange = vi.fn();
    render(<AuditRemarks agent={agent} value="" onChange={onChange} />);
    const textarea = screen.getAllByRole("textbox")[0];
    fireEvent.change(textarea, { target: { value: "new text" } });
    expect(onChange).toHaveBeenCalledWith("new text");
  });

  it("does not crash when onChange is undefined", () => {
    render(<AuditRemarks agent={agent} value="" />);
    const textarea = screen.getAllByRole("textbox")[0];
    expect(() =>
      fireEvent.change(textarea, { target: { value: "x" } })
    ).not.toThrow();
  });

  // ── Registration remarks ──────────────────────────────────────────────────

  it("renders registration remarks section when registrationRemarks is true", () => {
    render(<AuditRemarks agent={agent} registrationRemarks />);
    const textareas = screen.getAllByRole("textbox");
    // The registration remarks textarea is the second one (read-only)
    expect(textareas[1]).toBeInTheDocument();
    expect(textareas[1]).toHaveAttribute("readonly");
  });

  it("does not render registration remarks section when registrationRemarks is falsy", () => {
    render(<AuditRemarks agent={agent} />);
    const textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(1);
  });

  // ── Application details ───────────────────────────────────────────────────

  it("renders application details when provided", () => {
    const applicationDetails = [
      {
        applicationNumber: "APP-001",
        applicationDate: "2024-01-01",
        referenceNumber: "REF-001",
      },
    ];
    render(<AuditRemarks agent={agent} applicationDetails={applicationDetails} />);
    expect(screen.getByText("APP-001")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    expect(screen.getByText("REF-001")).toBeInTheDocument();
  });

  // ── Plots ─────────────────────────────────────────────────────────────────

  it("renders plots and calls onPlotClick on View click", () => {
    const onPlotClick = vi.fn();
    const plots = [
      {
        code: "PLT-001",
        municipality: "Abu Dhabi",
        zone: "Zone A",
        sector: "S1",
        address: "123 Main St",
      },
    ];
    render(<AuditRemarks agent={agent} plots={plots} onPlotClick={onPlotClick} />);
    expect(screen.getByText("PLT-001")).toBeInTheDocument();
    // The "View" button for plots
    const viewButtons = screen.getAllByRole("button").filter(
      (b) => b.textContent?.includes("View")
    );
    fireEvent.click(viewButtons[0]);
    expect(onPlotClick).toHaveBeenCalledWith({
      PlotData: plots[0],
      action: "view",
    });
  });

  it("renders Arabic View label for plots when language is 'ar'", () => {
    const plots = [
      {
        code: "PLT-001",
        municipality: "Abu Dhabi",
        zone: "Zone A",
        sector: "S1",
        address: "123 Main St",
      },
    ];
    render(<AuditRemarks agent={agent} plots={plots} language="ar" />);
    expect(screen.getByText("عرض")).toBeInTheDocument();
  });

  // ── Owners ────────────────────────────────────────────────────────────────

  it("renders owners and calls onOwnerClick with correct action", () => {
    const onOwnerClick = vi.fn();
    const owners = [
      { name: "Alice", familyBook: "FB-1", city: "Dubai", propertyCard: "PC-1" },
    ];
    render(
      <AuditRemarks agent={agent} owners={owners} onOwnerClick={onOwnerClick} />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();

    // view / edit / plots buttons are in order per owner
    const buttons = screen.getAllByRole("button");
    // view is first owner button
    const viewBtn = buttons.find((b) => b.textContent?.trim() === "View");
    const editBtn = buttons.find((b) => b.textContent?.trim() === "Edit");
    const plotsBtn = buttons.find((b) => b.textContent?.trim() === "Plots");

    fireEvent.click(viewBtn!);
    expect(onOwnerClick).toHaveBeenCalledWith({
      ownerData: owners[0],
      action: "view",
    });

    fireEvent.click(editBtn!);
    expect(onOwnerClick).toHaveBeenCalledWith({
      ownerData: owners[0],
      action: "edit",
    });

    fireEvent.click(plotsBtn!);
    expect(onOwnerClick).toHaveBeenCalledWith({
      ownerData: owners[0],
      action: "plot",
    });
  });

  // ── Documents ────────────────────────────────────────────────────────────

  it("does not render Supporting Documents heading when documents is empty", () => {
    render(<AuditRemarks agent={agent} documents={[]} />);
    expect(screen.queryByText("Supporting Documents")).not.toBeInTheDocument();
  });

  it("renders documents when provided and calls onDocumentPress on click", () => {
    const onDocumentPress = vi.fn();
    const documents = [
      {
        documentNameE: "Contract.pdf",
        documentNameA: "عقد.pdf",
        downloadUrl: "https://example.com/contract.pdf",
      },
    ];
    render(
      <AuditRemarks
        agent={agent}
        documents={documents}
        onDocumentPress={onDocumentPress}
      />
    );
    expect(screen.getByText("Contract.pdf")).toBeInTheDocument();
    // Document row has role="button"
    const docBtn = screen.getByRole("button", { name: /contract\.pdf/i });
    fireEvent.click(docBtn);
    expect(onDocumentPress).toHaveBeenCalledWith("https://example.com/contract.pdf");
  });

  it("renders Arabic document name when language is 'ar'", () => {
    const documents = [
      {
        documentNameE: "Contract.pdf",
        documentNameA: "عقد.pdf",
        downloadUrl: "https://example.com/contract.pdf",
      },
    ];
    render(<AuditRemarks agent={agent} documents={documents} language="ar" />);
    expect(screen.getByText("عقد.pdf")).toBeInTheDocument();
  });

  it("opens a new tab when onDocumentPress is not provided", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const documents = [
      {
        documentNameE: "Contract.pdf",
        documentNameA: "عقد.pdf",
        downloadUrl: "https://example.com/contract.pdf",
      },
    ];
    render(<AuditRemarks agent={agent} documents={documents} />);
    fireEvent.click(screen.getByText("Contract.pdf"));
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/contract.pdf",
      "_blank"
    );
    openSpy.mockRestore();
  });
});
