import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

import getDiagnoseWorkflowQueryOptions from './get-diagnose-workflow-query-options';
import {
  type DiagnoseWorkflowQueryOptions,
  type UseDiagnoseWorkflowParams,
} from './use-diagnose-workflow.types';

export default function useDiagnoseWorkflow(
  params: UseDiagnoseWorkflowParams,
  additionalOptions?: Partial<DiagnoseWorkflowQueryOptions>
): UseQueryResult<DiagnoseWorkflowResponse, RequestError> {
  return useQuery({
    ...getDiagnoseWorkflowQueryOptions(params),
    ...additionalOptions,
  });
}
