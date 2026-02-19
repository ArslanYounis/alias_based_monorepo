import { CreditCardIcon } from "lucide-react";
import { createSignatureConfig } from "@shared/configs";
import { Signature } from "./Signature";

export const signatureConfig = createSignatureConfig(Signature, CreditCardIcon);
