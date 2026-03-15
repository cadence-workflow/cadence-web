import type { WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';
import formatPayloadMap from '@/utils/data-formatters/format-payload-map';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { type WorkflowListItem } from '../list-workflows.types';

export default function getWorkflowListItemFromExecution(
  execution: WorkflowExecutionInfo
): WorkflowListItem | undefined {
  if (!execution.workflowExecution || !execution.type || !execution.startTime) {
    return undefined;
  }

  return {
    workflowID: execution.workflowExecution.workflowId,
    runID: execution.workflowExecution.runId,
    workflowName: execution.type.name,
    status: execution.closeStatus,
    startTime: parseGrpcTimestamp(execution.startTime),
    executionTime: execution.executionTime
      ? parseGrpcTimestamp(execution.executionTime)
      : undefined,
    updateTime: execution.updateTime
      ? parseGrpcTimestamp(execution.updateTime)
      : undefined,
    closeTime: execution.closeTime
      ? parseGrpcTimestamp(execution.closeTime)
      : undefined,
    historyLength: parseInt(execution.historyLength, 10),
    taskList: execution.taskList,
    isCron: execution.isCron,
    clusterAttributeScope:
      execution.activeClusterSelectionPolicy?.clusterAttribute?.scope ??
      undefined,
    clusterAttributeName:
      execution.activeClusterSelectionPolicy?.clusterAttribute?.name ??
      undefined,
    searchAttributes:
      formatPayloadMap(execution.searchAttributes, 'indexedFields') ??
      undefined,
    memo: formatPayloadMap(execution.memo, 'fields') ?? undefined,
  };
}
