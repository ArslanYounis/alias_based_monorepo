/**
 * Owner search result item (aligns with ADREC NewApplicationSearchOwnerResult IOwnerSearchResult).
 */
export interface IOwnerSearchResult {
  id?: string;
  ownerId: string;
  ownerName?: string;
  ownerName_ar?: string;
  nationalNumber?: string;
  moiUnifiedNumber?: string;
  nationalityName?: string;
  nationalityName_ar?: string;
  cityName?: string;
  backgroundColor?: string;
  ownerName_E?: string;
  ownerName_A?: string;
  /** Company-specific (when result is from company search) */
  companyName?: string;
  code?: string;
  plotNumber?: string;
  landUse?: string;
}

/**
 * Labels for owner type RadioCards (company / owner).
 */
export interface OwnerTypeOptions {
  company: string;
  company_ar: string;
  owner: string;
  owner_ar: string;
}

/**
 * Props for the main OwnerSearch (NewApplicationSearchOwner) component.
 */
export interface OwnerSearchProps {
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  ownerTypeOptions?: OwnerTypeOptions;
  initialOwnerType?: "company" | "owner";
  theme?: "light" | "dark";
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
  language?: "en" | "ar";
}

export interface SearchByOwnerProps {
  theme?: "light" | "dark";
  language: "en" | "ar";
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
  /** When provided, search uses this API instead of mock. Enables pagination. */
  onSearchByOwner?: (payload: SearchByOwnerPayload) => Promise<SearchByOwnerResponse>;
}

export interface SearchByCompanyOwnerProps {
  theme?: "light" | "dark";
  language: "en" | "ar";
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
  /** When provided, search uses this API instead of mock. Enables pagination. */
  onSearchByCompanyOwner?: (payload: SearchByCompanyOwnerPayload) => Promise<SearchByCompanyOwnerResponse>;
}

export interface OwnerSearchResultProps {
  results: IOwnerSearchResult[];
  selected?: IOwnerSearchResult[];
  onSubmit?: (val: IOwnerSearchResult[]) => void;
  language: "en" | "ar";
  isLoading?: boolean;
  onClose?: () => void;
  /** When results are shown in a drawer/modal */
  isOpen?: boolean;
  /** Search criteria label (e.g. owner/company name) — shown in result header with Edit link */
  ownerName?: string;
  pageSize?: number;
  totalCount?: number;
  /** 1-based current page for Pagination */
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

/** Payload for owner search API (matches ADREC getSearchByOwner / SearchByOwner form payload) */
export interface SearchByOwnerPayload {
  ownerName?: string;
  nationalNumber?: string;
  nationalityId?: string;
  familyBookNumber?: string;
  cityNumber?: string;
  passPortNumber?: string;
  moiUnifiedNumber?: string;
  matchTypeId?: string;
  pageNumber: number;
  pageSize: number;
}

/** Payload for company owner search API (matches ADREC getSearchByCompanyOwner params) */
export interface SearchByCompanyOwnerPayload {
  companyName?: string;
  tradeLicense?: string;
  certificateNumber?: string;
  westernRegionArchiveNo?: string;
  abuDhabiArchiveNo?: string;
  alAinArchiveNo?: string;
  matchType?: string;
  resultsDisplay?: string;
  pageNumber: number;
  pageSize: number;
}

/** Response shape for owner search API */
export interface SearchByOwnerResponse {
  items?: Array<{ ownerId?: number; ownerName?: string; [key: string]: unknown }>;
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

/** Response shape for company owner search API */
export interface SearchByCompanyOwnerResponse {
  items?: Array<{ ownerId?: number; companyName?: string; [key: string]: unknown }>;
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}
