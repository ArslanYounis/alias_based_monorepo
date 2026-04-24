import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { Select } from "@platform/Select";
import { Buttons } from "@platform/Buttons";
import { SearchIcon } from "@platform/icons";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { NumberInput } from "@platform/NumberInput";
import { CustomDrawer } from "@platform/CustomDrawer";
import { MultiSelect } from "@platform/MultiSelect";

import DariOwnerSearchResult from "./dariOwnerSearchResult";
import { useGetDariNationalities } from "../../hooks/useGetDariNationalities";
import {
  getSearchByDariOwner,
  DariOwnerSearchResultProps,
} from "../../hooks/useGetSearchByDariOwner";
import {
  MatchTypeOptions,
  ResultsDisplayOptions,
  DariSearchOwnerSchema,
  DariSearchOwnerDefaultValues,
  DariSearchOwnerOptionalFields,
} from "./constants";

interface SearchByOwnerProps {
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
  searchPayload?: OwnerSearchPayload;
}

interface OwnerSearchPayload {
  ownerType: string;
  searchBy: string;
  emiratesID?: string;
  unifiedNumber?: string;
  passportNo?: string;
  nationalityID?: string;
  ownerName?: string;
  email?: string;
  mobileNo?: string;
  familyNo?: string;
  familyName?: string;
  certificateNo?: string;
  pageSize: number;
  page: number;
}

/** Form keys that are always sent in the search payload (always visible). */
const ALWAYS_INCLUDE_KEYS = [
  "emiratesID",
  "moiUnifiedNo",
  "passportNo",
  "nationality",
  "matchType",
  "resultsDisplay",
] as const;

