/**
 * Shared file validation for UploadDocuments.
 * Works with File (web) or file-like { name, size } (e.g. RN picker result).
 */

export interface FileLike {
  name: string;
  size?: number;
}

/** Check by extension: allowedTypes can be MIME types or extensions (e.g. "pdf", "jpg"). */
export function isFileTypeAllowed(
  file: FileLike,
  allowedTypes: string[] | undefined
): boolean {
  if (!allowedTypes?.length) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const normalized = allowedTypes.map((t) => t.toLowerCase().replace(/^\./, ""));
  return normalized.includes(ext) || normalized.some((t) => t.includes("/") && ext.length > 0);
}

/** Check file size (bytes). Pass 0 or undefined to skip. */
export function isFileSizeWithinLimit(
  file: FileLike,
  maxSizeBytes: number | undefined
): boolean {
  if (maxSizeBytes == null || maxSizeBytes <= 0) return true;
  const size = file.size ?? 0;
  return size <= maxSizeBytes;
}

export type FileValidationError = "fileType" | "fileSize" | null;

export interface ValidateFileOptions {
  allowedTypes?: string[];
  maxSizeBytes?: number;
}

/** Validate file type and size. Returns error kind or null if valid. */
export function validateFile(
  file: FileLike,
  options: ValidateFileOptions
): FileValidationError {
  if (!isFileTypeAllowed(file, options.allowedTypes)) return "fileType";
  if (!isFileSizeWithinLimit(file, options.maxSizeBytes)) return "fileSize";
  return null;
}
