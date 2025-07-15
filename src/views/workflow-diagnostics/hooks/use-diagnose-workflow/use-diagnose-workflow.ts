import { useQuery } from '@tanstack/react-query';

import getDiagnoseWorkflowQueryOptions from './get-diagnose-workflow-query-options';
import { type UseDiagnoseWorkflowParams } from './use-diagnose-workflow.types';

export default function useDiagnoseWorkflow(params: UseDiagnoseWorkflowParams) {
  /**
   * We intentionally use a regular (non-suspense) query for diagnostics because:
   * - The hook will be invoked in multiple locations, so we want to leverage the query cache.
   * - Diagnostics can take a while to complete, and we don't want to block the UI while waiting.
   */
  return useQuery(getDiagnoseWorkflowQueryOptions(params));
}
