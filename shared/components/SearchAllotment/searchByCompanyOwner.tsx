import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

import { Select } from "@platform/Select";
import { Buttons } from "@platform/Buttons";
import { SearchIcon } from "@platform/icons";
import { TextInput } from "@platform/TextInput";
import { Container } from "@platform/Container";
import { NumberInput } from "@platform/NumberInput";
import { MultiSelect } from "@platform/MultiSelect";
import { CustomDrawer } from "@platform/CustomDrawer";

import { searchByCompanyOwner } from "@shared/hooks/useSearchByCompanyOwner";

import SearchAllotmentResult, {
  ISearchAllotmentResult,
} from "./searchAllotmentResult";
import {
  MatchTypeOptions,
  CompanyOwnerSchema,
  ResultsDisplayOptions,
  CompanyOwnerDefaultValues,
} from "./constants";

interface SearchByCompanyOwnerProps {
  language: "en" | "ar";
  selected?: ISearchAllotmentResult[];
  onSubmit?: (val: ISearchAllotmentResult[]) => void;
  platform?: "web" | "mobile";
}

interface DrawerData {
  companyName?: string;
  fullName?: string;
  tradeNumber?: string;
  tradeLicense?: string;
  certificateNumber?: string;
  results: ISearchAllotmentResult[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  matchTypeId?: string | number;
}

const SearchByCompanyOwner = ({
  selected = [],
  onSubmit,
  language,
  platform = "web",
}: SearchByCompanyOwnerProps) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: searchByCompanyOwner,
  });

  const form = useForm({
    defaultValues: {
      ...CompanyOwnerDefaultValues,
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
      onChange: CompanyOwnerSchema,
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
          fullName: filtered.fullName || "",
          tradeNumber: filtered.tradeNumber || "",
          certificateNumber: filtered.certificateNumber || "",
          matchTypeId: filtered?.matchTypeId,
          pageSize: requestedPageSize,
          pageNumber: 0,
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
            companyName: item?.companyName ?? "",
            tradeNumber: item?.tradeNumber ?? "",
            certificateNumber: item?.certificateNumber ?? "",
            familyBookNumber: item?.familyBookNumber ?? "",
          })) ?? [];

        setDrawerData({
          companyName: value?.fullName,
          tradeNumber: value?.tradeNumber,
          certificateNumber: value.certificateNumber,
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
        ownerName: drawerData?.companyName,
        tradeLicense: drawerData.tradeLicense ?? "",
        certificateNumber: drawerData.certificateNumber ?? "",
        requestId: 0,
        matchTypeId: drawerData.matchTypeId
          ? String(drawerData.matchTypeId)
          : undefined,
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
          companyName: item?.companyName ?? "",
          code: item?.companyName ?? "",
          plotNumber: item?.certificateNumber ?? "",
          tradeNumber: item?.tradeLicense ?? "",
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
        {/* Row 1: Company Name & Certificate Number */}
        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="fullName"
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

        {/* Row 3: Dynamic fields grid start */}

        <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l w-full">
          <form.Field
            name="tradeNumber"
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
        </Container>

        {/* Dynamic fields grid end */}

        {/* Row 4: Match Type & Results Display */}
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
                errorMessage_ar={field.state.meta.errors?.[0]?.message}
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
            ownerName={drawerData.companyName || ""}
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
