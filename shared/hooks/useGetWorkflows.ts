import axios from "axios";
import { useQuery } from "@tanstack/react-query";

/** A single workflow returned by GET /dari/workflow/get-workflows. */
export interface WorkflowDto {
  workflowID: number;
  workflowNameEn: string;
  workflowNameAr: string;
  wFDescriptionEn?: string;
  wFDescriptionAr?: string;
  workflowTypeID?: number;
  workflowTypeNameEn?: string;
  workflowTypeNameAr?: string;
  wFTypeDescriptionEn?: string;
  wFTypeDescriptionAr?: string;
  fees?: string | number;
  workflowTypeConst?: string;
}

/**
 * The endpoint returns an object whose keys are the group titles and whose
 * values are the workflows belonging to that group.
 */
export type GetWorkflowsResponse = Record<string, WorkflowDto[]>;

export interface WorkflowGroup {
  /** Object key from the response — used as the group title. */
  key: string;
  workflows: WorkflowDto[];
}

const getWorkflows = async (): Promise<GetWorkflowsResponse> => {
  const { data } = await axios.get<GetWorkflowsResponse>(
    "/dari/workflow/get-workflows"
  );
  return data ?? {};
};

/**
 * Fetches the workflow catalogue and normalises the keyed response into an
 * ordered list of groups (key → workflows).
 */
export const useGetWorkflows = (enabled = true) => {
  const query = useQuery<GetWorkflowsResponse>({
    queryKey: ["dari-workflows"],
    queryFn: getWorkflows,
    enabled,
  });

  const groups: WorkflowGroup[] = Object.entries(query.data ?? {}).map(
    ([key, workflows]) => ({ key, workflows: workflows ?? [] })
  );

  return { ...query, groups };
};
