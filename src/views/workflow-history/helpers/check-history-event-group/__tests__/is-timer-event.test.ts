import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { allWorkflowEventTypesAttrs } from '@/views/workflow-history/__fixtures__/all-workflow-event-types-attributes';
import type { TimerHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import isTimerEvent from '../is-timer-event';

const validEvents: Pick<TimerHistoryEvent, 'attributes'>[] = [
  //TODO @assem.hafez change this to actual mockups
  { attributes: 'timerCanceledEventAttributes' },
  { attributes: 'timerFiredEventAttributes' },
  { attributes: 'timerStartedEventAttributes' },
];

const invalidEvents: Pick<HistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrs,
  validEvents,
  'attributes'
);

describe('isTimerEvent', () => {
  it('should return true for valid timer events', () => {
    validEvents.forEach((event) => {
      expect(isTimerEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid timer events', () => {
    invalidEvents.forEach((event) => {
      expect(isTimerEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isTimerEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isTimerEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isTimerEvent({})).toBe(false);
  });
});