const SearchByOwner = ({
  selected = [],
  onSubmit,
  language,
  platform = "web",
}: SearchByOwnerProps) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const visibleFieldsRef = useRef(visibleFields);
  visibleFieldsRef.current = visibleFields;
  const prevVisibleFieldsRef = useRef<string[]>([]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { options: nationalityOptions, isLoading: isNationalityLoading } =
    useGetDariNationalities();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: getSearchByDariOwner,
  });

  const form = useForm({
    defaultValues: {
      ...DariSearchOwnerDefaultValues,
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
      onChange: DariSearchOwnerSchema,
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
        const payload: OwnerSearchPayload = {
          ownerType: "1",
          searchBy: "1",
          emiratesID: filtered?.emiratesID,
          unifiedNumber: filtered?.moiUnifiedNo,
          passportNo: filtered?.passportNo,
          nationalityID: filtered?.nationality,
          ownerName: filtered?.ownerName,
          email: filtered?.email,
          mobileNo: filtered?.mobileNumber,
          familyNo: filtered?.familyNo,
          familyName: filtered?.familyName,
          certificateNo: filtered?.lastCertificateNumber,
          pageSize: requestedPageSize,
          page: 1,
        };

        const result = await mutateAsync(payload);

        const mappedResults: DariOwnerSearchResultProps[] =
          result?.items?.map((item) => ({
            ...item,
            ownerId: item?.ownerID ? String(item.ownerID) : "",
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
      const payload: OwnerSearchPayload = {
        ...drawerData.searchPayload,
        page,
      };

      const result = await mutateAsync(payload);

      const mappedResults: DariOwnerSearchResultProps[] =
        result?.items?.map((item) => ({
          ...item,
          ownerId: item?.ownerId ? String(item.ownerId) : "",
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
        {/* Row 1 */}
        <Container className="grid grid-cols-1! sm:grid-cols-2! gap-l w-full">
          <form.Field
            name="emiratesID"
            children={(field) => (
              <TextInput
                label="Emirates ID"
                label_ar="رقم الهوية الإماراتية"
                placeholder="Enter Emirates ID"
                placeholder_ar="أدخل رقم الهوية الإماراتية"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                hasError={!!field.state.meta.errors?.length}
                language={language}
                showInfoIcon={false}
              />
            )}
          />

          <form.Field
            name="moiUnifiedNo"
            children={(field) => (
              <TextInput
                label="MOI Unified Number"
                label_ar="الرقم الموحد"
                placeholder="Enter MOI Unified Number"
                placeholder_ar="أدخل الرقم الموحد"
                value={field.state.value}
                onChange={field.handleChange}
                language={language}
                showInfoIcon={false}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                hasError={!!field.state.meta.errors?.length}
              />
            )}
          />
        </Container>

        {/* Row 2 */}
        <Container className="grid grid-cols-1! sm:grid-cols-2! gap-l w-full">
          <form.Field
            name="passportNo"
            children={(field) => (
              <TextInput
                label="Passport Number"
                label_ar="رقم جواز السفر"
                placeholder="Enter Passport Number"
                placeholder_ar="أدخل رقم جواز السفر"
                value={field.state.value}
                onChange={field.handleChange}
                language={language}
                showInfoIcon={false}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                hasError={!!field.state.meta.errors?.length}
              />
            )}
          />

          <form.Field
            name="nationality"
            children={(field) => (
              <Select
                checked={field.state.value}
                onChange={field.handleChange}
                label="Nationality"
                label_ar="الجنسية"
                placeholder="Enter Nationality"
                placeholder_ar="أدخل الجنسية"
                hasError={!!field.state.meta.errors?.length}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                options={nationalityOptions}
                disabled={isNationalityLoading}
                language={language}
                showInfoIcon={false}
              />
            )}
          />
        </Container>

        {/* Row 3 */}
        {visibleFields?.length > 0 && (
          <Container className="grid grid-cols-1! sm:grid-cols-2! gap-l w-full">
            {visibleFields.includes("ownerName") && (
              <form.Field
                name="ownerName"
                children={(field) => (
                  <TextInput
                    label="Owner Name"
                    label_ar="اسم المالك"
                    placeholder="Enter Owner Name"
                    placeholder_ar="أدخل اسم المالك"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                    showInfoIcon={false}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
                  />
                )}
              />
            )}
            {visibleFields.includes("email") && (
              <form.Field
                name="email"
                children={(field) => (
                  <TextInput
                    label="Email"
                    label_ar="البريد الإلكتروني"
                    placeholder="Enter Email"
                    placeholder_ar="أدخل البريد الإلكتروني"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                    showInfoIcon={false}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
                  />
                )}
              />
            )}

            {/* Row 4 */}

            {visibleFields.includes("mobileNumber") && (
              <form.Field
                name="mobileNumber"
                children={(field) => (
                  <NumberInput
                    label="Mobile Number"
                    label_ar="رقم الهاتف"
                    placeholder="Enter Mobile Number"
                    placeholder_ar="أدخل رقم الهاتف"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                    showInfoIcon={false}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
                  />
                )}
              />
            )}
            {visibleFields.includes("familyNo") && (
              <form.Field
                name="familyNo"
                children={(field) => (
                  <NumberInput
                    label="Family Number"
                    label_ar="رقم الأسرة"
                    placeholder="Enter Family Number"
                    placeholder_ar="أدخل رقم الأسرة"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                    showInfoIcon={false}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
                  />
                )}
              />
            )}

            {/* Row 5 */}
            {visibleFields.includes("familyName") && (
              <form.Field
                name="familyName"
                children={(field) => (
                  <TextInput
                    label="Family Name"
                    label_ar="اسم العائلة"
                    placeholder="Enter Family Name"
                    placeholder_ar="أدخل اسم العائلة"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                    showInfoIcon={false}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
                  />
                )}
              />
            )}
            {visibleFields.includes("lastCertificateNumber") && (
              <form.Field
                name="lastCertificateNumber"
                children={(field) => (
                  <NumberInput
                    label="Last Certificate Number"
                    label_ar="رقم الشهادة الأخيرة"
                    placeholder="Enter Last Certificate Number"
                    placeholder_ar="أدخل رقم الشهادة الأخيرة"
                    value={field.state.value}
                    onChange={field.handleChange}
                    language={language}
                    showInfoIcon={false}
                    errorMessage={field.state.meta.errors?.[0]?.message}
                    errorMessage_ar={field.state.meta.errors?.[0]?.message}
                    hasError={!!field.state.meta.errors?.length}
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
            options={DariSearchOwnerOptionalFields}
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
export default SearchByOwner;
