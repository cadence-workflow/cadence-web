import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import {
  allWorkflowEventTypesAttrs,
  allWorkflowEventTypesAttrsExtended,
} from '@/views/workflow-history/__fixtures__/all-workflow-event-types-attributes';
import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskScheduleEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';
import {
  type ExtendedHistoryEvent,
  type PendingHistoryEvent,
} from '@/views/workflow-history/workflow-history.types';

import isPendingHistoryEvent from '../is-pending-history-event';

const validEvents: PendingHistoryEvent[] = [
  pendingActivityTaskStartEvent,
  pendingDecisionTaskScheduleEvent,
];

const invalidEvents: Pick<ExtendedHistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrsExtended,
  validEvents,
  'attributes'
);

describe('isPendingHistoryEvent', () => {
  it('should return true for valid activity events', () => {
    validEvents.forEach((event) => {
      expect(isPendingHistoryEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid activity events', () => {
    invalidEvents.forEach((event) => {
      expect(isPendingHistoryEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isPendingHistoryEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isPendingHistoryEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isPendingHistoryEvent({})).toBe(false);
  });
});
