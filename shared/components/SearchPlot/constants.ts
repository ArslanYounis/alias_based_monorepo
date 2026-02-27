import { z } from "zod";

// ─── Plot ────────────────────────────────────────────────────────────────────

export const PlotDefaultValues = {
  municipality: "",
  zone: "",
  sector: "",
  road: "",
  landuseId: "",
  plotNumber: "",
  publicHouseNumber: "",
  plotFileNumber: "",
  matchType: "1000",
  resultsDisplay: "5",
};

export const PlotSchema = z.object({
  municipality: z.string().min(1, "Municipality is required"),
  zone: z.string().min(1, "Zone/District is required"),
  sector: z.string(),
  road: z.string(),
  landuseId: z.string(),
  plotNumber: z.string(),
  publicHouseNumber: z.string(),
  plotFileNumber: z.string(),
  matchType: z.string(),
  resultsDisplay: z.string(),
});

export const SearchByPlotOptionalFields = [
  {
    id: "sector",
    label: "Sector/Community",
    label_ar: "القطاع / المجتمع",
    value: "sector",
    value_ar: "sector",
  },
  {
    id: "road",
    label: "Road",
    label_ar: "الشارع",
    value: "road",
    value_ar: "road",
  },
  {
    id: "landuseId",
    label: "Land Use",
    label_ar: "استخدام الأرض",
    value: "landuseId",
    value_ar: "landuseId",
  },
  {
    id: "plotNumber",
    label: "Plot Number",
    label_ar: "رقم القطعة",
    value: "plotNumber",
    value_ar: "plotNumber",
  },
  {
    id: "publicHouseNumber",
    label: "Public House Number",
    label_ar: "رقم المنزل العام",
    value: "publicHouseNumber",
    value_ar: "publicHouseNumber",
  },
  {
    id: "plotFileNumber",
    label: "Plot File Number",
    label_ar: "رقم ملف القطعة",
    value: "plotFileNumber",
    value_ar: "plotFileNumber",
  },
];

// ─── Company Owner ────────────────────────────────────────────────────────────

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

// ─── Owner ────────────────────────────────────────────────────────────────────

const restrictedCharsPattern = /^[A-Za-z0-9/_\-.]+$/;

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

// ─── Shared options ───────────────────────────────────────────────────────────

export const MatchTypeOptions = [
  {
    label: "Contains",
    label_ar: "يحتوي على",
    value: String(1000),
    value_ar: String(1000),
  },
  {
    label: "Start With",
    label_ar: "يبدأ بـ",
    value: String(1001),
    value_ar: String(1001),
  },
  {
    label: "Ends With",
    label_ar: "ينتهي بـ",
    value: String(1002),
    value_ar: String(1002),
  },
  {
    label: "Exact",
    label_ar: "مطابق تمامًا",
    value: String(1004),
    value_ar: String(1004),
  },
];

export const ResultsDisplayOptions = [
  { label: "5", label_ar: "5", value: String(5), value_ar: String(5) },
  { label: "10", label_ar: "10", value: String(10), value_ar: String(10) },
  { label: "15", label_ar: "15", value: String(15), value_ar: String(15) },
  { label: "20", label_ar: "20", value: String(20), value_ar: String(20) },
  { label: "25", label_ar: "25", value: String(25), value_ar: String(25) },
];
