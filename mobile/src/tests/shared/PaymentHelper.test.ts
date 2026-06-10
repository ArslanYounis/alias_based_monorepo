/**
 * Unit tests for shared/components/Payment/helper.ts
 *
 * These are pure functions / schemas — tested directly with no rendering.
 * Covers each getX...ErrorMessages branch (en present / en absent, ar lookup)
 * and basic schema validation success / failure paths.
 */
import {
  ContractSchema,
  ContractErrorMessagesAr,
  getContractErrorMessages,
  MeasurementSchema,
  MeasurementErrorMessagesAr,
  getMeasurementErrorMessages,
  InsuranceSchema,
  InsuranceErrorMessagesAr,
  getInsuranceErrorMessages,
  RentSchema,
  RentErrorMessagesAr,
  getRentErrorMessages,
} from "@shared/components/Payment/helper";

describe("Payment/helper", () => {
  // ── getContractErrorMessages ──────────────────────────────────────────────
  describe("getContractErrorMessages", () => {
    it("returns the Arabic message and undefined en when no external errors", () => {
      const res = getContractErrorMessages("contractNumber");
      expect(res.en).toBeUndefined();
      expect(res.ar).toBe(ContractErrorMessagesAr.contractNumber);
    });

    it("returns the external en message when provided", () => {
      const res = getContractErrorMessages("contractNumber", {
        contractNumber: "Custom EN error",
      });
      expect(res.en).toBe("Custom EN error");
      expect(res.ar).toBe(ContractErrorMessagesAr.contractNumber);
    });

    it("returns undefined en when external errors object lacks the key", () => {
      const res = getContractErrorMessages("startDate", {
        contractNumber: "x",
      });
      expect(res.en).toBeUndefined();
      expect(res.ar).toBe(ContractErrorMessagesAr.startDate);
    });
  });

  describe("ContractSchema", () => {
    const valid = {
      tenancyContractType: "new",
      contractDate: "2026-01-01",
      contractNumber: "CN-1",
      registrationFees: "100",
      amountInWords: "one hundred",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      emergencyNumber: "0500000000",
    };

    it("parses a valid contract", () => {
      expect(ContractSchema.safeParse(valid).success).toBe(true);
    });

    it("fails when a required string is empty", () => {
      const res = ContractSchema.safeParse({ ...valid, contractNumber: "" });
      expect(res.success).toBe(false);
    });

    it("fails when tenancyContractType is not new/renew", () => {
      const res = ContractSchema.safeParse({
        ...valid,
        tenancyContractType: "other",
      });
      expect(res.success).toBe(false);
    });
  });

  // ── getMeasurementErrorMessages ───────────────────────────────────────────
  describe("getMeasurementErrorMessages", () => {
    it("returns Arabic and undefined en when no external errors", () => {
      const res = getMeasurementErrorMessages("rentFees");
      expect(res.en).toBeUndefined();
      expect(res.ar).toBe(MeasurementErrorMessagesAr.rentFees);
    });

    it("returns external en message when provided", () => {
      const res = getMeasurementErrorMessages("units", { units: "Pick a unit" });
      expect(res.en).toBe("Pick a unit");
      expect(res.ar).toBe(MeasurementErrorMessagesAr.units);
    });
  });

  describe("MeasurementSchema", () => {
    const valid = {
      units: "Square Feet",
      ranchType: "3",
      rentFees: "100",
      measurementRegistrationFees: "10",
      measurementAmountInWords: "ten",
    };

    it("parses a valid measurement (tenancyRemarks optional)", () => {
      expect(MeasurementSchema.safeParse(valid).success).toBe(true);
    });

    it("fails for an invalid ranchType", () => {
      expect(
        MeasurementSchema.safeParse({ ...valid, ranchType: "9" }).success
      ).toBe(false);
    });

    it("fails for an invalid unit", () => {
      expect(
        MeasurementSchema.safeParse({ ...valid, units: "Acres" }).success
      ).toBe(false);
    });
  });

  // ── getInsuranceErrorMessages ─────────────────────────────────────────────
  describe("getInsuranceErrorMessages", () => {
    it("returns Arabic and undefined en when no external errors", () => {
      const res = getInsuranceErrorMessages("insuranceFee");
      expect(res.en).toBeUndefined();
      expect(res.ar).toBe(InsuranceErrorMessagesAr.insuranceFee);
    });

    it("returns external en message when provided", () => {
      const res = getInsuranceErrorMessages("insuranceAmountInWords", {
        insuranceAmountInWords: "Required",
      });
      expect(res.en).toBe("Required");
      expect(res.ar).toBe(InsuranceErrorMessagesAr.insuranceAmountInWords);
    });
  });

  describe("InsuranceSchema", () => {
    const valid = {
      insuranceFee: "Yes",
      insuranceRegistrationFees: "10",
      insuranceAmountInWords: "ten",
    };

    it("parses a valid insurance object", () => {
      expect(InsuranceSchema.safeParse(valid).success).toBe(true);
    });

    it("fails when insuranceFee is invalid", () => {
      expect(
        InsuranceSchema.safeParse({ ...valid, insuranceFee: "Maybe" }).success
      ).toBe(false);
    });
  });

  // ── getRentErrorMessages ──────────────────────────────────────────────────
  describe("getRentErrorMessages", () => {
    it("returns Arabic and undefined en when no external errors", () => {
      const res = getRentErrorMessages("paymentAmount");
      expect(res.en).toBeUndefined();
      expect(res.ar).toBe(RentErrorMessagesAr.paymentAmount);
    });

    it("returns external en message when provided", () => {
      const res = getRentErrorMessages("rentPaymentStartDate", {
        rentPaymentStartDate: "Pick a date",
      });
      expect(res.en).toBe("Pick a date");
      expect(res.ar).toBe(RentErrorMessagesAr.rentPaymentStartDate);
    });
  });

  describe("RentSchema", () => {
    const valid = {
      insuranceFee: "No",
      rentPaymentStartDate: "2026-01-01",
      rentPaymentEndDate: "2026-12-31",
      paymentAmount: "5000",
    };

    it("parses a valid rent object (optional booleans omitted)", () => {
      expect(RentSchema.safeParse(valid).success).toBe(true);
    });

    it("parses with optional booleans provided", () => {
      expect(
        RentSchema.safeParse({
          ...valid,
          isFirstYearFreeOfPayment: true,
          exemptSocialAssistance: false,
        }).success
      ).toBe(true);
    });

    it("fails when paymentAmount is empty", () => {
      expect(
        RentSchema.safeParse({ ...valid, paymentAmount: "" }).success
      ).toBe(false);
    });
  });
});
