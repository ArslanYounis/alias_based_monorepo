import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

import { Select } from "@platform/Select";
import { Buttons } from "@platform/Buttons";
import { SearchIcon } from "@platform/icons";
import { TextInput } from "@platform/TextInput";
import { Container } from "@platform/Container";
import { NumberInput } from "@platform/NumberInput";
import { CustomDrawer } from "@platform/CustomDrawer";

import { searchByOwner } from "@shared/hooks/useSearchByOwner";
import SearchAllotmentResult, {
  ISearchAllotmentResult,
} from "./searchAllotmentResult";
import {
  OwnerSchema,
  MatchTypeOptions,
  OwnerDefaultValues,
  ResultsDisplayOptions,
} from "./constants";

interface SearchByOwnerProps {
  language: "en" | "ar";
  selected?: ISearchAllotmentResult[];
  onSubmit?: (val: ISearchAllotmentResult[]) => void;
  platform?: "web" | "mobile";
}

interface DrawerData {
  decreeOrder?: string | number;
  fullName?: string;
  familyBookNumber?: string;
  nationalNumber?: string;
  tribe?: string;
  cityNo?: string;
  results: ISearchAllotmentResult[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  matchTypeId?: string | number;
}

const SearchByOwner = ({
  selected = [],
  onSubmit,
  language,
  platform = "web",
}: SearchByOwnerProps) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: searchByOwner,
  });

  const form = useForm({
    defaultValues: {
      ...OwnerDefaultValues,
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
      onChange: OwnerSchema,
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

      try {
        const payload = {
          fullName: filtered?.fullName,
          familyBookNumber: filtered?.familyBookNumber,
          nationalNumber: filtered?.nationalNumber,
          tribe: filtered?.tribe,
          cityNo: filtered?.cityNo,
          matchTypeId: filtered?.matchTypeId,
          pageNumber: 0,
          pageSize: requestedPageSize,
        };

        const result = await mutateAsync(payload);

        const mappedResults: ISearchAllotmentResult[] =
          result?.items?.map((item) => ({
            ...item,
            id: item?.allotmentNameId
              ? String(item.allotmentNameId)
              : undefined,
            allotmentNameId: item?.allotmentNameId
              ? String(item.allotmentNameId)
              : "",
            fullName: item?.fullName ?? "",
            familyBookNumber: item?.familyBookNumber ?? "",
          })) ?? [];

        setDrawerData({
          decreeOrder: filtered?.decreeOrder,
          fullName: filtered?.fullName,
          familyBookNumber: filtered?.familyBookNumber,
          nationalNumber: filtered?.nationalNumber,
          tribe: filtered?.tribe,
          cityNo: filtered?.cityNo,
          results: mappedResults,
          pageNumber: result.pageNumber,
          pageSize: requestedPageSize,
          totalCount: result.totalCount,
          matchTypeId: value.matchTypeId,
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

    try {
      const payload = {
        decreeOrder: drawerData?.decreeOrder,
        fullName: drawerData?.fullName,
        familyBookNumber: drawerData?.familyBookNumber,
        nationalNumber: drawerData?.nationalNumber,
        tribe: drawerData?.tribe,
        cityNo: drawerData?.cityNo,
        matchTypeId: drawerData?.matchTypeId,
        pageNumber: page - 1,
        pageSize: drawerData.pageSize,
      };

      const result = await mutateAsync(payload);

      const mappedResults: ISearchAllotmentResult[] =
        result?.items?.map((item) => ({
          ...item,
          id: item?.allotmentNameId ? String(item.allotmentNameId) : undefined,
          allotmentNameId: item?.allotmentNameId
            ? String(item.allotmentNameId)
            : "",
          fullName: item?.fullName ?? "",
          familyBookNumber: item?.familyBookNumber ?? "",
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

  return (
    <Container className="flex flex-col w-full">
      <Container className="flex w-full flex-col gap-l">
        {/* Row 1: Owner Name & Family Name */}
        <Container className="grid grid-cols-1! sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="fullName"
            children={(field) => (
              <TextInput
                label="Full Name"
                label_ar="اسم العائلة"
                showInfoIcon={false}
                tooltipText="Enter full name"
                tooltipText_ar="أدخل الاسم الكامل"
                placeholder="Full Name"
                placeholder_ar="الاسم الكامل"
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
            name="familyBookNumber"
            children={(field) => (
              <NumberInput
                label="Family Number"
                label_ar="رقم العائلة"
                showInfoIcon={false}
                tooltipText="Enter family number"
                tooltipText_ar="أدخل رقم العائلة"
                placeholder="Famiily Number"
                placeholder_ar="رقم العائلة"
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
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="nationalNumber"
            children={(field) => (
              <TextInput
                label="National ID"
                label_ar="الهوية الوطنية"
                showInfoIcon={false}
                tooltipText="Enter national ID"
                tooltipText_ar="أدخل الرقم القومي"
                placeholder="National ID"
                placeholder_ar="الهوية الوطنية"
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
            name="tribe"
            children={(field) => (
              <TextInput
                label="Tribe"
                label_ar="قبيلة"
                showInfoIcon={false}
                tooltipText="Enter Tribe"
                tooltipText_ar="أدخل القبيلة"
                placeholder="Tribe"
                placeholder_ar="قبيلة"
                value={field.state.value}
                onChange={field.handleChange}
                errorMessage={field.state.meta.errors?.[0]?.message}
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
                language={language}
              />
            )}
          />
        </Container>

        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="cityNo"
            children={(field) => (
              <TextInput
                label="City Number"
                label_ar="رقم المدينة"
                showInfoIcon={false}
                tooltipText="Enter city number"
                tooltipText_ar="أدخل رقم المدينة"
                placeholder="City Number"
                placeholder_ar="رقم المدينة"
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

        {/* Dynamic fields grid end */}
        {/* Row 5: Match Type & Results Display, MultiSelectDropdown  */}
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
                captionLeft=""
                captionRight=""
                errorMessage={field.state.meta.errors?.[0]?.message}
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
                captionLeft=""
                captionRight=""
                errorMessage={field.state.meta.errors?.[0]?.message}
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
          <SearchAllotmentResult
            fullName={drawerData?.fullName || ""}
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
