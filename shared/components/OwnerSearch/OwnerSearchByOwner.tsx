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
import { SearchIcon, PersonIcon, UAENationalIcon } from "@platform/icons";
import { getSearchByOwner } from "../../hooks/useGetSearchByOwner";
import type { IOwnerSearchResult } from "./OwnerSearchResult";
import OwnerSearchResult from "./OwnerSearchResult";
import {
  OwnerSchema,
  OwnerDefaultValues,
  SearchByOwnerOptionalFields,
  MatchTypeOptions,
  ResultsDisplayOptions,
} from "./constants";

interface OwnerSearchByOwnerProps {
  args?: string;
  language: "en" | "ar";
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
  platform?: "web" | "mobile";
}

interface DrawerData {
  nationalNumber?: string;
  ownerName?: string;
  results: IOwnerSearchResult[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  matchType?: string | number;
  searchPayload: Record<string, unknown>;
}

const ALWAYS_INCLUDE_KEYS = [
  "nationalNumber",
  "ownerName",
  "familyName",
  "matchType",
  "resultsDisplay",
] as const;

const OwnerSearchByOwner = ({
  args = "",
  language = "en",
  selected = [],
  onSubmit = () => {},
  platform = "web",
}: OwnerSearchByOwnerProps) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const visibleFieldsRef = useRef(visibleFields);
  visibleFieldsRef.current = visibleFields;
  const prevVisibleFieldsRef = useRef<string[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: getSearchByOwner,
  });

  const form = useForm({
    defaultValues: {
      ...OwnerDefaultValues,
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
      onChange: OwnerSchema,
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
          ownerName: filtered?.ownerName,
          nationalNumber: filtered?.nationalNumber,
          nationalityId: filtered?.nationalityId,
          familyBookNumber: filtered?.familyNoCity,
          cityNumber: filtered?.familyNoCity,
          passPortNumber: filtered?.passportNumber,
          moiUnifiedNumber: filtered?.moiUnifiedNumber,
          matchTypeId: filtered?.matchType,
          pageNumber: 0,
          pageSize: requestedPageSize,
        };

        const result = await mutateAsync(initialPayload);

        const mappedResults: IOwnerSearchResult[] =
          result?.items?.map((item) => ({
            ...item,
            id: item?.ownerId ? String(item.ownerId) : undefined,
            ownerId: item?.ownerId ? String(item.ownerId) : "",
            ownerName: item?.ownerName ?? "",
          })) ?? [];

        setDrawerData({
          nationalNumber: value.nationalNumber,
          ownerName: value.ownerName,
          results: mappedResults,
          pageNumber: result.pageNumber,
          pageSize: requestedPageSize,
          totalCount: result.totalCount,
          matchType: value.matchType,
          searchPayload: initialPayload,
        });

        setDrawerOpen(true);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        } else {
          console.error("Unknown error", e);
        }
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

      const mappedResults: IOwnerSearchResult[] =
        result?.items?.map((item) => ({
          ...item,
          id: item?.ownerId ? String(item.ownerId) : undefined,
          ownerId: item?.ownerId ? String(item.ownerId) : "",
          ownerName: item?.ownerName ?? "",
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
          : null
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
        {/* Row 1: National Number & Owner Name */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="nationalNumber"
            children={(field) => (
              <NumberInput
                label="National Number"
                label_ar="الرقم الوطني"
                showInfoIcon={false}
                tooltipText="Enter national number"
                tooltipText_ar="أدخل الرقم الوطني"
                placeholder="National Number"
                placeholder_ar="الرقم الوطني"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                language={language}
                icon={<UAENationalIcon className="text-text-default" />}
              />
            )}
          />
          <form.Field
            name="ownerName"
            children={(field) => (
              <TextInput
                label="Owner Name"
                label_ar="اسم المالك"
                showInfoIcon={false}
                tooltipText="Enter owner name"
                tooltipText_ar="أدخل اسم المالك"
                placeholder="Owner Name"
                placeholder_ar="اسم المالك"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                language={language}
                icon={<PersonIcon className="text-text-default" />}
              />
            )}
          />
        </Container>

        {/* Row 2: Family Name */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="familyName"
            children={(field) => (
              <TextInput
                label="Family Name"
                label_ar="اسم العائلة"
                showInfoIcon={false}
                tooltipText="Enter family name"
                tooltipText_ar="أدخل اسم العائلة"
                placeholder="Family Name"
                placeholder_ar="اسم العائلة"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                language={language}
                icon={<PersonIcon className="text-text-default" />}
              />
            )}
          />
          <Container />
        </Container>

        {/* Dynamic optional fields */}
        {visibleFields?.length > 0 && (
          <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
            {visibleFields.includes("passportNumber") && (
              <form.Field
                name="passportNumber"
                children={(field) => (
                  <TextInput
                    label="Passport Number"
                    label_ar="رقم الجواز"
                    showInfoIcon={false}
                    tooltipText="Enter passport number"
                    tooltipText_ar="أدخل رقم الجواز"
                    placeholder="Passport Number"
                    placeholder_ar="رقم الجواز"
                    value={field.state.value}
                    onChange={field.handleChange}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
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
                    tooltipText="Enter archive number"
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
            {visibleFields.includes("familyNoCity") && (
              <form.Field
                name="familyNoCity"
                children={(field) => (
                  <TextInput
                    label="Family No/City"
                    label_ar="رقم العائلة/المدينة"
                    showInfoIcon={false}
                    tooltipText="Enter family no/city"
                    tooltipText_ar="رقم العائلة/المدينة"
                    placeholder="Family No/City"
                    placeholder_ar="رقم العائلة/المدينة"
                    value={field.state.value}
                    onChange={field.handleChange}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
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
            {visibleFields.includes("moiUnifiedNumber") && (
              <form.Field
                name="moiUnifiedNumber"
                children={(field) => (
                  <NumberInput
                    label="MOI Unified Number"
                    label_ar="الرقم الموحد لوزارة الداخلية"
                    showInfoIcon={false}
                    tooltipText="Enter MOI unified number"
                    tooltipText_ar="الرقم الموحد لوزارة الداخلية"
                    placeholder="MOI Unified Number"
                    placeholder_ar="الرقم الموحد لوزارة الداخلية"
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
                    label="Al Ain Archive Number"
                    label_ar="رقم أرشيف العين"
                    showInfoIcon={false}
                    tooltipText="Enter Al Ain number"
                    tooltipText_ar="أدخل رقم أرشيف العين"
                    placeholder="Al Ain Archive Number"
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

        {/* Row: Match Type & Results Display + MultiSelect */}
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
        {/* Add optional search fields */}
        <Container
          className={`grid !grid-cols-1 sm:!grid-cols-2 w-full ${
            platform === "web" ? "gap-l" : ""
          }`}
        >
          <MultiSelect
            placeholder="Add search type"
            placeholder_ar="أضف نوع البحث"
            options={SearchByOwnerOptionalFields}
            value={visibleFields}
            onChange={setVisibleFields}
            language={language}
            showAddButton={true}
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
          <OwnerSearchResult
            ownerName={drawerData?.ownerName || ""}
            results={drawerData?.results || []}
            pageSize={drawerData?.pageSize}
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

export default OwnerSearchByOwner;
