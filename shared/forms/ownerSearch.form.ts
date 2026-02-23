/**
 * OwnerSearch form config: owner type selection and default values.
 * Use with TanStack Form in OwnerSearch component (mobile + web).
 */
import { OwnerSchema, OwnerDefaultValues } from "../schemas";
import type { z } from "zod";

export type OwnerSearchType = "owner" | "company";

export const OWNER_SEARCH_TYPES: { value: OwnerSearchType; label: string; label_ar?: string }[] = [
  { value: "owner", label: "By Owner", label_ar: "حسب المالك" },
  { value: "company", label: "By Company Owner", label_ar: "حسب مالك الشركة" },
];

export function getOwnerSearchDefaultValues(): z.infer<typeof OwnerSchema> {
  return { ...OwnerDefaultValues };
}

export { OwnerSchema, OwnerDefaultValues };
