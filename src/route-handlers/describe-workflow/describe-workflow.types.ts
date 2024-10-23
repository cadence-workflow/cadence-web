import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type DescribeWorkflowResponse =
  | DescribeUnArchivedWorkflowResponse
  | DescribeArchivedWorkflowResponse;

export type DescribeUnArchivedWorkflowResponse = Omit<
  DescribeWorkflowExecutionResponse,
  'workflowExecutionInfo'
> & {
  workflowExecutionInfo:
    | (WorkflowExecutionInfo & {
        closeEvent: HistoryEvent | null; // TODO @assem.hafez enhance type to make it close events instead of the generic history event
        isArchived: false;
      })
    | null;
};

export type DescribeArchivedWorkflowResponse = Omit<
  DescribeWorkflowExecutionResponse,
  'workflowExecutionInfo'
> & {
  workflowExecutionInfo: Omit<
    WorkflowExecutionInfo,
    'closeStatus' | 'historyLength' | 'partitionConfig' | 'isCron'
  > & {
    isArchived: true;
    closeEvent: null;
    isCron: null;
    closeStatus: null;
    historyLength: null;
    partitionConfig: null;
  };
};

export type Context = DefaultMiddlewaresContext;
