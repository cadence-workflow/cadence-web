import { type WorkflowSummaryFieldArgs } from '../workflow-summary-details/workflow-summary-details.types';

export default function getActiveClusterSelectionPolicyLabel({
  workflowDetails,
  formattedFirstEvent,
}: WorkflowSummaryFieldArgs): string | null {
  const strategy =
    workflowDetails.workflowExecutionInfo?.activeClusterSelectionPolicy
      ?.strategy || formattedFirstEvent?.activeClusterSelectionPolicy?.strategy;

  switch (strategy) {
    case 'ACTIVE_CLUSTER_SELECTION_STRATEGY_REGION_STICKY':
      return 'Region Sticky';

    case 'ACTIVE_CLUSTER_SELECTION_STRATEGY_EXTERNAL_ENTITY':
      return 'External Entity';

    case 'ACTIVE_CLUSTER_SELECTION_STRATEGY_INVALID':
      return 'Invalid';

    default:
      return null;
  }
}
