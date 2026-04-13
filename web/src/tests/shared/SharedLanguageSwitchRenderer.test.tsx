import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SharedLanguageSwitchRenderer from "@shared/components/SharedLanguageSwitchRenderer";

describe("SharedLanguageSwitchRenderer", () => {
  it("renders without crashing", () => {
    render(
      <SharedLanguageSwitchRenderer language="en" value="Hello" value_ar="مرحبا" />
    );
  });

  it("renders English value when language is 'en'", () => {
    render(
      <SharedLanguageSwitchRenderer language="en" value="Hello" value_ar="مرحبا" />
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders Arabic value when language is 'ar'", () => {
    render(
      <SharedLanguageSwitchRenderer language="ar" value="Hello" value_ar="مرحبا" />
    );
    expect(screen.getByText("مرحبا")).toBeInTheDocument();
  });

  it("falls back to value when value_ar is undefined and language is 'ar'", () => {
    render(
      <SharedLanguageSwitchRenderer language="ar" value="Fallback" />
    );
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  it("renders nothing when both value and value_ar are undefined", () => {
    const { container } = render(
      <SharedLanguageSwitchRenderer language="en" />
    );
    expect(container.textContent).toBe("");
  });

  it("renders only Arabic text in ar mode", () => {
    render(
      <SharedLanguageSwitchRenderer language="ar" value="English" value_ar="عربي" />
    );
    expect(screen.queryByText("English")).not.toBeInTheDocument();
    expect(screen.getByText("عربي")).toBeInTheDocument();
  });

  it("renders only English text in en mode", () => {
    render(
      <SharedLanguageSwitchRenderer language="en" value="English" value_ar="عربي" />
    );
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.queryByText("عربي")).not.toBeInTheDocument();
  });
});
