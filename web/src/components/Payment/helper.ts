import { z } from "zod";

export const ContractSchema = z.object({
    tenancyContractType: z.enum(["new", "renew"]),
    contractDate: z.string().nonempty("Contract date is required"),
    contractNumber: z.string().nonempty("Contract number is required"),
    registrationFees: z.string().nonempty("Registration fees are required"),
    amountInWords: z.string().nonempty("Amount in words is required"),
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required"),
    emergencyNumber: z.string().nonempty("Emergency number is required"),
});
export const ContractErrorMessagesAr: Record<
    keyof z.infer<typeof ContractSchema>,
    string
> = {
    tenancyContractType: "نوع عقد الإيجار مطلوب",
    contractDate: "تاريخ العقد مطلوب",
    contractNumber: "رقم العقد مطلوب",
    registrationFees: "رسوم تسجيل العقد مطلوبة",
    amountInWords: "المبلغ كتابةً مطلوب",
    startDate: "تاريخ البدء مطلوب",
    endDate: "تاريخ الانتهاء مطلوب",
    emergencyNumber: "رقم الطوارئ مطلوب",
};
export const getContractErrorMessages = (
    name: keyof z.infer<typeof ContractSchema>,
    externalErrors?: Partial<Record<keyof z.infer<typeof ContractSchema>, string>>
) => {
    const en = externalErrors?.[name];
    const ar = ContractErrorMessagesAr[name];
    return { en, ar };
};

export const MeasurementSchema = z.object({
    units: z.enum(["Square Feet", "Square Meter"], {
        required_error: "Please select a unit of measurement",
    }),
    ranchType: z.enum(["3", "4", "5"], {
        required_error: "Please select a ranch type",
    }),
    rentFees: z.string().nonempty("Rent fees are required"),
    measurementRegistrationFees: z.string().nonempty("Registration fees are required"),
    measurementAmountInWords: z.string().nonempty("Amount in words is required"),
    tenancyRemarks: z.string().optional(),
});
export const MeasurementErrorMessagesAr: Record<
    keyof z.infer<typeof MeasurementSchema>,
    string
> = {
    units: "يرجى اختيار وحدة القياس",
    ranchType: "يرجى اختيار نوع المزرعة",
    rentFees: "رسوم الإيجار مطلوبة",
    measurementRegistrationFees: "رسوم التسجيل مطلوبة",
    measurementAmountInWords: "المبلغ كتابةً مطلوب",
    tenancyRemarks: "",
};
export const getMeasurementErrorMessages = (
    name: keyof z.infer<typeof MeasurementSchema>,
    externalErrors?: Partial<Record<keyof z.infer<typeof MeasurementSchema>, string>>
) => {
    const en = externalErrors?.[name];
    const ar = MeasurementErrorMessagesAr[name];
    return { en, ar };
};

export const InsuranceSchema = z.object({
    insuranceFee: z.enum(["Yes", "No"], {
        required_error: "Please select a insurance fee",
    }),
    insuranceRegistrationFees: z.string().nonempty("Registration fees are required"),
    insuranceAmountInWords: z.string().nonempty("Amount in words is required"),
});
export const InsuranceErrorMessagesAr: Record<
    keyof z.infer<typeof InsuranceSchema>,
    string
> = {
    insuranceFee: "يرجى اختيار رسوم التأمين",
    insuranceRegistrationFees: "رسوم التسجيل مطلوبة",
    insuranceAmountInWords: "المبلغ كتابةً مطلوب",
};
export const getInsuranceErrorMessages = (
    name: keyof z.infer<typeof InsuranceSchema>,
    externalErrors?: Partial<Record<keyof z.infer<typeof InsuranceSchema>, string>>
) => {
    const en = externalErrors?.[name];
    const ar = InsuranceErrorMessagesAr[name];
    return { en, ar };
};

export const RentSchema = z.object({
    insuranceFee: z.enum(["Yes", "No"], {
        required_error: "Please select an insurance fee option",
    }),
    rentPaymentStartDate: z
        .string()
        .nonempty("Rent payment start date is required"),
    rentPaymentEndDate: z.string().nonempty("Rent payment end date is required"),
    paymentAmount: z.string().nonempty("Payment amount is required"),
    isFirstYearFreeOfPayment: z.boolean().optional(),
    exemptSocialAssistance: z.boolean().optional(),
});
export const RentErrorMessagesAr: Record<
    keyof z.infer<typeof RentSchema>,
    string
> = {
    insuranceFee: "يرجى اختيار خيار رسوم التأمين",
    rentPaymentStartDate: "تاريخ بدء دفع الإيجار مطلوب",
    rentPaymentEndDate: "تاريخ نهاية دفع الإيجار مطلوب",
    paymentAmount: "مبلغ الدفع مطلوب",
    isFirstYearFreeOfPayment: "",
    exemptSocialAssistance: "",
};
export const getRentErrorMessages = (
    name: keyof z.infer<typeof RentSchema>,
    externalErrors?: Partial<Record<keyof z.infer<typeof RentSchema>, string>>
) => {
    const en = externalErrors?.[name];
    const ar = RentErrorMessagesAr[name];
    return { en, ar };
};
