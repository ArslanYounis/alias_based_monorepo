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
import { getSearchByOwner } from "../../hooks/useGetSearchByOwner";
import type { IOwnerSearchResult } from "./SearchOwnerResult";
import SearchOwnerResult from "./SearchOwnerResult";
import type { IOwnerPlotsSearchResult } from "./SearchOwnerPlotsResult";
import {
  OwnerSchema,
  OwnerDefaultValues,
  SearchByOwnerOptionalFields,
  MatchTypeOptions,
  ResultsDisplayOptions,
} from "./constants";

interface ByOwnerProps {
  args?: string;
  language: "en" | "ar";
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerPlotsSearchResult) => void;
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

const SearchIconSvg = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-button-primary-default-bg"
  >
    <path
      d="M21 21L16.657 16.657M16.657 16.657A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonSvgIcon = ({ className }: { className?: string }) => (
  <svg
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20.2805 17.0813C19.7752 15.9343 19.0419 14.8924 18.1216 14.0137C17.204 13.1325 16.117 12.4299 14.9207 11.9448C14.9099 11.9396 14.8992 11.9371 14.8885 11.9319C16.5573 10.7768 17.6421 8.8952 17.6421 6.77232C17.6421 3.25558 14.6689 0.40625 10.9992 0.40625C7.32959 0.40625 4.35637 3.25558 4.35637 6.77232C4.35637 8.8952 5.44119 10.7768 7.10994 11.9345C7.09923 11.9396 7.08852 11.9422 7.0778 11.9473C5.8778 12.4325 4.80102 13.1281 3.87691 14.0163C2.95738 14.8957 2.22424 15.9373 1.71798 17.0838C1.22063 18.2062 0.952396 19.4096 0.927801 20.6288C0.927086 20.6562 0.932101 20.6835 0.942549 20.709C0.952997 20.7345 0.968668 20.7577 0.988638 20.7773C1.00861 20.797 1.03247 20.8125 1.05883 20.8232C1.08518 20.8338 1.11349 20.8393 1.14209 20.8393H2.74923C2.86709 20.8393 2.96084 20.7494 2.96352 20.6391C3.01709 18.6574 3.84744 16.8015 5.3153 15.3948C6.83405 13.9393 8.85102 13.1384 10.9992 13.1384C13.1474 13.1384 15.1644 13.9393 16.6832 15.3948C18.151 16.8015 18.9814 18.6574 19.0349 20.6391C19.0376 20.752 19.1314 20.8393 19.2492 20.8393H20.8564C20.885 20.8393 20.9133 20.8338 20.9396 20.8232C20.966 20.8125 20.9899 20.797 21.0098 20.7773C21.0298 20.7577 21.0455 20.7345 21.0559 20.709C21.0664 20.6835 21.0714 20.6562 21.0707 20.6288C21.0439 19.4018 20.7787 18.2081 20.2805 17.0813ZM10.9992 11.1875C9.76977 11.1875 8.61262 10.728 7.74209 9.89375C6.87155 9.05949 6.39209 7.95056 6.39209 6.77232C6.39209 5.59409 6.87155 4.48516 7.74209 3.65089C8.61262 2.81663 9.76977 2.35714 10.9992 2.35714C12.2287 2.35714 13.3858 2.81663 14.2564 3.65089C15.1269 4.48516 15.6064 5.59409 15.6064 6.77232C15.6064 7.95056 15.1269 9.05949 14.2564 9.89375C13.3858 10.728 12.2287 11.1875 10.9992 11.1875Z"
      fill="currentColor"
    />
  </svg>
);

const UAENationalSvgIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 3.49342C8.4301 2.57603 10.1499 2.04102 12 2.04102C16.1031 2.04102 19.5649 4.67233 20.6482 8.27018"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21.2077V13.541"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 21.2077V10.666C3 9.65794 3.18046 8.69026 3.51212 7.79102"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 21.2077V10.9535C18 7.6191 15.3137 4.91602 12 4.91602C8.68629 4.91602 6 7.6191 6 10.9535V13.541"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 21.2083V17.375"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 21.2077V10.8098C9 9.14256 10.3431 7.79102 12 7.79102C12.8653 7.79102 13.645 8.15964 14.1926 8.74935"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 21.2077V13.541"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21.2077V17.8535"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 10.666V13.541"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ByOwner = ({
  args = "",
  language = "en",
  selected = [],
  onSubmit = () => {},
}: ByOwnerProps) => {
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
                icon={<UAENationalSvgIcon className="text-text-default" />}
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
                icon={<PersonSvgIcon className="text-text-default" />}
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
                icon={<PersonSvgIcon className="text-text-default" />}
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

        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <MultiSelect
            placeholder="Add search type"
            placeholder_ar="أضف نوع البحث"
            options={SearchByOwnerOptionalFields}
            value={visibleFields}
            onChange={setVisibleFields}
            language={language}
            showAddButton={true}
          />
          <Container />
        </Container>

        {/* Submit Button */}
        <Container>
          <Buttons
            size="l"
            type="secondary"
            title="Search"
            title_ar="بحث"
            language={language}
            leftIcon={<SearchIconSvg />}
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
            args={args}
          />
        )}
      </CustomDrawer>
    </Container>
  );
};

export default ByOwner;
