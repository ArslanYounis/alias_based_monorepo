/* istanbul ignore file */
import { createUploadDocumentsConfig } from "@shared/configs";
import { File } from "lucide-react-native";
import { UploadDocuments } from "./UploadDocuments";

export default createUploadDocumentsConfig(UploadDocuments, File);
