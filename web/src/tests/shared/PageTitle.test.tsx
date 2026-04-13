import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PageTitle from "@shared/components/PageTitle/PageTitle";

describe("PageTitle (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<PageTitle />);
  });

  it("renders English label", () => {
    render(<PageTitle label="Dashboard" label_ar="لوحة التحكم" language="en" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders Arabic label when language is 'ar'", () => {
    render(<PageTitle label="Dashboard" label_ar="لوحة التحكم" language="ar" />);
    expect(screen.getByText("لوحة التحكم")).toBeInTheDocument();
  });

  it("falls back to label when label_ar is empty in 'ar' mode", () => {
    render(<PageTitle label="Fallback" label_ar="" language="ar" />);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  it("does not render buttons when showButtons is false", () => {
    render(
      <PageTitle
        label="Title"
        showButtons={false}
        buttons={[{ title: "Create", onClick: vi.fn() }]}
      />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders buttons when showButtons is true", () => {
    render(
      <PageTitle
        label="Title"
        showButtons={true}
        buttons={[{ title: "Create New", onClick: vi.fn() }]}
      />
    );
    expect(screen.getByText("Create New")).toBeInTheDocument();
  });

  it("calls button onClick when button is clicked", () => {
    const onClick = vi.fn();
    render(
      <PageTitle
        label="Title"
        showButtons={true}
        buttons={[{ title: "Action", onClick }]}
      />
    );
    fireEvent.click(screen.getByText("Action"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders multiple buttons", () => {
    render(
      <PageTitle
        label="Title"
        showButtons={true}
        buttons={[
          { title: "Button 1", onClick: vi.fn() },
          { title: "Button 2", onClick: vi.fn() },
        ]}
      />
    );
    expect(screen.getByText("Button 1")).toBeInTheDocument();
    expect(screen.getByText("Button 2")).toBeInTheDocument();
  });

  it("applies ltr direction for English", () => {
    const { container } = render(<PageTitle label="Title" language="en" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "ltr");
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(<PageTitle label="عنوان" language="ar" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });
});
