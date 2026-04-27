import { z } from "zod";

export const PlotDefaultValues = {
    municipality: "",
    zone: "",
    sector: "",
    road: "",
    landuseId: "",
    plotNumber: "",
    publicHouseNumber: "",
    plotFileNumber: "",
    plotAddress: "",
    matchType: "1000",
    resultsDisplay: "5",
}
export const PlotSchema = z.object({
    municipality: z.string().min(1, "Municipality is required"),
    zone: z.string().min(1, "Zone/District is required"),
    sector: z.string(),
    road: z.string(),
    landuseId: z.string(),
    plotNumber: z.string(),
    publicHouseNumber: z.string(),
    plotFileNumber: z.string(),
    plotAddress: z.string(),
    matchType: z.string(),
    resultsDisplay: z.string(),
});
export const SearchByPlotOptionalFields = [
    { id: "sector", label: "Sector/Community", label_ar: "القطاع / المجتمع", value: "sector", value_ar: "sector" },
    { id: "road", label: "Road", label_ar: "الشارع", value: "road", value_ar: "road" },
    { id: "landuseId", label: "Land Use", label_ar: "استخدام الأرض", value: "landuseId", value_ar: "landuseId" },
    { id: "plotNumber", label: "Plot Number", label_ar: "رقم القطعة", value: "plotNumber", value_ar: "plotNumber" },
    {
        id: "publicHouseNumber",
        label: "Public House Number",
        label_ar: "رقم المنزل العام",
        value: "publicHouseNumber",
        value_ar: "publicHouseNumber",
    },
    { id: "plotFileNumber", label: "Plot File Number", label_ar: "رقم ملف القطعة", value: "plotFileNumber", value_ar: "plotFileNumber" },
    { id: "plotAddress", label: "Plot Address", label_ar: "عنوان القطعة", value: "plotAddress", value_ar: "plotAddress" },
];
export const MatchTypeOptions = [
    { label: "Contains", label_ar: "يحتوي على", value: String(1000), value_ar: String(1000) },
    { label: "Start With", label_ar: "يبدأ بـ", value: String(1001), value_ar: String(1001) },
    { label: "Ends With", label_ar: "ينتهي بـ", value: String(1002), value_ar: String(1002) },
    { label: "Exact", label_ar: "مطابق تمامًا", value: String(1004), value_ar: String(1004) },
];

// result displays values (all are same)
export const ResultsDisplayOptions = [
    { label: "5", label_ar: "5", value: String(5), value_ar: String(5) },
    { label: "10", label_ar: "10", value: String(10), value_ar: String(10) },
    { label: "15", label_ar: "15", value: String(15), value_ar: String(15) },
    { label: "20", label_ar: "20", value: String(20), value_ar: String(20) },
    { label: "25", label_ar: "25", value: String(25), value_ar: String(25) },
]