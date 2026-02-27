import React from "react";

export type FieldComponent<T> = <K extends keyof T>(props: {
  name: K;
  children: (field: {
    state: { value: T[K] };
    handleChange: (val: T[K]) => void;
  }) => React.ReactNode;
}) => React.ReactElement | null;

export interface SimpleForm<T> {
  Field: FieldComponent<T>;
  state: { values: T };
  handleSubmit: () => Promise<void>;
}

export interface RentFeesResponse {
  result: {
    rentFeesPerSqMeterUnit: string;
    feeAmount: string;
    amountInWords: string;
  };
  tenancyContractTypeId?: string;
}
