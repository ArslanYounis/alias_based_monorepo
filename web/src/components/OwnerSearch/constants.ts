/**
 * Optional fields for "Add search type" in SearchByOwner.
 * User selects which additional fields to show; options match ADREC SearchByOwnerOptionalFields.
 */
export const SEARCH_BY_OWNER_OPTIONAL_FIELDS = [
  { value: "passportNumber", label: "Passport Number", label_ar: "رقم الجواز" },
  { value: "abuDhabiArchiveNo", label: "Abu Dhabi Archive No", label_ar: "رقم أرشيف أبوظبي" },
  { value: "familyNoCity", label: "Family No / City", label_ar: "رقم العائلة/المدينة" },
  { value: "westernRegionArchiveNo", label: "Western Region Archive No", label_ar: "رقم أرشيف المنطقة الغربية" },
  { value: "moiUnifiedNumber", label: "Moi Unified Number", label_ar: "الرقم الموحد لوزارة الداخلية" },
  { value: "alAinArchiveNo", label: "Al Ain Archive No", label_ar: "رقم أرشيف العين" },
] as const;

/**
 * Optional fields for "Add search type" in SearchByCompanyOwner.
 */
export const SEARCH_BY_COMPANY_OWNER_OPTIONAL_FIELDS = [
  { value: "tradeLicense", label: "Trade License", label_ar: "رخصة تجارية" },
  { value: "westernRegionArchiveNo", label: "Western Region Archive No", label_ar: "رقم أرشيف المنطقة الغربية" },
  { value: "abuDhabiArchiveNo", label: "Abu Dhabi Archive No", label_ar: "رقم أرشيف أبوظبي" },
  { value: "alAinArchiveNo", label: "Al Ain Archive No", label_ar: "رقم أرشيف العين" },
] as const;
