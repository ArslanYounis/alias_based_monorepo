import { z } from "zod";

/** File-like shape for cross-platform (Web File | RN asset) */
export const uploadDocumentEntrySchema = z.object({
  file: z.unknown().optional(),
  name: z.string(),
  size: z.number().optional(),
  type: z.string().optional(),
  error: z.string().optional(),
});

export const uploadDocumentsSchema = z.object({
  documents: z.array(uploadDocumentEntrySchema),
}).refine(
  (data) => data.documents.length > 0,
  { message: "At least one document is required", path: ["documents"] }
);

export type UploadDocumentEntry = z.infer<typeof uploadDocumentEntrySchema>;
export type UploadDocumentsSchemaType = z.infer<typeof uploadDocumentsSchema>;

/** Common allowed MIME types for document upload */
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
] as const;

/** Max file size in bytes (e.g. 10MB) */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
