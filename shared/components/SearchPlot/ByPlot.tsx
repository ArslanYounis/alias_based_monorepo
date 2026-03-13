import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";
import { Container } from "@platform/Container";
import { Select } from "@platform/Select";
import { MultiSelect } from "@platform/MultiSelect";
import { TextInput } from "@platform/TextInput";
import { NumberInput } from "@platform/NumberInput";
import { Buttons } from "@platform/Buttons";
import { CustomDrawer } from "@platform/CustomDrawer";
import { SearchIcon } from "@platform/icons";
import {
  getSearchByPlot,
  type PlotSearchResult,
} from "../../hooks/useGetSearchByPlot";
import { useGetMunicipality } from "../../hooks/useGetMunicipality";
import { useGetDistrict } from "../../hooks/useGetDistrict";
import { useGetCommunity } from "../../hooks/useGetCommunity";
import { useGetRoads } from "../../hooks/useGetRoads";
import { useGetLandUsage } from "../../hooks/useGetLandUsage";
import SearchPlotResults, { type SearchResult } from "./SearchPlotResults";
import {
  PlotSchema,
  PlotDefaultValues,
  SearchByPlotOptionalFields,
  MatchTypeOptions,
  ResultsDisplayOptions,
} from "./constants";

interface SearchByPlotProps {
  language: "en" | "ar";
  selected?: SearchResult[];
  args?: string;
  onSelectResult?: (val: SearchResult) => void;
  platform?: "web" | "mobile";
}

