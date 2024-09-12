import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { allWorkflowEventTypesAttrs } from '@/views/workflow-history/__fixtures__/all-workflow-event-types-attributes';
import {
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  completeDecisionTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-decision-events';
import type { DecisionHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import isDecisionEvent from '../is-decision-event';

const validEvents: Pick<DecisionHistoryEvent, 'attributes'>[] = [
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  completeDecisionTaskEvent,
  //TODO @assem.hafez change this to actual mockups
  { attributes: 'decisionTaskTimedOutEventAttributes' },
  { attributes: 'decisionTaskFailedEventAttributes' },
];

const invalidEvents: Pick<HistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrs,
  validEvents,
  'attributes'
);

describe('isDecisionEvent', () => {
  it('should return true for valid decision events', () => {
    validEvents.forEach((event) => {
      expect(isDecisionEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid decision events', () => {
    invalidEvents.forEach((event) => {
      expect(isDecisionEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isDecisionEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isDecisionEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isDecisionEvent({})).toBe(false);
  });
});
