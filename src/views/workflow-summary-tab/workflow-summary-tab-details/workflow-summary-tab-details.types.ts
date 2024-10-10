import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import {
  type FormattedHistoryEventForType,
  type FormattedHistoryEvent,
} from '@/utils/data-formatters/schema/format-history-event-schema';
import type { WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

type FormattedFirstHistoryEvent =
  FormattedHistoryEventForType<'WorkflowExecutionStarted'> | null;
export type Props = {
  firstHistoryEvent: HistoryEvent;
  lastHistoryEvent: HistoryEvent;
  formattedFirstHistoryEvent: FormattedFirstHistoryEvent;
  formattedCloseHistoryEvent: FormattedHistoryEvent | null;
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
    lastEvent: HistoryEvent;
    formattedFirstEvent: FormattedFirstHistoryEvent;
    formattedCloseEvent: FormattedHistoryEvent | null;
    decodedPageUrlParams: Props['decodedPageUrlParams'];
  }>;
  hide?: (args: {
    firstEvent: HistoryEvent;
    lastEvent: HistoryEvent;
    formattedFirstEvent: FormattedFirstHistoryEvent;
    formattedCloseEvent: FormattedHistoryEvent | null;
    decodedPageUrlParams: Props['decodedPageUrlParams'];
  }) => boolean;
};
