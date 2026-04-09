import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export interface UploadFilePayload {
  name: string;
  file: {
    file_name: string;
    file_type: string;
    file_content: string;
    file_identifier: string;
    file_extension: string;
  };
}

export interface UploadFileArgs {
  payload: UploadFilePayload;
  uploadUrl?: string;
}

const uploadFile = async ({ payload, uploadUrl }: UploadFileArgs) => {
  const response = await axios.post(`/file/upload`, payload, {
    params: { args: uploadUrl },
  });
  return response.data;
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (args: UploadFileArgs) => uploadFile(args),
  });
};
