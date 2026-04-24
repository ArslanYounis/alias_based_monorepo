import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Select } from "@platform/Select";
import { Buttons } from "@platform/Buttons";
import { SearchIcon } from "@platform/icons";
import { TextInput } from "@platform/TextInput";
import { Container } from "@platform/Container";
import { NumberInput } from "@platform/NumberInput";
import { MultiSelect } from "@platform/MultiSelect";
import { CustomDrawer } from "@platform/CustomDrawer";

import DariOwnerSearchResult from "./dariOwnerSearchResult";
import {
  getSearchByDariOwner,
  DariOwnerSearchResultProps,
} from "../../hooks/useGetSearchByDariOwner";
import {
  MatchTypeOptions,
  ResultsDisplayOptions,
  DariSearchCompanyOwnerSchema,
  DariSearchCompanyOwnerDefaultValues,
  DariSearchCompanyOwnerOptionalFields,
} from "./constants";

interface SearchByCompanyOwnerProps {
  language: "en" | "ar";
  selected?: DariOwnerSearchResultProps[];
  onSubmit?: (val: DariOwnerSearchResultProps[]) => void;
  platform?: "web" | "mobile";
}

interface DrawerData {
  results: DariOwnerSearchResultProps[];
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  searchPayload?: CompanyOwnerSearchPayload;
}

interface CompanyOwnerSearchPayload {
  ownerType: string;
  searchBy: string;
  ownerName?: string;
  licenseNo?: string;
  adArchiveNo?: string;
  alAinArchiveNo?: string;
  certificateNo?: string;
  westResgionArchNo?: string;
  pageSize: number;
  page: number;
}

/** Form keys that are always sent in the search payload (always visible). */
const ALWAYS_INCLUDE_KEYS = [
  "companyName",
  "licenseNo",
  "abuDhabiOwnerArchiveNo",
  "alAinOwnerArchiveNo",
  "matchType",
  "resultsDisplay",
] as const;

