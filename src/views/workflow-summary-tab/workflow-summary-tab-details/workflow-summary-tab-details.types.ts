import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import {
  type FormattedHistoryEventForType,
  type FormattedHistoryEvent,
} from '@/utils/data-formatters/schema/format-history-event-schema';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

type FormattedFirstHistoryEvent =
  FormattedHistoryEventForType<'WorkflowExecutionStarted'> | null;
export type Props = {
  firstHistoryEvent: HistoryEvent;
  closeHistoryEvent: HistoryEvent | null;
  formattedFirstHistoryEvent: FormattedFirstHistoryEvent;
  formattedCloseHistoryEvent: FormattedHistoryEvent | null;
  workflowDetails: DescribeWorkflowResponse;
  decodedPageUrlParams: WorkflowPageTabContentProps['params'];
};

export type WorkflowSummaryTabDetailsComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type WorkflowSummaryTabDetailsConfig = {
  key: string;
  getLabel: () => string;
  valueComponent: React.ComponentType<{
    firstEvent: HistoryEvent;
    closeEvent: HistoryEvent | null;
    formattedFirstEvent: FormattedFirstHistoryEvent;
    formattedCloseEvent: FormattedHistoryEvent | null;
    workflowDetails: DescribeWorkflowResponse;
    decodedPageUrlParams: Props['decodedPageUrlParams'];
  }>;
  hide?: (args: {
    firstEvent: HistoryEvent;
    closeEvent: HistoryEvent | null;
    formattedFirstEvent: FormattedFirstHistoryEvent;
    formattedCloseEvent: FormattedHistoryEvent | null;
    workflowDetails: DescribeWorkflowResponse;
    decodedPageUrlParams: Props['decodedPageUrlParams'];
  }) => boolean;
};
