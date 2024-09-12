import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { allWorkflowEventTypesAttrs } from '@/views/workflow-history/__fixtures__/all-workflow-event-types-attributes';
import type { RequestCancelExternalWorkflowExecutionHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import isRequestCancelExternalWorkflowExecutionEvent from '../is-request-cancel-external-workflow-execution-event';

const validEvents: Pick<
  RequestCancelExternalWorkflowExecutionHistoryEvent,
  'attributes'
>[] = [
  //TODO @assem.hafez change this to actual mockups
  { attributes: 'externalWorkflowExecutionCancelRequestedEventAttributes' },
  { attributes: 'requestCancelExternalWorkflowExecutionFailedEventAttributes' },
  {
    attributes:
      'requestCancelExternalWorkflowExecutionInitiatedEventAttributes',
  },
];

const invalidEvents: Pick<HistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrs,
  validEvents,
  'attributes'
);

describe('isRequestCancelExternalWorkflowExecutionEvent', () => {
  it('should return true for valid requestCancelExternalWorkflowExecution events', () => {
    validEvents.forEach((event) => {
      expect(isRequestCancelExternalWorkflowExecutionEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid decision events', () => {
    invalidEvents.forEach((event) => {
      expect(isRequestCancelExternalWorkflowExecutionEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isRequestCancelExternalWorkflowExecutionEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isRequestCancelExternalWorkflowExecutionEvent(undefined)).toBe(
      false
    );
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isRequestCancelExternalWorkflowExecutionEvent({})).toBe(false);
  });
});