interface DrawerData {
  municipality: string;
  municipalityId: string;
  zone: string;
  zoneId: string;
  sector: string;
  sectorId: string;
  plotNumber: string;
  landUse: string;
  results: SearchResult[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  matchType?: string | number;
  resultsDisplay?: string | number;
  searchPayload: Record<string, unknown>;
}

const ALWAYS_INCLUDE_KEYS = [
  "municipality",
  "zone",
  "sector",
  "road",
  "matchType",
  "resultsDisplay",
] as const;

const mapToSearchResult = (item: PlotSearchResult): SearchResult => ({
  plotId: String(item.plotId ?? ""),
  plotNumber: item.plotNumber ?? "",
  landUseName: item.landUseName ?? "",
  hasMortgage: item.hasMortgage ?? false,
  code: item.code ?? "",
  backgroundColor: item.backgroundColor,
  communityName: item.communityName,
});

const ByPlot = ({
  language = "en",
  selected = [],
  args = "",
  onSelectResult,
  platform = "web",
}: SearchByPlotProps) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const visibleFieldsRef = useRef(visibleFields);
  visibleFieldsRef.current = visibleFields;
  const prevVisibleFieldsRef = useRef<string[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: getSearchByPlot,
  });

  const form = useForm({
    defaultValues: {
      ...PlotDefaultValues,
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
      onChange: PlotSchema,
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

      const initialPayload = {
        ...filtered,
        pageNumber: 0,
        pageSize: requestedPageSize,
      };

      try {
        const result = await mutateAsync(initialPayload);
        const mappedResults: SearchResult[] =
          result?.items?.map(mapToSearchResult) ?? [];

        setDrawerData({
          municipality:
            municipalityOptions.find((o) => o.value === value.municipality)
              ?.label || "",
          zone:
            districtOptions.find((o) => o.value === value.zone)?.label || "",
          sector:
            communityOptions.find((o) => o.value === value.sector)?.label || "",
          municipalityId: value.municipality,
          zoneId: value.zone,
          sectorId: value.sector,
          plotNumber: value.plotNumber,
          landUse: value.landuseId,
          results: mappedResults,
          pageNumber: result.pageNumber,
          pageSize: requestedPageSize,
          totalCount: result.totalCount,
          matchType: value.matchType,
          resultsDisplay: value.resultsDisplay,
          searchPayload: initialPayload,
        });
        setDrawerOpen(true);
      } catch (_e) {
        // handle error
      }
    },
  });

  useEffect(() => {
    const prev = prevVisibleFieldsRef.current;
    const removed = prev.filter((f) => !visibleFields.includes(f));
    removed.forEach((fieldName) => {
      form.resetField(fieldName as never);
    });
    prevVisibleFieldsRef.current = visibleFields;
  }, [visibleFields, form]);

  const municipalityVal = useStore(
    form.baseStore,
    (s) => s.values.municipality
  );
  const zoneVal = useStore(form.baseStore, (s) => s.values.zone);
  const sectorVal = useStore(form.baseStore, (s) => s.values.sector);

  const { options: municipalityOptions, isPending: isMunicipalitiesPending } =
    useGetMunicipality();
  const municipalityId = form.state.values.municipality;
  const districtId = form.state.values.zone;
  const communityId = form.state.values.sector;

  const { options: districtOptions, isPending: isDistrictsPending } =
    useGetDistrict(Number(municipalityId));
  const { options: communityOptions, isPending: isCommunityPending } =
    useGetCommunity(Number(districtId));
  const { options: roadOptions, isPending: isRoadsPending } = useGetRoads(
    Number(communityId)
  );
  const { options: landUsageOptions, isPending: isLandUsagePending } =
    useGetLandUsage(Number(municipalityId));

  const handlePageChange = async (page: number) => {
    if (!drawerData) return;
    try {
      const payload = { ...drawerData.searchPayload, pageNumber: page - 1 };
      const result = await mutateAsync(payload);
      const mappedResults = result?.items?.map(mapToSearchResult) ?? [];
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

  return (
    <Container className="flex flex-col w-full">
      <Container className="flex flex-1 flex-col gap-l">
        {/* Row 1: Municipality & Zone/District */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="municipality"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Municipality"
                label_ar="البلدية"
                required={true}
                placeholder="Choose Municipality"
                placeholder_ar="اختر البلدية"
                hasError={!!field.state.meta.errors?.length}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={isMunicipalitiesPending ? [] : municipalityOptions}
                disabled={isMunicipalitiesPending}
                language={language}
              />
            )}
          />
          <form.Field
            name="zone"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Zone/District"
                label_ar="المنطقة"
                required={true}
                placeholder="Choose Zone/District"
                placeholder_ar="اختر المنطقة/الحي"
                captionLeft=""
                captionRight=""
                hasError={
                  !!field.state.meta.errors?.length &&
                  (field.state.meta.isTouched || form.state.isSubmitted)
                }
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={isDistrictsPending ? [] : districtOptions}
                disabled={!municipalityVal || isDistrictsPending}
                language={language}
              />
            )}
          />
        </Container>

        {/* Row 2: Sector/Community & Road */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="sector"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Sector/Community"
                label_ar="القطاع"
                placeholder="Choose Sector/Community"
                placeholder_ar="اختر القطاع/المجتمع"
                captionLeft=""
                captionRight=""
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={isCommunityPending ? [] : communityOptions}
                disabled={!zoneVal}
                language={language}
              />
            )}
          />
          <form.Field
            name="road"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Road"
                label_ar="الطريق"
                placeholder="Choose Road"
                placeholder_ar="اختر الطريق"
                captionLeft=""
                captionRight=""
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={isRoadsPending ? [] : roadOptions}
                disabled={!sectorVal}
                language={language}
              />
            )}
          />
        </Container>

        {/* Row 3: Dynamic optional fields */}
        {visibleFields?.length > 0 && (
          <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
            {visibleFields.includes("plotNumber") && (
              <form.Field
                name="plotNumber"
                children={(field) => (
                  <TextInput
                    label="Plot Number"
                    label_ar="رقم القطعة"
                    showInfoIcon={false}
                    tooltipText="Enter Plot Number"
                    tooltipText_ar="أدخل رقم القطعة"
                    placeholder="Your Plot Number"
                    placeholder_ar="رقم قطعتك"
                    value={field.state.value}
                    onChange={field.handleChange}
                    disabled={false}
                    language={language}
                  />
                )}
              />
            )}
            {visibleFields.includes("landuseId") && (
              <form.Field
                name="landuseId"
                children={(field) => (
                  <Select
                    checked={field.state.value}
                    onChange={field.handleChange}
                    label="Land Use"
                    label_ar="استخدام الأرض"
                    placeholder="Choose Land Use"
                    placeholder_ar="أدخل رقم الأرض"
                    captionLeft=""
                    captionRight=""
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    options={isLandUsagePending ? [] : landUsageOptions}
                    disabled={isLandUsagePending}
                    language={language}
                  />
                )}
              />
            )}
            {visibleFields.includes("publicHouseNumber") && (
              <form.Field
                name="publicHouseNumber"
                children={(field) => (
                  <NumberInput
                    label="Public House Number"
                    label_ar="رقم المنزل العام"
                    showInfoIcon={false}
                    tooltipText="Enter Public House Number"
                    tooltipText_ar="أدخل رقم المنزل العام"
                    placeholder="Your Public House Number"
                    placeholder_ar="رقم منزلك العام"
                    value={field.state.value}
                    onChange={field.handleChange}
                    disabled={false}
                    language={language}
                  />
                )}
              />
            )}
            {visibleFields.includes("plotFileNumber") && (
              <form.Field
                name="plotFileNumber"
                children={(field) => (
                  <NumberInput
                    label="Plot File Number"
                    label_ar="رقم ملف القطعة"
                    showInfoIcon={false}
                    tooltipText="Enter Plot File Number"
                    tooltipText_ar="أدخل رقم ملف القطعة"
                    placeholder="Your Plot File Number"
                    placeholder_ar="رقم ملف قطعتك"
                    value={field.state.value}
                    onChange={field.handleChange}
                    disabled={false}
                    language={language}
                  />
                )}
              />
            )}
          </Container>
        )}

        {/* Row 4: Match Type & Results Display */}
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
            options={SearchByPlotOptionalFields}
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
            buttonType="submit"
            title="Search"
            title_ar="بحث"
            leftIcon={<SearchIcon className="text-button-primary-default-bg" />}
            language={language}
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
          <Container className="overflow-y-auto">
            <SearchPlotResults
              municipality={drawerData.municipality || ""}
              zone={drawerData.zone || ""}
              sector={drawerData.sector || ""}
              results={drawerData.results || []}
              pageSize={drawerData?.pageSize}
              totalCount={drawerData?.totalCount}
              selected={selected}
              language={language}
              onCloseDrawer={() => setDrawerOpen(false)}
              onPageChange={handlePageChange}
              isLoading={isPending}
              args={args ?? ""}
              onSelectResult={onSelectResult}
            />
          </Container>
        )}
      </CustomDrawer>
    </Container>
  );
};

export default ByPlot;
