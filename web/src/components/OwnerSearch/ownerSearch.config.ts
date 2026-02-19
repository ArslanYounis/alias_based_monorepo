import { FolderSymlinkIcon } from "lucide-react";
import { createOwnerSearchConfig } from "@shared/configs";
import { OwnerSearch } from "./OwnerSearch";

export const ownerSearchConfig = createOwnerSearchConfig(
  OwnerSearch,
  FolderSymlinkIcon
);
