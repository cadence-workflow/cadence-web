import { type CountWorkflowsResponse } from '@/route-handlers/count-workflows/count-workflows.types';

export type { CountWorkflowsResponse };

export type UseCountWorkflowsParams = {
  domain: string;
  cluster: string;
  query?: string;
};
