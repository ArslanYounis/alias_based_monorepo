import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface RanchRecipientResponse {
  success: boolean;
  message?: string;
  data?: {
    recipientId?: number;
    ownerId?: number;
  };
}

const ranchRecipient = async (id: number): Promise<RanchRecipientResponse> => {
  const { data } = await axios.post<RanchRecipientResponse>(
    "/ranch/recipient",
    { OwnerIdList: [id] }
  );
  return data;
};

export const useRanchRecipient = () => {
  return useMutation({
    mutationFn: (id: number) => ranchRecipient(id),
  });
};
