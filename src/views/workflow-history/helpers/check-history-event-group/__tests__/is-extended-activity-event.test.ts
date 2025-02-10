import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import {
  allWorkflowEventTypesAttrs,
  allWorkflowEventTypesAttrsExtended,
} from '@/views/workflow-history/__fixtures__/all-workflow-event-types-attributes';
import {
  cancelActivityTaskEvent,
  completeActivityTaskEvent,
  failedActivityTaskEvent,
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  timeoutActivityTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';
import { pendingActivityTaskStartEvent } from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';
import {
  type ExtendedHistoryEvent,
  type ExtendedActivityHistoryEvent,
} from '@/views/workflow-history/workflow-history.types';

import isExtendedActivityEvent from '../is-extended-activity-event';

const validEvents: ExtendedActivityHistoryEvent[] = [
  pendingActivityTaskStartEvent,
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  completeActivityTaskEvent,
  failedActivityTaskEvent,
  timeoutActivityTaskEvent,
  cancelActivityTaskEvent,
];

const invalidEvents: Pick<ExtendedHistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrsExtended,
  validEvents,
  'attributes'
);

describe('isExtendedActivityEvent', () => {
  it('should return true for valid activity events', () => {
    validEvents.forEach((event) => {
      expect(isExtendedActivityEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid activity events', () => {
    invalidEvents.forEach((event) => {
      expect(isExtendedActivityEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isExtendedActivityEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isExtendedActivityEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isExtendedActivityEvent({})).toBe(false);
  });
});
