import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Container } from "@platform/Container";
import { Select } from "@platform/Select";
import { MultiSelect } from "@platform/MultiSelect";
import { TextInput } from "@platform/TextInput";
import { NumberInput } from "@platform/NumberInput";
import { Buttons } from "@platform/Buttons";
import { CustomDrawer } from "@platform/CustomDrawer";
import { SearchIcon } from "@platform/icons";
import { getSearchByCompanyOwner } from "../../hooks/useGetSearchByCompanyOwner";
import type { IOwnerSearchResult } from "./SearchOwnerResult";
import SearchOwnerResult from "./SearchOwnerResult";
import type { IOwnerPlotsSearchResult } from "./SearchOwnerPlotsResult";
import {
  CompanyOwnerSchema,
  CompanyOwnerDefaultValues,
  SearchByCompanyOwnerOptionalFields,
  MatchTypeOptions,
  ResultsDisplayOptions,
} from "./constants";

interface ByCompanyOwnerProps {
  args?: string;
  language: "en" | "ar";
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerPlotsSearchResult) => void;
  platform?: "web" | "mobile";
}

interface DrawerData {
  companyName?: string;
  tradeLicense?: string;
  certificateNumber?: string;
  results: IOwnerSearchResult[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  matchType?: string | number;
  searchPayload: Record<string, unknown>;
}

const ALWAYS_INCLUDE_KEYS = [
  "companyName",
  "certificateNumber",
  "matchType",
  "resultsDisplay",
] as const;

const ByCompanyOwner = ({
  args = "",
  language = "en",
  selected = [],
  onSubmit = () => {},
  platform = "web",
}: ByCompanyOwnerProps) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const visibleFieldsRef = useRef(visibleFields);
  visibleFieldsRef.current = visibleFields;
  const prevVisibleFieldsRef = useRef<string[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: getSearchByCompanyOwner,
  });

  const form = useForm({
    defaultValues: {
      ...CompanyOwnerDefaultValues,
      matchType:
        language === "ar"
          ? MatchTypeOptions[0].value_ar
          : MatchTypeOptions[0].value,
      resultsDisplay:
        language === "ar"
          ? ResultsDisplayOptions[0].value_ar
          : ResultsDisplayOptions[0].value,
    },
    validators: {
      onChange: CompanyOwnerSchema,
    },
    onSubmit: async ({ value }) => {
      const currentVisible = visibleFieldsRef.current;
      const allowedKeys = new Set([...ALWAYS_INCLUDE_KEYS, ...currentVisible]);
      const onlyVisibleValues = Object.fromEntries(
        Object.entries(value).filter(([k]) => allowedKeys.has(k))
      );
      const filtered = Object.fromEntries(
        Object.entries(onlyVisibleValues).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined
        )
      );
      const requestedPageSize =
        Number(value.resultsDisplay) &&
        !Number.isNaN(Number(value.resultsDisplay))
          ? Number(value.resultsDisplay)
          : 10;

      try {
        const initialPayload = {
          ownerName: filtered.companyName || "",
          matchTypeId: Number(filtered.matchType) || 0,
          tradeLicense: filtered.tradeLicense || "",
          certificateNumber: filtered.certificateNumber || "",
          westernRegionArchiveNo: filtered.westernRegionArchiveNo || "",
          abuDhabiArchiveNo: filtered.abuDhabiArchiveNo || "",
          alAinArchiveNo: filtered.alAinArchiveNo || "",
          requestId: 0,
          pageNumber: 0,
          pageSize: requestedPageSize,
        };
        const result = await mutateAsync(initialPayload);

        const mappedResults: IOwnerSearchResult[] =
          result?.items?.map((item) => ({
            ...item,
            id: String(item.ownerId ?? ""),
            ownerId: String(item.ownerId ?? ""),
            companyName: item.companyName ?? "",
            code: item.companyName ?? "",
            plotNumber: item.certificateNumber ?? "",
            landUse: item.tradeLicense ?? "",
          })) ?? [];

        setDrawerData({
          companyName: value.companyName,
          tradeLicense: value.tradeLicense,
          certificateNumber: value.certificateNumber,
          results: mappedResults,
          pageNumber: result.pageNumber,
          pageSize: requestedPageSize,
          totalCount: result.totalCount,
          matchType: value.matchType,
          searchPayload: initialPayload,
        });
        setDrawerOpen(true);
      } catch (_e) {
        // handle error
      }
    },
  });

  const handlePageChange = async (page: number) => {
    if (!drawerData) return;
    try {
      const payload = {
        ...drawerData.searchPayload,
        pageNumber: page - 1,
        pageSize: drawerData.pageSize,
      };
      const result = await mutateAsync(payload);
      const mappedResults =
        result?.items?.map((item) => ({
          ...item,
          id: String(item.ownerId ?? ""),
          ownerId: String(item.ownerId ?? ""),
          companyName: item.companyName ?? "",
          code: item.companyName ?? "",
          plotNumber: item.certificateNumber ?? "",
          landUse: item.tradeLicense ?? "",
        })) ?? [];

      setDrawerData((prev) =>
        prev
          ? {
              ...prev,
              results: mappedResults,
              pageNumber: result.pageNumber,
              totalCount: result.totalCount,
              searchPayload: payload,
            }
          : prev
      );
    } catch (error) {
      console.error("Pagination fetch failed:", error);
    }
  };

  useEffect(() => {
    const prev = prevVisibleFieldsRef.current;
    const removed = prev.filter((f) => !visibleFields.includes(f));
    removed.forEach((fieldName) => {
      form.resetField(fieldName as never);
    });
    prevVisibleFieldsRef.current = visibleFields;
  }, [visibleFields, form]);

  return (
    <Container className="flex flex-col w-full">
      <Container className="flex flex-1 flex-col gap-l">
        {/* Row 1: Company Name & Certificate Number */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="companyName"
            children={(field) => (
              <TextInput
                label="Company Name"
                label_ar="اسم الشركة"
                showInfoIcon={false}
                tooltipText="Enter company name"
                tooltipText_ar="أدخل اسم الشركة"
                placeholder="Company Name"
                placeholder_ar="اسم الشركة"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                language={language}
              />
            )}
          />
          <form.Field
            name="certificateNumber"
            children={(field) => (
              <NumberInput
                label="Certificate Number"
                label_ar="رقم الشهادة"
                showInfoIcon={false}
                tooltipText="Enter certificate number"
                tooltipText_ar="أدخل رقم الشهادة"
                placeholder="Certificate Number"
                placeholder_ar="رقم الشهادة"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                language={language}
              />
            )}
          />
        </Container>

        {/* Dynamic optional fields */}
        {visibleFields?.length > 0 && (
          <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
            {visibleFields.includes("tradeLicense") && (
              <form.Field
                name="tradeLicense"
                children={(field) => (
                  <NumberInput
                    label="Trade License"
                    label_ar="رخصة تجارية"
                    showInfoIcon={false}
                    tooltipText="Enter trade license"
                    tooltipText_ar="أدخل الرخصة التجارية"
                    placeholder="Trade License"
                    placeholder_ar="رخصة تجارية"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                  />
                )}
              />
            )}
            {visibleFields.includes("westernRegionArchiveNo") && (
              <form.Field
                name="westernRegionArchiveNo"
                children={(field) => (
                  <NumberInput
                    label="Western Region Archive No."
                    label_ar="رقم أرشيف المنطقة الغربية"
                    showInfoIcon={false}
                    tooltipText="Enter archive number"
                    tooltipText_ar="أدخل رقم الأرشيف"
                    placeholder="Western Region Archive No."
                    placeholder_ar="رقم أرشيف المنطقة الغربية"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                  />
                )}
              />
            )}
            {visibleFields.includes("abuDhabiArchiveNo") && (
              <form.Field
                name="abuDhabiArchiveNo"
                children={(field) => (
                  <NumberInput
                    label="Abu Dhabi Archive No."
                    label_ar="رقم أرشيف أبوظبي"
                    showInfoIcon={false}
                    tooltipText="Enter Abu Dhabi archive number"
                    tooltipText_ar="أدخل رقم أرشيف أبوظبي"
                    placeholder="Abu Dhabi Archive No."
                    placeholder_ar="رقم أرشيف أبوظبي"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                  />
                )}
              />
            )}
            {visibleFields.includes("alAinArchiveNo") && (
              <form.Field
                name="alAinArchiveNo"
                children={(field) => (
                  <NumberInput
                    label="Al Ain Archive No."
                    label_ar="رقم أرشيف العين"
                    showInfoIcon={false}
                    tooltipText="Enter Al Ain archive number"
                    tooltipText_ar="أدخل رقم أرشيف العين"
                    placeholder="Al Ain Archive No."
                    placeholder_ar="رقم أرشيف العين"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                  />
                )}
              />
            )}
          </Container>
        )}

        {/* Row: Match Type & Results Display */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l pt-m w-full border-t border-border-light">
          <form.Field
            name="matchType"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Match Type"
                label_ar="نوع المطابقة"
                placeholder="Choose a Match Type"
                placeholder_ar="اختر نوع المطابقة"
                captionLeft=""
                captionRight=""
                errorMessage={field.state.meta.errors?.[0]?.message}
                options={MatchTypeOptions}
                language={language}
              />
            )}
          />
          <form.Field
            name="resultsDisplay"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Results to Display"
                label_ar="النتائج المعروضة"
                placeholder="Choose Results"
                placeholder_ar="اختر النتائج"
                captionLeft=""
                captionRight=""
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={ResultsDisplayOptions}
                language={language}
              />
            )}
          />
        </Container>

        <Container
          className={`grid !grid-cols-1 sm:!grid-cols-2 w-full ${
            platform === "web" ? "gap-l" : ""
          }`}
        >
          <MultiSelect
            placeholder="Add search type"
            placeholder_ar="أضف نوع البحث"
            options={SearchByCompanyOwnerOptionalFields}
            value={visibleFields}
            onChange={setVisibleFields}
            language={language}
            showAddButton={true}
          />
          <Container />
        </Container>

        {/* Submit Button */}
        <Container className="flex flex-row">
          <Buttons
            size={platform === "web" ? "l" : "m"}
            type="secondary"
            title="Search"
            title_ar="بحث"
            language={language}
            leftIcon={<SearchIcon className="text-button-primary-default-bg" />}
            disabled={isPending}
            onClick={() => form.handleSubmit()}
          />
        </Container>
      </Container>

      {/* Results Drawer */}
      <CustomDrawer
        size="layer1"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {drawerData && (
          <SearchOwnerResult
            ownerName={drawerData?.companyName || ""}
            results={drawerData?.results || []}
            pageSize={drawerData?.pageSize}
            totalCount={drawerData?.totalCount}
            selected={selected}
            onSubmit={onSubmit}
            onCloseDrawer={() => setDrawerOpen(false)}
            language={language}
            onPageChange={handlePageChange}
            isLoading={isPending}
            args={args}
          />
        )}
      </CustomDrawer>
    </Container>
  );
};

export default ByCompanyOwner;
