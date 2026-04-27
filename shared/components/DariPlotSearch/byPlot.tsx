import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";

import { Select } from "@platform/Select";
import { Buttons } from "@platform/Buttons";
import { SearchIcon } from "@platform/icons";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { MultiSelect } from "@platform/MultiSelect";
import { NumberInput } from "@platform/NumberInput";
import { CustomDrawer } from "@platform/CustomDrawer";

import DariPlotSearchResult from "./dariPlotSearchResult";
import type { SearchResult } from "./dariPlotSearchResult";

import { useGetDariLanduses } from "@shared/hooks/useGetDariLanduses";
import { useGetDariMunicipality } from "@shared/hooks/useGetDariMunicipality";
import {
  getSearchByDariPlot,
  DariPlotSearchParams,
} from "@shared/hooks/useGetSearchByDariPlot";
import {
  PlotSchema,
  MatchTypeOptions,
  PlotDefaultValues,
  ResultsDisplayOptions,
  SearchByPlotOptionalFields,
} from "./constants";

interface SearchByPlotProps {
  language: "en" | "ar";
  selected?: SearchResult[];
  onSelectResult?: (val: SearchResult) => void;
  platform?: "web" | "mobile";
}

interface DrawerData {
  municipality: string;
  municipalityId: string;
  zone: string;
  zoneId: string;
  roadId: string;
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
  /** Original search payload used for fetching results, reused for pagination. */
  searchPayload: DariPlotSearchParams;
}

/** Form keys that are always sent in the search payload (always visible). */
const ALWAYS_INCLUDE_KEYS = [
  "municipality",
  "zone",
  "sector",
  "road",
  "matchType",
  "resultsDisplay",
] as const;

const hasValue = (v: unknown) =>
  v !== undefined &&
  v !== null &&
  `${v}`.trim() !== "" &&
  `${v}`.trim().toLowerCase() !== "undefined" &&
  `${v}`.trim().toLowerCase() !== "null";

