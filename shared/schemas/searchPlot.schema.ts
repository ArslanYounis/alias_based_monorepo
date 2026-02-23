import { z } from "zod";

/** Plot search tab — default values and schema (from ADREC searchPlot/constants) */
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
export type PlotSchemaType = z.infer<typeof PlotSchema>;

/** Company owner search tab */
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
export type CompanyOwnerSchemaType = z.infer<typeof CompanyOwnerSchema>;

const restrictedCharsPattern = /^[A-Za-z0-9/_\-.]+$/;

/** Owner search tab */
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
export type OwnerSchemaType = z.infer<typeof OwnerSchema>;

/** Tab key for SearchPlot (matches source; randomAllocation has no form schema, falls back to plot). */
export type SearchPlotTabKey = "plot" | "company" | "owner" | "randomAllocation";
