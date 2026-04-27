import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import { Label } from "@platform/Label";
import { Select } from "@platform/Select";
import { Buttons } from "@platform/Buttons";
import { TextInput } from "@platform/TextInput";
import { Container } from "@platform/Container";
import { RadioField } from "@platform/RadioField";
import { useMutation } from "@tanstack/react-query";
import { CustomDrawer } from "@platform/CustomDrawer";
import { SearchIcon, CalendarIcon } from "@platform/icons";

import SearchTenancyContractResults from "./searchTenancyContractResult";
import {
  TenancyContractItem,
  getTenancyContracts,
} from "../../hooks/useGetTenancyContracts";
import {
  MatchTypeOptions,
  SearchTenancySchema,
  ResultsDisplayOptions,
  SearchTenancyDefaultValues,
} from "./constants";

export interface SearchTenancyContractProps {
  selected?: TenancyContractItem[];
  onSubmit?: (val: TenancyContractItem[]) => void;
  language?: "en" | "ar";
  platform?: "web" | "mobile";
}

export interface DrawerData {
  results: TenancyContractItem[];
  pageNumber?: number;
  pageSize: number;
  totalCount: number;
  /** Original search payload used for fetching results, reused for pagination. */
  searchPayload: Record<string, unknown>;
}

const SearchTenancyContract = ({
  selected = [],
  onSubmit = () => {},
  language = "en",
  platform = "web",
}: SearchTenancyContractProps) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: getTenancyContracts,
  });

  const form = useForm({
    defaultValues: {
      ...SearchTenancyDefaultValues,
      matchTypeId:
        language === "ar"
          ? MatchTypeOptions[0].value_ar
          : MatchTypeOptions[0].value,
      pageSize:
        language === "ar"
          ? ResultsDisplayOptions[0].value_ar
          : ResultsDisplayOptions[0].value,
    },
    validators: {
      onChange: SearchTenancySchema,
    },
    onSubmit: async ({ value }) => {
      const filtered = Object.fromEntries(
        Object.entries(value).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined
        )
      );
      // Use the resultsDisplay value as pageSize. Coerce to number and fallback to 10.
      const requestedPageSize =
        Number(value.pageSize) && !Number.isNaN(Number(value.pageSize))
          ? Number(value.pageSize)
          : 10;

      // Build the full payload for the first request, so we can reuse it for pagination.
      const initialPayload = {
        ...filtered,
        contractType: filtered?.contractType === "new" ? "0" : "1",
        pageNumber: 0,
        pageSize: requestedPageSize,
      };
      try {
        const result = await mutateAsync(initialPayload);

        const mappedResults: TenancyContractItem[] =
          result?.items?.map((item) => ({
            ...item,
          })) ?? [];

        setDrawerData({
          results: mappedResults,
          pageNumber: result.pageNumber,
          pageSize: requestedPageSize,
          totalCount: result.totalCount,
          searchPayload: initialPayload,
        });
        setDrawerOpen(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // handle error (show toast, etc)
      }
    },
  });

  const handlePageChange = async (page: number) => {
    if (!drawerData) return;

    try {
      const payload = {
        ...drawerData.searchPayload,
        pageNumber: page - 1,
      };

      const result = await mutateAsync(payload);

      const mappedResults =
        result?.items?.map((item) => ({
          ...item,
        })) ?? [];

      setDrawerData((prev) =>
        prev
          ? {
              ...prev,
              results: mappedResults,
              pageNumber: result.pageNumber,
              totalCount: result.totalCount,
            }
          : prev
      );
    } catch (error) {
      console.error("Pagination fetch failed:", error);
    }
  };

  return (
    <Container className="flex flex-col w-full">
      <Container className="flex w-full flex-col gap-l">
        <Container className="space-t-m sm:col-span-2">
          <form.Field
            name={"contractType"}
            children={(field) => (
              <Container>
                <Container className="mb-s">
                  <Label
                    label="Contract type"
                    label_ar="نوع عقد الايجار"
                    tooltipText="Choose whether it is a new or renewed tenancy"
                    tooltipText_ar="اختر ما إذا كان عقد إيجار جديد أو متجدد"
                    language={language}
                    showInfoIcon
                  />
                </Container>

                <Container className="flex gap-l">
                  {(["new", "renew"] as const).map((type) => {
                    const id = `tenancy-${type}`;
                    return (
                      <RadioField
                        key={id}
                        id={id}
                        checked={field.state.value === type ? id : undefined}
                        onChange={() => field.handleChange(type)}
                        label={type === "new" ? "New Tenancy" : "Renew Tenancy"}
                        label_ar={
                          type === "new"
                            ? "عقد إيجار جديد"
                            : "تجديد عقد الإيجار"
                        }
                        language={language}
                      />
                    );
                  })}
                </Container>
              </Container>
            )}
          />
        </Container>
        {/* Row 1 */}
        <Container className="grid grid-cols-1! sm:grid-cols-2! gap-l w-full">
          <form.Field
            name="contractNumber"
            children={(field) => (
              <TextInput
                label="Contract Number"
                label_ar="رقم العقد"
                placeholder="Enter Contract Number"
                placeholder_ar="أدخل رقم العقد"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                hasError={!!field.state.meta.errors?.length}
                language={language}
                showInfoIcon={true}
                tooltipText="Contract Number"
                tooltipText_ar="رقم العقد"
              />
            )}
          />

          <form.Field
            name="startDate"
            children={(field) => (
              <TextInput
                fieldType="date"
                label="Contract Start Date"
                label_ar="الرقم الموحد"
                placeholder="Enter Start Date"
                placeholder_ar="أدخل الرقم الموحد"
                value={field.state.value}
                onChange={field.handleChange}
                language={language}
                showInfoIcon={true}
                tooltipText="Contract Start Date"
                tooltipText_ar="الرقم الموحد"
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                hasError={!!field.state.meta.errors?.length}
                icon={<CalendarIcon />}
              />
            )}
          />
        </Container>

        {/* Row 2 */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l pt-m w-full border-t border-border-light">
          <form.Field
            name="matchTypeId"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Match Type"
                label_ar="نوع المطابقة"
                placeholder="Choose a Match Type"
                placeholder_ar="اختر نوع المطابقة"
                options={MatchTypeOptions}
                language={language}
              />
            )}
          />
          <form.Field
            name="pageSize"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Results to Display"
                label_ar="النتائج المعروضة"
                placeholder="Choose Results"
                placeholder_ar="اختر النتائج"
                options={ResultsDisplayOptions}
                language={language}
              />
            )}
          />
        </Container>

        {/* Submit Button */}
        <Container className="flex flex-row">
          <Buttons
            size={platform === "web" ? "l" : "m"}
            type="secondary"
            title={"Search"}
            title_ar={"بحث"}
            language={language}
            disabled={isPending}
            leftIcon={<SearchIcon className="text-button-primary-default-bg" />}
            onClick={() => form.handleSubmit()}
          />
        </Container>
      </Container>

      <CustomDrawer
        size="layer1"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {drawerData && (
          <SearchTenancyContractResults
            results={drawerData.results}
            pageSize={drawerData.pageSize}
            totalCount={drawerData.totalCount}
            selected={selected}
            onSubmit={onSubmit}
            onCloseDrawer={() => setDrawerOpen(false)}
            language={language}
            onPageChange={handlePageChange}
            isLoading={isPending}
            isServerPaginated
            platform={platform}
          />
        )}
      </CustomDrawer>
    </Container>
  );
};

export default SearchTenancyContract;
