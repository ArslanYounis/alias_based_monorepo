import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock the workflows hook so we control groups/loading/error state ──────────
const mockUseGetWorkflows = vi.fn();
vi.mock("@shared/hooks/useGetWorkflows", () => ({
  useGetWorkflows: () => mockUseGetWorkflows(),
}));

import PartialBlockHandler from "@shared/components/PartialBlockHandler";

const groups = [
  {
    key: "Group One",
    workflows: [
      { workflowID: 1, workflowNameEn: "Alpha", workflowNameAr: "ألفا" },
      { workflowID: 2, workflowNameEn: "Beta", workflowNameAr: "بيتا" },
    ],
  },
  {
    key: "Group Two",
    workflows: [
      { workflowID: 3, workflowNameEn: "Gamma", workflowNameAr: "جاما" },
    ],
  },
];

const setHook = (overrides: Record<string, unknown> = {}) => {
  mockUseGetWorkflows.mockReturnValue({
    groups,
    isLoading: false,
    isError: false,
    ...overrides,
  });
};

beforeEach(() => {
  mockUseGetWorkflows.mockReset();
  setHook();
});

describe("PartialBlockHandler (shared component – web platform)", () => {
  // ── Header / default render ────────────────────────────────────────────────
  it("renders default title", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Update Partial Blocks")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<PartialBlockHandler title="My Title" />);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("applies rtl direction when language=ar", () => {
    const { container } = render(<PartialBlockHandler language="ar" />);
    expect(container.firstChild).toHaveAttribute("dir", "rtl");
  });

  it("applies ltr direction when language=en", () => {
    const { container } = render(<PartialBlockHandler language="en" />);
    expect(container.firstChild).toHaveAttribute("dir", "ltr");
  });

  it("renders Arabic title when language=ar", () => {
    render(<PartialBlockHandler title_ar="عنوان" language="ar" />);
    expect(screen.getByText("عنوان")).toBeInTheDocument();
  });

  // ── Loading / error / empty states ─────────────────────────────────────────
  it("shows loading state", () => {
    setHook({ isLoading: true, groups: [] });
    render(<PartialBlockHandler />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Arabic loading state", () => {
    setHook({ isLoading: true, groups: [] });
    render(<PartialBlockHandler language="ar" />);
    expect(screen.getByText("جارٍ التحميل...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    setHook({ isError: true, groups: [] });
    render(<PartialBlockHandler />);
    expect(screen.getByText("Failed to load workflows.")).toBeInTheDocument();
  });

  it("shows empty state when no groups", () => {
    setHook({ groups: [] });
    render(<PartialBlockHandler />);
    expect(screen.getByText("No workflows found.")).toBeInTheDocument();
  });

  // ── Groups & expansion ─────────────────────────────────────────────────────
  it("renders group titles", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Group One")).toBeInTheDocument();
    expect(screen.getByText("Group Two")).toBeInTheDocument();
  });

  it("expands the first group by default and shows its workflows", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    // Second group collapsed by default
    expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
  });

  it("toggles a group open when its expand control is clicked", () => {
    render(<PartialBlockHandler />);
    // Group One is expanded (Collapse), Group Two collapsed (Expand)
    fireEvent.click(screen.getByRole("button", { name: "Expand" }));
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("collapses an expanded group when its collapse control is clicked", () => {
    render(<PartialBlockHandler />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Collapse" }));
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  it("respects defaultExpandedGroups prop", () => {
    render(<PartialBlockHandler defaultExpandedGroups={["Group Two"]} />);
    expect(screen.getByText("Gamma")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  // ── Search ─────────────────────────────────────────────────────────────────
  it("filters workflows by search term (English)", () => {
    render(<PartialBlockHandler defaultExpandedGroups={["Group One", "Group Two"]} />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "Gamma" } });
    expect(screen.getByText("Gamma")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    // Group One dropped because empty after filter
    expect(screen.queryByText("Group One")).not.toBeInTheDocument();
  });

  it("filters workflows by Arabic name", () => {
    render(<PartialBlockHandler defaultExpandedGroups={["Group One", "Group Two"]} />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "بيتا" } });
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  it("shows empty state when search matches nothing", () => {
    render(<PartialBlockHandler />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "zzz-nothing" } });
    expect(screen.getByText("No workflows found.")).toBeInTheDocument();
  });

  // ── Existing tags ──────────────────────────────────────────────────────────
  it("tags existing blocks with the existing tag label", () => {
    render(<PartialBlockHandler existingBlocks={[1]} />);
    expect(screen.getByText("Existing Block")).toBeInTheDocument();
  });

  it("uses a custom existing tag label", () => {
    render(
      <PartialBlockHandler existingBlocks={[1]} existingTagLabel="Already Here" />
    );
    expect(screen.getByText("Already Here")).toBeInTheDocument();
  });

  // ── Selection & submit ─────────────────────────────────────────────────────
  it("submit button is disabled when nothing selected (default)", () => {
    render(<PartialBlockHandler />);
    const btn = screen.getByRole("button", { name: "Update" });
    expect(btn).toBeDisabled();
  });

  it("submit button enabled when disableSubmitWhenEmpty=false", () => {
    render(<PartialBlockHandler disableSubmitWhenEmpty={false} />);
    const btn = screen.getByRole("button", { name: "Update" });
    expect(btn).not.toBeDisabled();
  });

  it("preselects existing blocks and enables submit", () => {
    render(<PartialBlockHandler existingBlocks={[1]} />);
    const btn = screen.getByRole("button", { name: "Update" });
    expect(btn).not.toBeDisabled();
  });

  it("does not preselect existing when preselectExisting=false", () => {
    render(<PartialBlockHandler existingBlocks={[1]} preselectExisting={false} />);
    const btn = screen.getByRole("button", { name: "Update" });
    expect(btn).toBeDisabled();
  });

  it("preselects preselectedBlocks without tagging them existing", () => {
    render(<PartialBlockHandler preselectedBlocks={[2]} />);
    expect(screen.queryByText("Existing Block")).not.toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Update" });
    expect(btn).not.toBeDisabled();
  });

  it("selecting a workflow enables submit and calls onSubmit with the item", () => {
    const onSubmit = vi.fn();
    render(<PartialBlockHandler onSubmit={onSubmit} />);
    // Toggle Alpha (workflowID 1) on
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    const btn = screen.getByRole("button", { name: "Update" });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toHaveLength(1);
    expect(payload[0]).toMatchObject({
      workflowID: 1,
      groupKey: "Group One",
      isExisting: false,
    });
  });

  it("marks isExisting=true in submitted payload for existing blocks", () => {
    const onSubmit = vi.fn();
    render(<PartialBlockHandler existingBlocks={[1]} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    const payload = onSubmit.mock.calls[0][0];
    expect(payload[0]).toMatchObject({ workflowID: 1, isExisting: true });
  });

  it("renders a custom submit label", () => {
    render(<PartialBlockHandler submitLabel="Save" />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders Arabic submit label when language=ar", () => {
    render(<PartialBlockHandler submitLabel="Update" submitLabel_ar="تحديث" language="ar" />);
    expect(screen.getByRole("button", { name: "تحديث" })).toBeInTheDocument();
  });

  // ── Platform ───────────────────────────────────────────────────────────────
  it("renders on mobile platform", () => {
    render(<PartialBlockHandler platform="mobile" />);
    expect(screen.getByText("Update Partial Blocks")).toBeInTheDocument();
  });
});
