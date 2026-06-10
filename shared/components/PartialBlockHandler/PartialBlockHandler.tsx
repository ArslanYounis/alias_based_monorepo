import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { TextInput } from "@platform/TextInput";
import { Buttons } from "@platform/Buttons";
import { SearchIcon } from "@platform/icons";
import {
  useGetWorkflows,
  type WorkflowDto,
} from "@shared/hooks/useGetWorkflows";
import ModalTitle from "../ModalTitle";
import CardTitle from "../CardTitle";
import ServiceSelectRow from "../ServiceSelectRow";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

/** A workflow the user selected, enriched with its group and existing-block flag. */
export interface SelectedWorkflow extends WorkflowDto {
  /** Group title (response object key) the workflow belongs to. */
  groupKey: string;
  /** Whether this workflow was passed in via `existingBlocks`. */
  isExisting: boolean;
}

export interface PartialBlockHandlerProps {
  title?: string;
  title_ar?: string;
  /** Workflow ids that already exist as blocks — tagged and (optionally) pre-selected. */
  existingBlocks?: Array<number | string>;
  /** Whether existing blocks start checked. Defaults to true. */
  preselectExisting?: boolean;
  /** Workflow ids to pre-check on mount WITHOUT tagging them as existing. */
  preselectedBlocks?: Array<number | string>;
  existingTagLabel?: string;
  existingTagLabel_ar?: string;
  searchPlaceholder?: string;
  searchPlaceholder_ar?: string;
  /** Group titles expanded by default. When omitted, the first group is expanded. */
  defaultExpandedGroups?: string[];
  submitLabel?: string;
  submitLabel_ar?: string;
  /** Disable the submit button while no workflow is selected. Defaults to true. */
  disableSubmitWhenEmpty?: boolean;
  onSubmit?: (data: SelectedWorkflow[]) => void;
  language?: "en" | "ar";
  platform?: "web" | "mobile";
}

