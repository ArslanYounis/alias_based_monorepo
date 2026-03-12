import type { ComponentProps, FC } from "react";
import type { UploadDocument as WebUploadDocument } from "../../web/src/ui/UploadDocument";
import type { UploadDocument as MobileUploadDocument } from "../../mobile/src/ui/UploadDocument";

export type UploadDocumentProps =
  | ComponentProps<typeof WebUploadDocument>
  | ComponentProps<typeof MobileUploadDocument>;
export const UploadDocument: FC<UploadDocumentProps>;