const ByPlot = ({
  language = "en",
  selected = [],
  onSelectResult,
  platform = "web",
}: SearchByPlotProps) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const visibleFieldsRef = useRef(visibleFields);
  visibleFieldsRef.current = visibleFields;
  const prevVisibleFieldsRef = useRef<string[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  // Fetch municipalities options
  const { data: municipalityOptions, isPending: isMunicipalitiesPending } =
    useGetDariMunicipality();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: getSearchByDariPlot,
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
      // Only include fields that are visible: always-visible keys + optional keys currently in visibleFields
      const currentVisible = visibleFieldsRef.current;
      const allowedKeys = new Set([...ALWAYS_INCLUDE_KEYS, ...currentVisible]);
      const onlyVisibleValues = Object.fromEntries(
        Object.entries(value).filter(([k]) => allowedKeys.has(k))
      );
      const filtered = Object.fromEntries(
        Object.entries(onlyVisibleValues).filter(
          ([, v]) => hasValue(v) && !Number.isNaN(v)
        )
      );
      // Use the resultsDisplay value as pageSize. Coerce to number and fallback to 10.
      const requestedPageSize =
        Number(value.resultsDisplay) &&
        !Number.isNaN(Number(value.resultsDisplay))
          ? Number(value.resultsDisplay)
          : 10;

      // Build payload keys to match API: municipalityID, districtID, communityID, landUseID, plotfileNumber, etc.
      const municipalityID = Number(filtered?.municipality);
      const districtID = Number(filtered?.zone);
      const matchType = Number(value.matchType);

      const initialPayload: DariPlotSearchParams = {
        municipalityID,
        districtID,
        propertyType: 1,
        direction: "asc",
        searchBy: 1,
        page: 0,
        matchType,
        pageSize: requestedPageSize,
        ...(hasValue(filtered?.sector) && {
          communityID: Number(filtered.sector),
        }),
        ...(hasValue(filtered?.road) && {
          roadID: Number(filtered.road),
        }),
        ...(hasValue(filtered?.landuseId) && {
          landUseID: Number(filtered.landuseId),
        }),
        ...(hasValue(filtered?.plotNumber) && {
          plotNumber: String(filtered.plotNumber),
        }),
        ...(hasValue(filtered?.plotAddress) && {
          plotAddress: String(filtered.plotAddress),
        }),
        ...(hasValue(filtered?.plotFileNumber) && {
          plotfileNumber: String(filtered.plotFileNumber),
        }),
        ...(hasValue(filtered?.publicHouseNumber) && {
          publicHouseNumber: String(filtered.publicHouseNumber),
        }),
      };
      try {
        const result = await mutateAsync(initialPayload);
        console.log({ result });

        const mappedResults: SearchResult[] =
          result?.result?.properties?.map((item) => ({
            ...item,
            // Normalize undefined values for easier rendering.
            plotNumber: item?.plotNumber ?? "",
            landUseNameEn: item?.landUseNameEn ?? "",
            landUseNameAr: item?.landUseNameAr ?? "",
            communityNameEn: item?.communityNameEn ?? "",
            communityNameAr: item?.communityNameAr ?? "",
          })) ?? [];

        setDrawerData({
          municipality:
            mappedMunicipalityOptions?.find(
              (o) => o.value === value.municipality
            )?.label || "",
          zone:
            districtOptions?.find((o) => o.value === value.zone)?.label || "",
          sector:
            communityOptions?.find((o) => o.value === value.sector)?.label ||
            "",
          municipalityId: value.municipality,
          zoneId: value.zone,
          sectorId: value.sector,
          roadId: value.road,
          plotNumber: value.plotNumber,
          landUse: value.landuseId,
          results: mappedResults,
          pageNumber: result?.result?.pageNumber,
          pageSize: requestedPageSize,
          totalCount: result?.result?.totalCount,
          matchType: value.matchType,
          resultsDisplay: value.resultsDisplay,
          searchPayload: initialPayload,
        });
        setDrawerOpen(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // handle error (show toast, etc)
      }
    },
  });

  const zoneVal = useStore(form.baseStore, (s) => s.values.zone);
  const sectorVal = useStore(form.baseStore, (s) => s.values.sector);

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

  // Fetch options
  const municipalityVal = useStore(
    form.baseStore,
    (s) => s.values.municipality
  );

  const municipalityId = form.state.values.municipality;

  const mappedMunicipalityOptions = Array.from(
    new Map(
      municipalityOptions?.map((item) => [
        String(item.municipalityID),
        {
          value: String(item.municipalityID),
          label:
            language === "ar"
              ? item.municipalityNameAr
              : item.municipalityNameEn,
        },
      ])
    ).values()
  );

  const districtOptions = Array.from(
    new Map(
      municipalityOptions
        ?.filter((item) => item.municipalityID === Number(municipalityVal))
        .map((item) => [
          String(item.districtID),
          {
            value: String(item.districtID),
            label:
              language === "ar"
                ? `${item.districtNameAr}`
                : `${item.districtNameEn}`,
          },
        ])
    ).values()
  );

  const communityOptions = Array.from(
    new Map(
      municipalityOptions
        ?.filter((item) => item.districtID === Number(zoneVal))
        .map((item) => [
          String(item.communityID),
          {
            value: String(item.communityID),
            label:
              language === "ar"
                ? `${item.communityNameAr}`
                : `${item.communityNameEn}`,
          },
        ])
    ).values()
  );

  const roadOptions = Array.from(
    new Map(
      municipalityOptions
        ?.filter((item) => item.communityID === Number(sectorVal))
        .map((item) => [
          String(item.roadID),
          {
            value: String(item.roadID),
            label:
              language === "ar" ? `${item.roadNameAr}` : `${item.roadNameEn}`,
          },
        ])
    ).values()
  );

  // Fetch land-usage dynamically
  const { data: landUsageOptions, isPending: isLandUsagePending } =
    useGetDariLanduses(Number(municipalityId));

  const mappedLandUseOptions = (landUsageOptions || [])?.map((item) => ({
    value: String(item.landUseID),
    label: language === "ar" ? item.landUseNameAr : item.landUseNameEn,
  }));

  // Pagination handler
  const handlePageChange = async (page: number) => {
    if (!drawerData) return;

    try {
      // Reuse the original search payload; only change page (0-based).
      const payload: DariPlotSearchParams = {
        ...drawerData.searchPayload,
        searchBy: 1,
        propertyType: 1,
        direction: "asc",
        page: page - 1,
      };
      const result = await mutateAsync(payload);

      const mappedResults: SearchResult[] =
        result?.result?.properties?.map((item) => ({
          ...item,
          plotNumber: item?.plotNumber ?? "",
          landUseNameEn: item?.landUseNameEn ?? "",
          landUseNameAr: item?.landUseNameAr ?? "",
          communityNameEn: item?.communityNameEn ?? "",
          communityNameAr: item?.communityNameAr ?? "",
        })) ?? [];

      setDrawerData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          results: mappedResults,
          pageNumber: result?.result?.pageNumber,
          totalCount: result?.result?.totalCount,
          searchPayload: payload,
        };
      });
    } catch (error) {
      console.error("Pagination fetch failed:", error);
    }
  };

  return (
    <Container className="flex flex-col w-full">
      <Container className="flex w-full flex-col gap-l">
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
                options={
                  isMunicipalitiesPending ? [] : mappedMunicipalityOptions
                }
                disabled={isMunicipalitiesPending ? true : false}
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
                hasError={
                  !!field.state.meta.errors?.length &&
                  (field.state.meta.isTouched || form.state.isSubmitted)
                }
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={isMunicipalitiesPending ? [] : districtOptions}
                disabled={!municipalityVal || isMunicipalitiesPending}
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
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={isMunicipalitiesPending ? [] : communityOptions}
                disabled={isMunicipalitiesPending}
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
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={isMunicipalitiesPending ? [] : roadOptions}
                disabled={isMunicipalitiesPending}
                language={language}
              />
            )}
          />
        </Container>
        {/* Row 3: Dynamic fields grid start */}
        {visibleFields?.length > 0 && (
          <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
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
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    options={isLandUsagePending ? [] : mappedLandUseOptions}
                    disabled={isLandUsagePending ? true : false}
                    language={language}
                  />
                )}
              />
            )}
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
            {visibleFields.includes("plotAddress") && (
              <form.Field
                name="plotAddress"
                children={(field) => (
                  <TextInput
                    label="Plot Address"
                    label_ar="عنوان القطعة"
                    showInfoIcon={false}
                    tooltipText="Enter Plot Address"
                    tooltipText_ar="أدخل عنوان القطعة"
                    placeholder="Your Plot Address"
                    placeholder_ar="عنوان قطعتك"
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
            title={"Search"}
            title_ar={"بحث"}
            leftIcon={<SearchIcon className="text-button-primary-default-bg" />}
            language={language}
            disabled={isPending}
            onClick={() => form.handleSubmit()}
          />
        </Container>
      </Container>

      {/* Drawer */}

      <CustomDrawer
        size="layer1"
        language={language}
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
      >
        {drawerData && (
          <Container className="overflow-y-auto">
            <DariPlotSearchResult
              municipalityNameEn={drawerData.municipality || ""}
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
              onSelectResult={onSelectResult}
              platform={platform}
            />
          </Container>
        )}
      </CustomDrawer>
    </Container>
  );
};

export default ByPlot;
