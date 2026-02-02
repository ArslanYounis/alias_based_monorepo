import React, { useState, useCallback } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { TextInput } from "@platform/TextInput";
import { Buttons } from "@platform/Buttons";
import { useGetSearchByCompanyOwner } from "@shared/hooks/useGetSearchByCompanyOwner";
import type { CompanyOwnerSearchParams } from "@shared/hooks/useGetSearchByCompanyOwner";

const DEFAULT_PAGE_SIZE = 10;

export interface PlotSearchProps {
  defaultPageSize?: number;
}

export const PlotSearch: React.FC<PlotSearchProps> = ({
  defaultPageSize = DEFAULT_PAGE_SIZE,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [tradeLicense, setTradeLicense] = useState("");
  const [westernRegionArchiveNo, setWesternRegionArchiveNo] = useState("");
  const [searchParams, setSearchParams] = useState<
    (CompanyOwnerSearchParams & { pageNumber: number; pageSize: number }) | null
  >(null);

  const paramsForQuery: CompanyOwnerSearchParams & {
    pageNumber: number;
    pageSize: number;
  } = searchParams ?? {
    pageNumber: 0,
    pageSize: 0,
  };

  const { data, isLoading, isError, error } =
    useGetSearchByCompanyOwner(paramsForQuery);

  const handleSearch = useCallback(() => {
    setSearchParams({
      companyName: companyName.trim() || undefined,
      certificateNumber: certificateNumber.trim() || undefined,
      tradeLicense: tradeLicense.trim() || undefined,
      westernRegionArchiveNo: westernRegionArchiveNo.trim() || undefined,
      pageNumber: 1,
      pageSize: defaultPageSize,
    });
  }, [
    companyName,
    certificateNumber,
    tradeLicense,
    westernRegionArchiveNo,
    defaultPageSize,
  ]);

  return (
    <Container className="flex flex-col gap-4 p-4">
      <Text className="text-lg font-medium">Plot Search</Text>

      <Container className="flex flex-col gap-3 max-w-md">
        <TextInput
          label="Company Name"
          placeholder="Enter company name"
          value={companyName}
          onChange={setCompanyName}
        />
        <TextInput
          label="Certificate Number"
          placeholder="Enter certificate number"
          value={certificateNumber}
          onChange={setCertificateNumber}
        />
        <TextInput
          label="Trade License"
          placeholder="Enter trade license"
          value={tradeLicense}
          onChange={setTradeLicense}
        />
        <TextInput
          label="Western Region Archive No"
          placeholder="Enter western region archive no"
          value={westernRegionArchiveNo}
          onChange={setWesternRegionArchiveNo}
        />

        <Buttons
          title="Search"
          type="primary"
          buttonType="button"
          onClick={handleSearch}
        />
      </Container>

      {searchParams && (
        <Container className="mt-4">
          {isLoading && <Text className="text-text-dimmed">Loading...</Text>}
          {isError && (
            <Text className="text-form-fields-error">
              Error:{" "}
              {error instanceof Error ? error.message : "Something went wrong"}
            </Text>
          )}
        </Container>
      )}
    </Container>
  );
};
