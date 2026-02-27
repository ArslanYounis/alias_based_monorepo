import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface ApplicationFlags {
  [key: string]: boolean | string | number;
}

interface UrlArgs {
  [key: string]: string | number | boolean;
}

interface Municipality {
  adgeId: string;
  applicationFlags: ApplicationFlags | null;
  customerId: number;
  evaluatorTradeLicenseNumber: string;
  genericGcsCodeId: string;
  inboxId: number;
  isDisableEmailNotification: boolean;
  mailBoxTradeLicenseNumber: string;
  municipalityConst: string;
  municipalityFlagIndex: number;
  municipalityId: number;
  municipalityNameA: string;
  municipalityNameE: string;
  profLicenseDepEmail: string;
  isAreaNeeded: boolean;
  urlArgs: UrlArgs | null;
}

interface Option {
  label: string;
  label_ar?: string;
  value: string;
}

const getMunicipality = async (): Promise<Municipality[]> => {
  const { data } = await axios.get<Municipality[]>("/municipality");
  return data;
};

export const useGetMunicipality = () => {
  const query = useQuery<Municipality[]>({
    queryKey: ["municipalities"],
    queryFn: getMunicipality,
  });

  const options: Option[] = query?.data
    ? query.data.map((m) => ({
        label: m.municipalityNameE,
        label_ar: m.municipalityNameA,
        value: m.municipalityId.toString(),
      }))
    : [];

  return { ...query, options };
};
