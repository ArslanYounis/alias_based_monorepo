/**
 * UploadDocuments — upload mutation.
 * Apps provide the API function (e.g. multipart form to /documents).
 */
import { useMutation } from "@tanstack/react-query";

export interface UploadDocumentsPayload {
  applicationId?: string;
  files: File[] | { name: string; uri?: string; type?: string }[];
  documentTypeIds?: string[];
}

export function useUploadDocuments(
  uploadFn: (payload: UploadDocumentsPayload) => Promise<unknown>
) {
  return useMutation({
    mutationFn: uploadFn,
  });
}