const SearchByCompanyOwner = ({
  selected = [],
  onSubmit,
  language,
  platform = "web",
}: SearchByCompanyOwnerProps) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const visibleFieldsRef = useRef(visibleFields);
  visibleFieldsRef.current = visibleFields;
  const prevVisibleFieldsRef = useRef<string[]>([]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: getSearchByDariOwner,
  });

  const form = useForm({
    defaultValues: {
      ...DariSearchCompanyOwnerDefaultValues,
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
      onChange: DariSearchCompanyOwnerSchema,
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
      // Use the resultsDisplay value as pageSize. Coerce to number and fallback to 10.
      const requestedPageSize =
        Number(value.resultsDisplay) &&
        !Number.isNaN(Number(value.resultsDisplay))
          ? Number(value.resultsDisplay)
          : 10;

      try {
        const payload: CompanyOwnerSearchPayload = {
          ownerType: "2",
          searchBy: "1",
          ownerName: filtered?.companyName,
          licenseNo: filtered?.licenseNo,
          adArchiveNo: filtered?.abuDhabiOwnerArchiveNo,
          alAinArchiveNo: filtered?.alAinOwnerArchiveNo,
          certificateNo: filtered?.certificateNumber,
          westResgionArchNo: filtered?.westernRegionOwnerArchiveNo,
          pageSize: requestedPageSize,
          page: 1,
        };

        const result = await mutateAsync(payload);

        const mappedResults: DariOwnerSearchResultProps[] =
          result?.items?.map((item) => ({
            ...item,
            ownerId: String(item.ownerID ?? ""),
          })) ?? [];

        setDrawerData({
          results: mappedResults,
          pageNumber: result.pageNumber,
          pageSize: requestedPageSize,
          totalCount: result.totalCount,
          searchPayload: payload,
        });

        setDrawerOpen(true);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
          // showToast(e.message);
        } else {
          console.error("Unknown error", e);
        }
      }
    },
  });

  const handlePageChange = async (page: number) => {
    if (!drawerData) return;
    if (!drawerData.searchPayload) return;

    try {
      const payload: CompanyOwnerSearchPayload = {
        ...drawerData.searchPayload,
        page,
      };

      const result = await mutateAsync(payload);

      const mappedResults: DariOwnerSearchResultProps[] =
        result?.items?.map((item) => ({
          ...item,
          ownerId: String(item.ownerId ?? ""),
        })) ?? [];

      setDrawerData((prev) =>
        prev
          ? {
              ...prev,
              results: mappedResults,
              pageNumber: result.pageNumber,
              totalCount: result.totalCount,
            }
          : null
      );
    } catch (error) {
      console.error("Pagination fetch failed:", error);
    }
  };

  // When a field is hidden, clear its value so re-adding it shows empty
  useEffect(() => {
    const prev = prevVisibleFieldsRef.current;
    const removed = prev.filter((f) => !visibleFields.includes(f));
    // Reset only the removed dynamic fields (value + meta), leave the rest untouched
    removed.forEach((fieldName) => {
      form.resetField(fieldName as never);
    });
    prevVisibleFieldsRef.current = visibleFields;
  }, [visibleFields, form]);

  return (
    <Container className="flex flex-col w-full">
      <Container className="flex w-full flex-col gap-l">
        {/* Row 1: Owner Name & Family Name */}
        <Container className="grid grid-cols-1! sm:grid-cols-2! gap-l w-full">
          <form.Field
            name="companyName"
            children={(field) => (
              <TextInput
                label="Company Name"
                label_ar="اسم الشركة"
                showInfoIcon={false}
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
            name="licenseNo"
            children={(field) => (
              <NumberInput
                label="License No."
                label_ar="رقم الترخيص"
                showInfoIcon={false}
                placeholder="License No"
                placeholder_ar="رقم الترخيص"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                language={language}
              />
            )}
          />
        </Container>
        {/* Row 2: National Number */}
        <Container className="grid grid-cols-1! sm:grid-cols-2! gap-l w-full">
          <form.Field
            name="abuDhabiOwnerArchiveNo"
            children={(field) => (
              <NumberInput
                label="Abu Dhabi Owner Archive No."
                label_ar="أرشيف مالك أبوظبي رقم"
                showInfoIcon={false}
                placeholder="Abu Dhabi Owner Archive No."
                placeholder_ar="أرشيف مالك أبوظبي رقم"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                hasError={!!field.state.meta.errors?.length}
                language={language}
              />
            )}
          />
          <form.Field
            name="alAinOwnerArchiveNo"
            children={(field) => (
              <NumberInput
                label="Al Ain Owner Archive No."
                label_ar="أرشيف مالك العين رقم"
                showInfoIcon={false}
                placeholder="Al Ain Owner Archive No."
                placeholder_ar="أرشيف مالك العين رقم"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                hasError={!!field.state.meta.errors?.length}
                language={language}
              />
            )}
          />
        </Container>

        {/* Row 4: Dynamic fields grid start */}
        {visibleFields?.length > 0 && (
          <Container className="grid grid-cols-1! sm:grid-cols-2! gap-l w-full">
            {visibleFields.includes("certificateNumber") && (
              <form.Field
                name="certificateNumber"
                children={(field) => (
                  <NumberInput
                    label="Certificate Number"
                    label_ar="رقم الشهادة"
                    showInfoIcon={false}
                    placeholder="Certificate Number"
                    placeholder_ar="رقم الشهادة"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
                  />
                )}
              />
            )}
            {visibleFields.includes("westernRegionOwnerArchiveNo") && (
              <form.Field
                name="westernRegionOwnerArchiveNo"
                children={(field) => (
                  <NumberInput
                    label="Western Region Owner Archive"
                    label_ar="أرشيف مالك المنطقة الغربية"
                    showInfoIcon={false}
                    placeholder="Family No/City"
                    placeholder_ar="أرشيف مالك المنطقة الغربية"
                    value={field.state.value}
                    onChange={field.handleChange}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
                    language={language}
                  />
                )}
              />
            )}
          </Container>
        )}
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
            options={DariSearchCompanyOwnerOptionalFields}
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
          <DariOwnerSearchResult
            // ownerName={drawerData.companyName || ""}
            results={drawerData.results || []}
            pageSize={drawerData.pageSize}
            totalCount={drawerData?.totalCount}
            selected={selected}
            onSubmit={onSubmit}
            onCloseDrawer={() => setDrawerOpen(false)}
            language={language}
            onPageChange={handlePageChange}
            isLoading={isPending}
            platform={platform}
          />
        )}
      </CustomDrawer>
    </Container>
  );
};

export default SearchByCompanyOwner;
