import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ServiceSelectRow from "@shared/components/ServiceSelectRow";

describe("ServiceSelectRow (shared component – web platform)", () => {
  it("renders the label via checkbox", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" />);
    expect(screen.getByText("Block A")).toBeInTheDocument();
  });

  it("renders Arabic label when language=ar", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" label_ar="بلوك أ" language="ar" />
    );
    expect(screen.getByText("بلوك أ")).toBeInTheDocument();
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<ServiceSelectRow id="row-1" label="Block A" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <ServiceSelectRow id="row-1" label="Block A" language="ar" />
    );
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("renders a tag when tag is provided", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" tag="Existing Block" />);
    expect(screen.getByText("Existing Block")).toBeInTheDocument();
  });

  it("renders Arabic tag when language=ar", () => {
    render(
      <ServiceSelectRow
        id="row-1"
        label="Block A"
        tag="Existing Block"
        tag_ar="كتلة موجودة"
        language="ar"
      />
    );
    expect(screen.getByText("كتلة موجودة")).toBeInTheDocument();
  });

  it("renders a value when no tag is provided", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" value="AED 100" />);
    expect(screen.getByText("AED 100")).toBeInTheDocument();
  });

  it("does not render value when tag is present (tag wins)", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" tag="Tag" value="Value" />
    );
    expect(screen.getByText("Tag")).toBeInTheDocument();
    expect(screen.queryByText("Value")).not.toBeInTheDocument();
  });

  it("renders neither tag nor value when both absent", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" />);
    expect(screen.queryByText("Existing Block")).not.toBeInTheDocument();
  });

  it("fires onChange when the checkbox is toggled", () => {
    const onChange = vi.fn();
    render(<ServiceSelectRow id="row-1" label="Block A" onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("row-1", true);
  });

  it("renders checked state", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" checked />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("renders disabled state", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
  });

  it("renders without bottom border when showBorder=false", () => {
    const { container } = render(
      <ServiceSelectRow id="row-1" label="Block A" showBorder={false} />
    );
    expect((container.firstChild as HTMLElement).className).not.toContain(
      "border-b-border-dimmed"
    );
  });

  it("renders mobile padding when platform=mobile", () => {
    const { container } = render(
      <ServiceSelectRow id="row-1" label="Block A" platform="mobile" />
    );
    expect((container.firstChild as HTMLElement).className).toContain("py-s");
  });

  it("toggling with no onChange handler uses the default no-op", () => {
    render(<ServiceSelectRow id="row-1" label="Block A" />);
    // Should not throw when the default onChange runs.
    expect(() => fireEvent.click(screen.getByRole("checkbox"))).not.toThrow();
  });

  it("falls back to English tag when only tag is set and language=ar", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" tag="OnlyEn" language="ar" />
    );
    expect(screen.getByText("OnlyEn")).toBeInTheDocument();
  });

  it("falls back to English value when only value is set and language=ar", () => {
    render(
      <ServiceSelectRow id="row-1" label="Block A" value="ValEn" language="ar" />
    );
    expect(screen.getByText("ValEn")).toBeInTheDocument();
  });

  it("renders Arabic value when value_ar is provided", () => {
    render(
      <ServiceSelectRow
        id="row-1"
        label="Block A"
        value="ValEn"
        value_ar="قيمة"
        language="ar"
      />
    );
    expect(screen.getByText("قيمة")).toBeInTheDocument();
  });
});
