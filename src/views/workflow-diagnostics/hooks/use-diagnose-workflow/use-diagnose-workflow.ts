import { useQuery } from '@tanstack/react-query';

import getDiagnoseWorkflowQueryOptions from './get-diagnose-workflow-query-options';
import { type UseDiagnoseWorkflowParams } from './use-diagnose-workflow.types';

export default function useDiagnoseWorkflow(params: UseDiagnoseWorkflowParams) {
  return useQuery(getDiagnoseWorkflowQueryOptions(params));
}
