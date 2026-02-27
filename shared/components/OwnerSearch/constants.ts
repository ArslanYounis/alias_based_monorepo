import { z } from "zod";

// search by owner multiselect values
export const SearchByOwnerOptionalFields = [
  {
    id: "passportNumber",
    label: "Passport Number",
    label_ar: "رقم الجواز",
    value: "passportNumber",
    value_ar: "passportNumber",
  },
  {
    id: "abuDhabiArchiveNo",
    label: "Abu Dhabi Archive No",
    label_ar: "رقم أرشيف أبوظبي",
    value: "abuDhabiArchiveNo",
    value_ar: "abuDhabiArchiveNo",
  },
  {
    id: "familyNoCity",
    label: "Family No / City",
    label_ar: "رقم العائلة/المدينة",
    value: "familyNoCity",
    value_ar: "familyNoCity",
  },
  {
    id: "westernRegionArchiveNo",
    label: "Western Region Archive No",
    label_ar: "رقم أرشيف المنطقة الغربية",
    value: "westernRegionArchiveNo",
    value_ar: "westernRegionArchiveNo",
  },
  {
    id: "moiUnifiedNumber",
    label: "Moi Unified Number",
    label_ar: "الرقم الموحد لوزارة الداخلية",
    value: "moiUnifiedNumber",
    value_ar: "moiUnifiedNumber",
  },
  {
    id: "alAinArchiveNo",
    label: "Al Ain Archive No",
    label_ar: "رقم أرشيف العين",
    value: "alAinArchiveNo",
    value_ar: "alAinArchiveNo",
  },
];

// search by company owner multiselect values
export const SearchByCompanyOwnerOptionalFields = [
  {
    id: "tradeLicense",
    label: "Trade License",
    label_ar: "رخصة تجارية",
    value: "tradeLicense",
    value_ar: "tradeLicense",
  },
  {
    id: "westernRegionArchiveNo",
    label: "Western Region Archive No",
    label_ar: "رقم أرشيف المنطقة الغربية",
    value: "westernRegionArchiveNo",
    value_ar: "westernRegionArchiveNo",
  },
  {
    id: "abuDhabiArchiveNo",
    label: "Abu Dhabi Archive No",
    label_ar: "رقم أرشيف أبوظبي",
    value: "abuDhabiArchiveNo",
    value_ar: "abuDhabiArchiveNo",
  },
  {
    id: "alAinArchiveNo",
    label: "Al Ain Archive No",
    label_ar: "رقم أرشيف العين",
    value: "alAinArchiveNo",
    value_ar: "alAinArchiveNo",
  },
];

// match type values
export const MatchTypeOptions = [
  { label: "Contains", label_ar: "يحتوي على", value: String(1000), value_ar: String(1000) },
  { label: "Start With", label_ar: "يبدأ بـ", value: String(1001), value_ar: String(1001) },
  { label: "Ends With", label_ar: "ينتهي بـ", value: String(1002), value_ar: String(1002) },
  { label: "Exact", label_ar: "مطابق تمامًا", value: String(1004), value_ar: String(1004) },
];

// result displays values
export const ResultsDisplayOptions = [
  { label: "5", label_ar: "5", value: String(5), value_ar: String(5) },
  { label: "10", label_ar: "10", value: String(10), value_ar: String(10) },
  { label: "15", label_ar: "15", value: String(15), value_ar: String(15) },
  { label: "20", label_ar: "20", value: String(20), value_ar: String(20) },
  { label: "25", label_ar: "25", value: String(25), value_ar: String(25) },
];

// search by owner default values
export const OwnerDefaultValues = {
  nationalNumber: "",
  ownerName: "",
  familyName: "",
  passportNumber: "",
  abuDhabiArchiveNo: "",
  tradeLicense: "",
  westernRegionArchiveNo: "",
  alAinArchiveNo: "",
  familyNoCity: "",
  moiUnifiedNumber: "",
  matchType: "1000",
  resultsDisplay: "5",
};

// search by company owner default values
export const CompanyOwnerDefaultValues = {
  companyName: "",
  certificateNumber: "",
  tradeLicense: "",
  westernRegionArchiveNo: "",
  abuDhabiArchiveNo: "",
  alAinArchiveNo: "",
  matchType: "1000",
  resultsDisplay: "5",
};

const restrictedCharsPattern = /^[A-Za-z0-9/_\-.]+$/;

// search by owner validation schema
export const OwnerSchema = z.object({
  nationalNumber: z.string(),
  ownerName: z.string(),
  familyName: z
    .string()
    .regex(
      restrictedCharsPattern,
      "Family Name can only contain letters, numbers, slash (/), dash (-), underscore (_), and dot (.)"
    )
    .or(z.literal("")),
  passportNumber: z
    .string()
    .regex(
      restrictedCharsPattern,
      "Passport Number can only contain letters, numbers, slash (/), dash (-), underscore (_), and dot (.)"
    )
    .or(z.literal("")),
  abuDhabiArchiveNo: z.string(),
  westernRegionArchiveNo: z.string(),
  alAinArchiveNo: z.string(),
  familyNoCity: z
    .string()
    .regex(
      restrictedCharsPattern,
      "Family No/City can only contain letters, numbers, slash (/), dash (-), underscore (_), and dot (.)"
    )
    .or(z.literal("")),
  matchType: z.string(),
  moiUnifiedNumber: z.string(),
  tradeLicense: z.string(),
  resultsDisplay: z.string(),
});

// search by company owner validation schema
export const CompanyOwnerSchema = z.object({
  companyName: z.string(),
  certificateNumber: z.string(),
  tradeLicense: z.string(),
  westernRegionArchiveNo: z.string(),
  abuDhabiArchiveNo: z.string(),
  alAinArchiveNo: z.string(),
  matchType: z.string(),
  resultsDisplay: z.string(),
});
