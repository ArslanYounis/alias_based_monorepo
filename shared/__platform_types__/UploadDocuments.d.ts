import type { ComponentProps, FC } from "react";
import type { UploadDocuments as WebUploadDocuments } from "../../web/src/ui/UploadDocuments";
import type { UploadDocuments as MobileUploadDocuments } from "../../mobile/src/ui/UploadDocuments";

export type UploadDocumentsProps =
  | ComponentProps<typeof WebUploadDocuments>
  | ComponentProps<typeof MobileUploadDocuments>;
export const UploadDocuments: FC<UploadDocumentsProps>;
