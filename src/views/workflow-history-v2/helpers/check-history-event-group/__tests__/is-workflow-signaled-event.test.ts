import differenceBy from 'lodash/differenceBy';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import { allWorkflowEventTypesAttrs } from '../../../__fixtures__/all-workflow-event-types-attributes';
import type { WorkflowSignaledHistoryEvent } from '../../../workflow-history-v2.types';
import isWorkflowSignaledEvent from '../is-workflow-signaled-event';

const validEvents: Pick<WorkflowSignaledHistoryEvent, 'attributes'>[] = [
  { attributes: 'workflowExecutionSignaledEventAttributes' },
];

const invalidEvents: Pick<HistoryEvent, 'attributes'>[] = differenceBy(
  allWorkflowEventTypesAttrs,
  validEvents,
  'attributes'
);

describe(isWorkflowSignaledEvent.name, () => {
  it('should return true for valid workflowSignaled events', () => {
    validEvents.forEach((event) => {
      expect(isWorkflowSignaledEvent(event)).toBe(true);
    });
  });

  it('should return false for invalid workflowSignaled events', () => {
    invalidEvents.forEach((event) => {
      expect(isWorkflowSignaledEvent(event)).toBe(false);
    });
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type HistoryEvent
    expect(isWorkflowSignaledEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type HistoryEvent
    expect(isWorkflowSignaledEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type HistoryEvent
    expect(isWorkflowSignaledEvent({})).toBe(false);
  });
});
