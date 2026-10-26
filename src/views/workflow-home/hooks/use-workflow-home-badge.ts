import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';

import getHomeBadge from '../helpers/get-home-badge';

import { type UseWorkflowHomeBadgeParams } from './use-workflow-home-badge.types';
import useWorkflowHomeQuery from './use-workflow-home-query';

export default function useWorkflowHomeBadge({
  domain,
  cluster,
  workflowId,
  runId,
}: UseWorkflowHomeBadgeParams): string | undefined {
  const { data: isWorkflowHomeEnabled } = useSuspenseConfigValue(
    'WORKFLOW_HOME_ENABLED'
  );

  // Shares the cache with the describe query of the page
  const { data: workflowDetails } = useDescribeWorkflow({
    domain,
    cluster,
    workflowId,
    runId,
    enabled: isWorkflowHomeEnabled,
  });
  const isArchived =
    workflowDetails?.workflowExecutionInfo?.isArchived ?? false;

  // The badge comes from the home page result, so the query runs on page load
  const { data: homeData } = useWorkflowHomeQuery(
    { domain, cluster, workflowId, runId },
    { enabled: isWorkflowHomeEnabled && !!workflowDetails && !isArchived }
  );

  return getHomeBadge(homeData);
}
