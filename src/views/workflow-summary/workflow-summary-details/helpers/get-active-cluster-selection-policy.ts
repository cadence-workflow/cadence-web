import { type ActiveClusterSelectionPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActiveClusterSelectionPolicy';

import { type WorkflowSummaryFieldArgs } from '../workflow-summary-details.types';

export default function getActiveClusterSelectionPolicy({
  workflowDetails,
  formattedFirstEvent,
}: Pick<
  WorkflowSummaryFieldArgs,
  'workflowDetails' | 'formattedFirstEvent'
>): ActiveClusterSelectionPolicy | null {
  const policy =
    workflowDetails.workflowExecutionInfo?.activeClusterSelectionPolicy ||
    formattedFirstEvent?.activeClusterSelectionPolicy;

  return policy ?? null;
}
