import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import { allWorkflowEventTypesAttrs } from '../../../__fixtures__/all-workflow-event-types-attributes';
import type { SingleHistoryEvent } from '../../../workflow-history-v2.types';
import isSingleEvent from '../is-single-event';

const validEvents: Pick<SingleHistoryEvent, 'attributes'>[] = [
  //TODO @assem.hafez change this to actual mockups
  { attributes: 'activityTaskCancelRequestedEventAttributes' },
  { attributes: 'requestCancelActivityTaskFailedEventAttributes' },
  { attributes: 'cancelTimerFailedEventAttributes' },
  { attributes: 'markerRecordedEventAttributes' },
  { attributes: 'upsertWorkflowSearchAttributesEventAttributes' },
  { attributes: 'workflowExecutionSignaledEventAttributes' },
  { attributes: 'workflowExecutionStartedEventAttributes' },
  { attributes: 'workflowExecutionCompletedEventAttributes' },
  { attributes: 'workflowExecutionFailedEventAttributes' },
  { attributes: 'workflowExecutionTimedOutEventAttributes' },
  { attributes: 'workflowExecutionTerminatedEventAttributes' },
  { attributes: 'workflowExecutionCancelRequestedEventAttributes' },
  { attributes: 'workflowExecutionCanceledEventAttributes' },
  { attributes: 'workflowExecutionContinuedAsNewEventAttributes' },
];

const invalidEvents: Pick<HistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrs,
  validEvents,
  'attributes'
);

describe('isSingleEvent', () => {
  it('should return true for valid single events', () => {
    validEvents.forEach((event) => {
      expect(isSingleEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid single events', () => {
    invalidEvents.forEach((event) => {
      expect(isSingleEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isSingleEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isSingleEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isSingleEvent({})).toBe(false);
  });
});
