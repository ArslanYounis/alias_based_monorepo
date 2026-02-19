import { File } from "lucide-react";
import { createUploadDocumentsConfig } from "@shared/configs";
import { UploadDocuments } from "./UploadDocuments";

export const uploadDocumentsConfig = createUploadDocumentsConfig(
  UploadDocuments,
  File
);
