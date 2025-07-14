import { useSuspenseQuery } from '@tanstack/react-query';

import getIsWorkflowDiagnosticsEnabledQueryOptions from './get-is-workflow-diagnostics-enabled-query-options';

export default function useSuspenseIsWorkflowDiagnosticsEnabled() {
  return useSuspenseQuery(getIsWorkflowDiagnosticsEnabledQueryOptions());
}
