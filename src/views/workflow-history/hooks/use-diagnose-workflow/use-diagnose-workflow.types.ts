import { type UseQueryOptions } from '@tanstack/react-query';

import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseDiagnoseWorkflowParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type DiagnoseWorkflowQueryOptions = UseQueryOptions<
  DiagnoseWorkflowResponse,
  RequestError,
  DiagnoseWorkflowResponse,
  [string, UseDiagnoseWorkflowParams]
>;
