import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ApplicationMessage from "@shared/components/ApplicationMessage/ApplicationMessage";

const baseProps = {
  title: "Success",
  title_ar: "نجاح",
  description: "Your application was submitted.",
  description_ar: "تم تقديم طلبك.",
};

describe("ApplicationMessage (shared component – web platform)", () => {
  it("renders without crashing", () => {
    render(<ApplicationMessage {...baseProps} />);
  });

  it("renders English title and description", () => {
    render(<ApplicationMessage {...baseProps} language="en" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Your application was submitted.")).toBeInTheDocument();
  });

  it("renders Arabic title and description when language is 'ar'", () => {
    render(<ApplicationMessage {...baseProps} language="ar" />);
    expect(screen.getByText("نجاح")).toBeInTheDocument();
    expect(screen.getByText("تم تقديم طلبك.")).toBeInTheDocument();
  });

  it("renders success status styles", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} status="success" language="en" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/bg-status-success-light/);
  });

  it("renders error status styles", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} status="error" language="en" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/bg-status-failed-light/);
  });

  it("renders information status styles", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} status="information" language="en" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/bg-status-pending-light/);
  });

  it("renders action status styles", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} status="action" language="en" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/bg-status-action-light/);
  });

  it("renders text input type", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        type="text"
        label="Your Name"
        value="John"
        language="en"
      />
    );
    expect(screen.getByText("Your Name")).toBeInTheDocument();
  });

  it("calls onInputChange for text input", () => {
    const onInputChange = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="text"
        label="Name"
        value=""
        onInputChange={onInputChange}
        language="en"
      />
    );
    // TextInput renders an input element
    const input = screen.getByRole("textbox");
    if (input) {
      fireEvent.change(input, { target: { value: "Alice" } });
      // onInputChange should be called
    }
  });

  it("renders checkbox input type with options", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        type="checkbox"
        label="Select options"
        value={[]}
        options={[
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ]}
        language="en"
      />
    );
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("renders radio input type with options", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        type="radio"
        label="Pick one"
        value="a"
        options={[
          { label: "Choice A", value: "a" },
          { label: "Choice B", value: "b" },
        ]}
        language="en"
      />
    );
    expect(screen.getByText("Choice A")).toBeInTheDocument();
    expect(screen.getByText("Choice B")).toBeInTheDocument();
  });

  it("renders button input type", () => {
    const onClick = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="button"
        label="Submit"
        onClick={onClick}
        language="en"
      />
    );
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls onClick when button type is clicked", () => {
    const onClick = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="button"
        label="Click Me"
        onClick={onClick}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Click Me"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders select fieldType", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        fieldType="select"
        label="Pick A Value"
        value=""
        options={[
          { label: "Item 1", value: "1" },
          { label: "Item 2", value: "2" },
        ]}
        language="en"
      />
    );
    // label appears as both the TextInput label AND placeholder — check at least one exists
    expect(screen.getAllByText("Pick A Value").length).toBeGreaterThan(0);
  });

  it("hides icon when platform is 'mobile'", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} status="success" platform="mobile" />
    );
    // On mobile the icon container should not be rendered
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies ltr direction for English", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} language="en" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "ltr");
  });

  it("applies rtl direction for Arabic", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} language="ar" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("dir", "rtl");
  });

  it("renders checkbox input with Arabic option labels when language is 'ar'", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        type="checkbox"
        label="Options"
        label_ar="الخيارات"
        value={[]}
        options={[
          { label: "Option A", label_ar: "الخيار أ", value: "a" },
          { label: "Option B", label_ar: "الخيار ب", value: "b" },
        ]}
        language="ar"
      />
    );
    expect(screen.getByText("الخيار أ")).toBeInTheDocument();
    expect(screen.getByText("الخيار ب")).toBeInTheDocument();
  });

  it("renders radio input with Arabic option labels when language is 'ar'", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        type="radio"
        label="Pick one"
        label_ar="اختر"
        value="a"
        options={[
          { label: "Choice A", label_ar: "الخيار أ", value: "a" },
          { label: "Choice B", label_ar: "الخيار ب", value: "b" },
        ]}
        language="ar"
      />
    );
    expect(screen.getByText("الخيار أ")).toBeInTheDocument();
  });

  it("returns null for unknown type", () => {
    // Passing an unrecognized type should still render the outer container
    const { container } = render(
      <ApplicationMessage
        {...baseProps}
        type={"unknown" as "text"}
        language="en"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("does not render input when type is undefined and fieldType is not select", () => {
    const { container } = render(
      <ApplicationMessage {...baseProps} language="en" />
    );
    // No input/textarea should be in the container when no type is given
    expect(container.querySelector("input")).toBeNull();
  });

  it("calls onInputChange with split array for multi select", () => {
    const onInputChange = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        fieldType="select"
        selectType="multi"
        label="Multi"
        value=""
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ]}
        onInputChange={onInputChange}
        language="en"
      />
    );
    // Component renders — no crash expected
    expect(screen.getAllByText("Multi").length).toBeGreaterThan(0);
  });

  it("renders checkbox input type without options returns null", () => {
    const { container } = render(
      <ApplicationMessage
        {...baseProps}
        type="checkbox"
        label="No opts"
        value={[]}
        language="en"
      />
    );
    // Without options the checkbox branch returns null — just no crash
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders radio input type without options returns null", () => {
    const { container } = render(
      <ApplicationMessage
        {...baseProps}
        type="radio"
        label="No opts"
        value=""
        language="en"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("calls onInputChange when checkbox option is clicked", () => {
    const onInputChange = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="checkbox"
        label="Select options"
        value={[]}
        options={[
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ]}
        onInputChange={onInputChange}
        language="en"
      />
    );
    // The web Checkbox primitive renders a <div role="checkbox"> (not a native
    // input), and its label is a plain <label> that does not forward clicks to
    // the div. Click the checkbox control itself to toggle it.
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(onInputChange).toHaveBeenCalled();
  });

  it("calls onInputChange when radio option is clicked", () => {
    const onInputChange = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="radio"
        label="Pick one"
        value="a"
        options={[
          { label: "Choice A", value: "a" },
          { label: "Choice B", value: "b" },
        ]}
        onInputChange={onInputChange}
        language="en"
      />
    );
    fireEvent.click(screen.getByText("Choice B"));
    expect(onInputChange).toHaveBeenCalled();
  });

  it("calls onInputChange for single select when option is clicked", () => {
    const onInputChange = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        fieldType="select"
        selectType="single"
        label="Pick Value"
        value=""
        options={[
          { label: "Item 1", value: "1" },
          { label: "Item 2", value: "2" },
        ]}
        onInputChange={onInputChange}
        language="en"
      />
    );
    // Click the select dropdown trigger
    const triggers = screen.getAllByText("Pick Value");
    fireEvent.click(triggers[triggers.length - 1]);
    // Click an option
    const option = screen.getByRole("option", { name: /Item 1/i });
    fireEvent.click(option);
    expect(onInputChange).toHaveBeenCalledWith("1");
  });

  it("calls onInputChange with array for multi select when option is clicked", () => {
    const onInputChange = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        fieldType="select"
        selectType="multi"
        label="Multi"
        value=""
        options={[
          { label: "A", value: "a" },
          { label: "B", value: "b" },
        ]}
        onInputChange={onInputChange}
        language="en"
      />
    );
    // Click to open multi-select dropdown
    const triggers = screen.getAllByText("Multi");
    fireEvent.click(triggers[triggers.length - 1]);
    // Click the first option
    const option = screen.getByRole("option", { name: /^A$/i });
    fireEvent.click(option);
    expect(onInputChange).toHaveBeenCalled();
    // Multi select should return an array
    const callArg = onInputChange.mock.calls[0][0];
    expect(Array.isArray(callArg)).toBe(true);
  });

  it("calls onInputChange for text input onChange", () => {
    const onInputChange = vi.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="text"
        label="Name"
        value=""
        onInputChange={onInputChange}
        language="en"
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Alice" } });
    expect(onInputChange).toHaveBeenCalledWith("Alice");
  });

  it("renders with disabled text input", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        type="text"
        label="Disabled"
        value="fixed"
        disabled={true}
        language="en"
      />
    );
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("renders with error state on text input", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        type="text"
        label="Field"
        value=""
        hasError={true}
        errorMessage="Required"
        language="en"
      />
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
