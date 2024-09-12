import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { allWorkflowEventTypesAttrs } from '@/views/workflow-history/__fixtures__/all-workflow-event-types-attributes';
import type { SignalExternalWorkflowExecutionHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import isSignalExternalWorkflowExecutionEvent from '../is-signal-external-workflow-execution-event';

const validEvents: Pick<
  SignalExternalWorkflowExecutionHistoryEvent,
  'attributes'
>[] = [
  //TODO @assem.hafez change this to actual mockups
  { attributes: 'externalWorkflowExecutionSignaledEventAttributes' },
  { attributes: 'signalExternalWorkflowExecutionFailedEventAttributes' },
  { attributes: 'signalExternalWorkflowExecutionInitiatedEventAttributes' },
];

const invalidEvents: Pick<HistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrs,
  validEvents,
  'attributes'
);

describe('isSignalExternalWorkflowExecutionEvent', () => {
  it('should return true for valid signalExternalWorkflowExecution events', () => {
    validEvents.forEach((event) => {
      expect(isSignalExternalWorkflowExecutionEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid signalExternalWorkflowExecution events', () => {
    invalidEvents.forEach((event) => {
      expect(isSignalExternalWorkflowExecutionEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isSignalExternalWorkflowExecutionEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isSignalExternalWorkflowExecutionEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isSignalExternalWorkflowExecutionEvent({})).toBe(false);
  });
});
