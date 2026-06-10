import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  PaymentIcon,
  NoPaymentIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  CheckIcon,
  SendIcon,
} from "@platform/icons";

describe("icons", () => {
  // ── PaymentIcon ────────────────────────────────────────────────────────────

  it("PaymentIcon renders an SVG", () => {
    const { container } = render(<PaymentIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("PaymentIcon SVG has expected dimensions", () => {
    const { container } = render(<PaymentIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "50");
    expect(svg).toHaveAttribute("height", "50");
  });

  // ── NoPaymentIcon ──────────────────────────────────────────────────────────

  it("NoPaymentIcon renders an SVG", () => {
    const { container } = render(<NoPaymentIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("NoPaymentIcon SVG has expected dimensions", () => {
    const { container } = render(<NoPaymentIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "50");
    expect(svg).toHaveAttribute("height", "50");
  });

  // ── ChevronLeftIcon ────────────────────────────────────────────────────────

  it("ChevronLeftIcon renders an SVG", () => {
    const { container } = render(<ChevronLeftIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("ChevronLeftIcon uses default size 24", () => {
    const { container } = render(<ChevronLeftIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("ChevronLeftIcon accepts custom size", () => {
    const { container } = render(<ChevronLeftIcon size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("ChevronLeftIcon applies className", () => {
    const { container } = render(<ChevronLeftIcon className="custom-class" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("custom-class");
  });

  // ── ChevronRightIcon ───────────────────────────────────────────────────────

  it("ChevronRightIcon renders an SVG", () => {
    const { container } = render(<ChevronRightIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("ChevronRightIcon accepts custom size", () => {
    const { container } = render(<ChevronRightIcon size={20} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "20");
  });

  it("ChevronRightIcon applies className", () => {
    const { container } = render(<ChevronRightIcon className="text-blue-500" />);
    expect(container.querySelector("svg")).toHaveClass("text-blue-500");
  });

  // ── ChevronDownIcon ────────────────────────────────────────────────────────

  it("ChevronDownIcon renders an SVG", () => {
    const { container } = render(<ChevronDownIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("ChevronDownIcon uses default size 24", () => {
    const { container } = render(<ChevronDownIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
  });

  it("ChevronDownIcon accepts custom size", () => {
    const { container } = render(<ChevronDownIcon size={16} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
  });

  // ── ChevronUpIcon ──────────────────────────────────────────────────────────

  it("ChevronUpIcon renders an SVG", () => {
    const { container } = render(<ChevronUpIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("ChevronUpIcon accepts custom size", () => {
    const { container } = render(<ChevronUpIcon size={18} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "18");
  });

  // ── PlusIcon ───────────────────────────────────────────────────────────────

  it("PlusIcon renders an SVG", () => {
    const { container } = render(<PlusIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("PlusIcon uses default size 24", () => {
    const { container } = render(<PlusIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
  });

  it("PlusIcon applies className", () => {
    const { container } = render(<PlusIcon className="icon-class" />);
    expect(container.querySelector("svg")).toHaveClass("icon-class");
  });

  // ── CheckIcon ──────────────────────────────────────────────────────────────

  it("CheckIcon renders an SVG", () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("CheckIcon renders a polyline path", () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector("polyline")).toBeInTheDocument();
  });

  // ── SendIcon ───────────────────────────────────────────────────────────────

  it("SendIcon renders an SVG", () => {
    const { container } = render(<SendIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  // ── All icons render without errors ───────────────────────────────────────

  it.each([
    ["PaymentIcon", PaymentIcon],
    ["NoPaymentIcon", NoPaymentIcon],
    ["ChevronLeftIcon", ChevronLeftIcon],
    ["ChevronRightIcon", ChevronRightIcon],
    ["ChevronDownIcon", ChevronDownIcon],
    ["ChevronUpIcon", ChevronUpIcon],
    ["PlusIcon", PlusIcon],
    ["CheckIcon", CheckIcon],
    ["SendIcon", SendIcon],
  ] as [string, React.FC][])(
    "%s renders without throwing",
    (_name, Icon) => {
      expect(() => render(<Icon />)).not.toThrow();
    }
  );
});
