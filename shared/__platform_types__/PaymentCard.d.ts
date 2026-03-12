import type { ComponentProps, FC } from "react";
import type { PaymentCard as WebPaymentCard } from "../../web/src/ui/PaymentCard";
import type { PaymentCard as MobilePaymentCard } from "../../mobile/src/ui/PaymentCard";

export type PaymentCardProps =
  | ComponentProps<typeof WebPaymentCard>
  | ComponentProps<typeof MobilePaymentCard>;
export const PaymentCard: FC<PaymentCardProps>;
