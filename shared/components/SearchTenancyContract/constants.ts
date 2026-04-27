import { z } from "zod";

// match type values (all are same)
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

// result displays values (all are same)
export const ResultsDisplayOptions = [
    { label: "5", label_ar: "5", value: String(5), value_ar: String(5) },
    { label: "10", label_ar: "10", value: String(10), value_ar: String(10) },
    { label: "15", label_ar: "15", value: String(15), value_ar: String(15) },
    { label: "20", label_ar: "20", value: String(20), value_ar: String(20) },
    { label: "25", label_ar: "25", value: String(25), value_ar: String(25) },
];

export const SearchTenancyDefaultValues = {
    contractType: "new",
    contractNumber: "",
    startDate: "",
    matchTypeId: "1000",
    pageSize: "5",
    pageNumber: ""
};

export const SearchTenancySchema = z.object({
    contractType: z.string(),
    contractNumber: z.string(),
    startDate: z.string(),
    matchTypeId: z.string(),
    pageSize: z.string(),
    pageNumber: z.string(),
});