const PartialBlockHandler: FC<PartialBlockHandlerProps> = ({
  title = "Update Partial Blocks",
  title_ar = "",
  existingBlocks = [],
  preselectExisting = true,
  preselectedBlocks = [],
  existingTagLabel = "Existing Block",
  existingTagLabel_ar = "",
  searchPlaceholder = "Search",
  searchPlaceholder_ar = "",
  defaultExpandedGroups,
  submitLabel = "Update",
  submitLabel_ar = "",
  disableSubmitWhenEmpty = true,
  onSubmit = () => {},
  language = "en",
  platform = "web",
}) => {
  const isRtl = language === "ar";
  const { groups, isLoading, isError } = useGetWorkflows();

  const existingSet = useMemo(
    () => new Set((existingBlocks ?? []).map((id) => String(id))),
    [existingBlocks],
  );

  const preselectedSet = useMemo(
    () => new Set((preselectedBlocks ?? []).map((id) => String(id))),
    [preselectedBlocks],
  );

  // Search (self-managed) — filters items across English + Arabic names.
  const [search, setSearch] = useState("");

  // Expansion of accordion groups, keyed by group title.
  const [expanded, setExpanded] = useState<string[]>(
    defaultExpandedGroups ?? [],
  );
  const expandedSeeded = useRef(false);

  // Selection, keyed by stringified workflowID.
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectionSeeded = useRef(false);

  // Seed default expansion (first group) and pre-selected existing blocks once
  // the workflow data has arrived.
  useEffect(() => {
    if (!groups.length) return;

    if (!expandedSeeded.current && defaultExpandedGroups === undefined) {
      setExpanded([groups[0].key]);
      expandedSeeded.current = true;
    }

    if (!selectionSeeded.current) {
      const init: Record<string, boolean> = {};
      if (preselectExisting)
        existingSet.forEach((id) => {
          init[id] = true;
        });
      preselectedSet.forEach((id) => {
        init[id] = true;
      });
      if (Object.keys(init).length) setSelected(init);
      selectionSeeded.current = true;
    }
  }, [
    groups,
    defaultExpandedGroups,
    preselectExisting,
    existingSet,
    preselectedSet,
  ]);

  const isExpanded = (key: string) => expanded.includes(key);
  const toggleGroup = (key: string) =>
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const handleItemChange = (id: string, checked: boolean) =>
    setSelected((prev) => ({ ...prev, [id]: checked }));

  // Apply the search filter, dropping groups that end up empty.
  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return groups;
    return groups
      .map((group) => ({
        ...group,
        workflows: group.workflows.filter((w) =>
          `${w.workflowNameEn} ${w.workflowNameAr ?? ""}`
            .toLowerCase()
            .includes(term),
        ),
      }))
      .filter((group) => group.workflows.length > 0);
  }, [groups, search]);

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected],
  );

  const handleSubmit = () => {
    const result: SelectedWorkflow[] = [];
    groups.forEach((group) => {
      group.workflows.forEach((w) => {
        const id = String(w.workflowID);
        if (selected[id]) {
          result.push({
            ...w,
            groupKey: group.key,
            isExisting: existingSet.has(id),
          });
        }
      });
    });
    onSubmit(result);
  };

  return (
    <Container
      className="flex flex-col gap-l p-l bg-white w-full"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <Container className="flex flex-row items-start justify-between w-full">
        <ModalTitle
          label={title}
          label_ar={title_ar}
          language={language}
          platform={platform}
        />
      </Container>

      {/* Search */}
      <Container className="w-full">
        <TextInput
          fieldType="text"
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
          placeholder_ar={searchPlaceholder_ar}
          icon={<SearchIcon />}
          language={language}
        />
      </Container>

      {/* Body */}
      <Container className="flex flex-col w-full">
        {isLoading && (
          <Text className="text-m text-text-default py-s">
            <SharedLanguageSwitchRenderer
              language={language}
              value="Loading..."
              value_ar="جارٍ التحميل..."
            />
          </Text>
        )}
        {isError && !isLoading && (
          <Text className="text-m text-status-failed-solid py-s">
            <SharedLanguageSwitchRenderer
              language={language}
              value="Failed to load workflows."
              value_ar="تعذّر تحميل سير العمل."
            />
          </Text>
        )}
        {!isLoading && !isError && filteredGroups.length === 0 && (
          <Text className="text-m text-text-default py-s">
            <SharedLanguageSwitchRenderer
              language={language}
              value="No workflows found."
              value_ar="لا توجد سير عمل."
            />
          </Text>
        )}

        {!isLoading &&
          !isError &&
          filteredGroups.map((group) => (
            <Container key={group.key} className="flex flex-col w-full">
              <CardTitle
                title={group.key}
                title_ar={group.key}
                isExpandable
                isExpanded={isExpanded(group.key)}
                onToggleExpand={() => toggleGroup(group.key)}
                variant="medium"
                language={language}
                platform={platform}
              />
              {isExpanded(group.key) && (
                <Container className="flex flex-col w-full">
                  {group.workflows.map((w) => {
                    const id = String(w.workflowID);
                    const isExisting = existingSet.has(id);
                    return (
                      <ServiceSelectRow
                        key={id}
                        id={id}
                        label={w.workflowNameEn}
                        label_ar={w.workflowNameAr}
                        checked={!!selected[id]}
                        onChange={handleItemChange}
                        tag={isExisting ? existingTagLabel : undefined}
                        tag_ar={isExisting ? existingTagLabel_ar : undefined}
                        language={language}
                        platform={platform}
                      />
                    );
                  })}
                </Container>
              )}
            </Container>
          ))}
      </Container>

      {/* Footer */}
      <Container className="flex w-full">
        <Buttons
          title={submitLabel}
          title_ar={submitLabel_ar || submitLabel}
          type="primary"
          disabled={disableSubmitWhenEmpty && selectedCount === 0}
          onClick={handleSubmit}
          language={language}
          fullWidth={platform === "mobile"}
        />
      </Container>
    </Container>
  );
};

export default PartialBlockHandler;
