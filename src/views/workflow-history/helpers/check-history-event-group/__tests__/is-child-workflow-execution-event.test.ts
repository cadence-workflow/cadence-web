import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { allWorkflowEventTypesAttrs } from '@/views/workflow-history/__fixtures__/all-workflow-event-types-attributes';
import type { ChildWorkflowExecutionHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import isChildWorkflowExecutionEvent from '../is-child-workflow-execution-event';

const validEvents: Pick<ChildWorkflowExecutionHistoryEvent, 'attributes'>[] = [
  //TODO @assem.hafez change this to actual mockups
  { attributes: 'childWorkflowExecutionCanceledEventAttributes' },
  { attributes: 'childWorkflowExecutionCompletedEventAttributes' },
  { attributes: 'childWorkflowExecutionFailedEventAttributes' },
  { attributes: 'childWorkflowExecutionStartedEventAttributes' },
  { attributes: 'childWorkflowExecutionTerminatedEventAttributes' },
  { attributes: 'childWorkflowExecutionTimedOutEventAttributes' },
  { attributes: 'startChildWorkflowExecutionFailedEventAttributes' },
  { attributes: 'startChildWorkflowExecutionInitiatedEventAttributes' },
];

const invalidEvents: Pick<HistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrs,
  validEvents,
  'attributes'
);

describe('isChildWorkflowExecutionEvent', () => {
  it('should return true for valid childWorkflowExecution events', () => {
    validEvents.forEach((event) => {
      expect(isChildWorkflowExecutionEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid childWorkflowExecution events', () => {
    invalidEvents.forEach((event) => {
      expect(isChildWorkflowExecutionEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isChildWorkflowExecutionEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isChildWorkflowExecutionEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isChildWorkflowExecutionEvent({})).toBe(false);
  });
});
