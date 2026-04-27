import { z } from "zod";

// search by company owner default values (initials)
export const DariSearchOwnerDefaultValues = {
    emiratesID: "",
    moiUnifiedNo: "",
    passportNo: "",
    nationality: "",
    ownerName: "",
    email: "",
    mobileNumber: "",
    familyNo: "",
    familyName: "",
    lastCertificateNumber: "",
    matchType: "1000",
    resultsDisplay: "5",
};
// search by owner default values (initials)

export const DariSearchCompanyOwnerDefaultValues = {
    companyName: "",
    licenseNo: "",
    abuDhabiOwnerArchiveNo: "",
    alAinOwnerArchiveNo: "",
    certificateNumber: "",
    westernRegionOwnerArchiveNo: "",
    matchType: "1000",
    resultsDisplay: "5",
};

// search by company owner validation schema
export const DariSearchOwnerSchema = z.object({
    emiratesID: z.string(),
    moiUnifiedNo: z.string(),
    passportNo: z.string(),
    nationality: z.string(),
    ownerName: z.string(),
    email: z.string(),
    mobileNumber: z.string(),
    familyNo: z.string(),
    familyName: z.string(),
    lastCertificateNumber: z.string(),
    matchType: z.string(),
    resultsDisplay: z.string(),
});
// search by owner validation schema
export const DariSearchCompanyOwnerSchema = z.object({
    companyName: z.string(),
    licenseNo: z.string(),
    abuDhabiOwnerArchiveNo: z.string(),
    alAinOwnerArchiveNo: z.string(),
    certificateNumber: z.string(),
    westernRegionOwnerArchiveNo: z.string(),
    matchType: z.string(),
    resultsDisplay: z.string(),
});

export const DariSearchOwnerOptionalFields = [
    { id: "ownerName", label: "Owner Name", label_ar: "اسم المالك", value: "ownerName", value_ar: "ownerName" },
    { id: "email", label: "Email", label_ar: "البريد الإلكتروني", value: "email", value_ar: "email" },
    { id: "mobileNumber", label: "Mobile Number", label_ar: "رقم الجوال", value: "mobileNumber", value_ar: "mobileNumber" },
    { id: "familyNo", label: "Family No", label_ar: "رقم العائلة", value: "familyNo", value_ar: "familyNo" },
    {
        id: "familyName",
        label: "Family Name",
        label_ar: "اسم العائلة",
        value: "familyName",
        value_ar: "familyName",
    },
    { id: "lastCertificateNumber", label: "Last Certificate Number", label_ar: "رقم الشهادة الأخيرة", value: "lastCertificateNumber", value_ar: "lastCertificateNumber" },
];
export const DariSearchCompanyOwnerOptionalFields = [
    { id: "certificateNumber", label: "Certificate Number", label_ar: "رقم الشهادة", value: "certificateNumber", value_ar: "certificateNumber" },
    { id: "westernRegionOwnerArchiveNo", label: "Western Region Owner Archive", label_ar: "أرشيف مالك المنطقة الغربية", value: "westernRegionOwnerArchiveNo", value_ar: "westernRegionOwnerArchiveNo" },
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