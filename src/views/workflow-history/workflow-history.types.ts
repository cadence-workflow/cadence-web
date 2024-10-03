import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type workflowPageQueryParamsConfig from '../workflow-page/config/workflow-page-query-params.config';
import { type WorkflowPageTabContentProps } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import type { WorkflowEventStatus } from './workflow-history-event-status-badge/workflow-history-event-status-badge.types';

export type HistoryEventGroupType =
  | 'Activity'
  | 'Decision'
  | 'Timer'
  | 'ChildWorkflowExecution'
  | 'SignalExternalWorkflowExecution'
  | 'RequestCancelExternalWorkflowExecution'
  | 'Event';

export type HistoryGroupEventMetadata = {
  label: string;
  status: WorkflowEventStatus;
  timeMs: number | null;
  timeLabel: string;
};

export type HistoryGroupEventToStatusMap<GroupT extends HistoryEventsGroup> =
  Record<
    GroupT['events'][number]['attributes'],
    | WorkflowEventStatus
    | ((
        event: GroupT['events'][number],
        events: GroupT['events'],
        index: number
      ) => WorkflowEventStatus)
  >;

export type HistoryGroupEventToStringMap<GroupT extends HistoryEventsGroup> =
  Record<GroupT['events'][number]['attributes'], string>;

type BaseHistoryGroup = {
  label: string;
  eventsMetadata: HistoryGroupEventMetadata[];
  status: WorkflowEventStatus;
  hasMissingEvents: boolean;
  timeMs: number | null;
  timeLabel: string;
};

export type ActivityHistoryGroup = BaseHistoryGroup & {
  groupType: 'Activity';
  events: ActivityHistoryEvent[];
};

export type DecisionHistoryGroup = BaseHistoryGroup & {
  groupType: 'Decision';
  events: DecisionHistoryEvent[];
};

export type TimerHistoryGroup = BaseHistoryGroup & {
  groupType: 'Timer';
  events: TimerHistoryEvent[];
};

export type ChildWorkflowExecutionHistoryGroup = BaseHistoryGroup & {
  groupType: 'ChildWorkflowExecution';
  events: ChildWorkflowExecutionHistoryEvent[];
};

export type SignalExternalWorkflowExecutionHistoryGroup = BaseHistoryGroup & {
  groupType: 'SignalExternalWorkflowExecution';
  events: SignalExternalWorkflowExecutionHistoryEvent[];
};

export type RequestCancelExternalWorkflowExecutionHistoryGroup =
  BaseHistoryGroup & {
    groupType: 'RequestCancelExternalWorkflowExecution';
    events: RequestCancelExternalWorkflowExecutionHistoryEvent[];
  };

export type SingleEventHistoryGroup = BaseHistoryGroup & {
  groupType: 'Event';
  events: SingleHistoryEvent[];
};

export type HistoryEventsGroup =
  | ActivityHistoryGroup
  | DecisionHistoryGroup
  | TimerHistoryGroup
  | ChildWorkflowExecutionHistoryGroup
  | SignalExternalWorkflowExecutionHistoryGroup
  | RequestCancelExternalWorkflowExecutionHistoryGroup
  | SingleEventHistoryGroup;

export type HistoryEventsGroups = Record<string, HistoryEventsGroup>;

export type ActivityHistoryEvent = HistoryEvent & {
  attributes:
    | 'activityTaskScheduledEventAttributes'
    | 'activityTaskStartedEventAttributes'
    | 'activityTaskCompletedEventAttributes'
    | 'activityTaskFailedEventAttributes'
    | 'activityTaskTimedOutEventAttributes'
    | 'activityTaskCanceledEventAttributes';
};

export type DecisionHistoryEvent = HistoryEvent & {
  attributes:
    | 'decisionTaskScheduledEventAttributes'
    | 'decisionTaskStartedEventAttributes'
    | 'decisionTaskCompletedEventAttributes'
    | 'decisionTaskFailedEventAttributes'
    | 'decisionTaskTimedOutEventAttributes';
};

export type TimerHistoryEvent = HistoryEvent & {
  attributes:
    | 'timerStartedEventAttributes'
    | 'timerFiredEventAttributes'
    | 'timerCanceledEventAttributes';
};

export type ChildWorkflowExecutionHistoryEvent = HistoryEvent & {
  attributes:
    | 'startChildWorkflowExecutionInitiatedEventAttributes'
    | 'startChildWorkflowExecutionFailedEventAttributes'
    | 'childWorkflowExecutionStartedEventAttributes'
    | 'childWorkflowExecutionCompletedEventAttributes'
    | 'childWorkflowExecutionFailedEventAttributes'
    | 'childWorkflowExecutionCanceledEventAttributes'
    | 'childWorkflowExecutionTimedOutEventAttributes'
    | 'childWorkflowExecutionTerminatedEventAttributes';
};

export type SignalExternalWorkflowExecutionHistoryEvent = HistoryEvent & {
  attributes:
    | 'signalExternalWorkflowExecutionInitiatedEventAttributes'
    | 'signalExternalWorkflowExecutionFailedEventAttributes'
    | 'externalWorkflowExecutionSignaledEventAttributes';
};

export type RequestCancelExternalWorkflowExecutionHistoryEvent =
  HistoryEvent & {
    attributes:
      | 'requestCancelExternalWorkflowExecutionInitiatedEventAttributes'
      | 'requestCancelExternalWorkflowExecutionFailedEventAttributes'
      | 'externalWorkflowExecutionCancelRequestedEventAttributes';
  };

export type SingleHistoryEvent = HistoryEvent & {
  attributes:
    | 'workflowExecutionStartedEventAttributes'
    | 'workflowExecutionCompletedEventAttributes'
    | 'workflowExecutionFailedEventAttributes'
    | 'workflowExecutionTimedOutEventAttributes'
    | 'activityTaskCancelRequestedEventAttributes'
    | 'requestCancelActivityTaskFailedEventAttributes'
    | 'cancelTimerFailedEventAttributes'
    | 'markerRecordedEventAttributes'
    | 'workflowExecutionSignaledEventAttributes'
    | 'workflowExecutionTerminatedEventAttributes'
    | 'workflowExecutionCancelRequestedEventAttributes'
    | 'workflowExecutionCanceledEventAttributes'
    | 'workflowExecutionContinuedAsNewEventAttributes'
    | 'upsertWorkflowSearchAttributesEventAttributes';
};

export type WorkflowHistoryFilterTarget = 'group' | 'event';
export type WorkflowHistoryFilterConfig<
  V extends Partial<PageQueryParamValues<typeof workflowPageQueryParamsConfig>>,
> = PageFilterConfig<typeof workflowPageQueryParamsConfig, V> & {
  filterTarget: WorkflowHistoryFilterTarget;
} & (
    | {
        filterFunc: (d: HistoryEvent, value: V) => boolean;
        filterTarget: 'event';
      }
    | {
        filterFunc: (d: HistoryEventsGroup, value: V) => boolean;
        filterTarget: 'group';
      }
  );

export type Props = WorkflowPageTabContentProps;
