import type { useDownload as WebUseDownload } from "../../../web/src/ui/sharedHooks/useDownload";
import type { useDownload as MobileUseDownload } from "../../../mobile/src/ui/sharedHooks/useDownload";

export declare const useDownload: typeof WebUseDownload | typeof MobileUseDownload;
